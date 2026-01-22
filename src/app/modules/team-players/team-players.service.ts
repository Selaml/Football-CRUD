import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { TeamPlayerModel } from './entities/team-player.entity';
import { TeamPlayer, TeamPlayerDocument } from './entities/team-player.entity';
import { CreateTeamPlayerDto } from './dto/create-team-player.dto';
import { BulkAssignTeamPlayerDto } from './dto/bulk-assign-team-player.dto';
import { UpdateTeamPlayerDto } from './dto/update-team-player.dto';
import { TeamsService } from '../teams/teams.service';
import { PlayersService } from '../players/players.service';

@Injectable()
export class TeamPlayersService {
  constructor(
    @InjectModel(TeamPlayer.name) private teamPlayerModel: TeamPlayerModel,
    private teamsService: TeamsService,
    private playersService: PlayersService,
  ) {}

  /**
   * Helper method to validate and convert string ID to ObjectId
   */
  private validateAndConvertId(id: string): Types.ObjectId {
    const sanitizedId = id.trim();
    
    if (!Types.ObjectId.isValid(sanitizedId)) {
      throw new BadRequestException(`Invalid team-player relationship ID format: "${id}"`);
    }
    
    return new Types.ObjectId(sanitizedId);
  }

  /**
   * Assign a player to a team (create a new team-player relationship)
   * Validates:
   * - Both teamId and playerId exist
   * - Relationship doesn't already exist (unique constraint)
   */
  async assignPlayerToTeam(createTeamPlayerDto: CreateTeamPlayerDto): Promise<TeamPlayerDocument> {
    const { teamId, playerId } = createTeamPlayerDto;

    // Validate and convert IDs
    const teamObjectId = this.validateAndConvertId(teamId);
    const playerObjectId = this.validateAndConvertId(playerId);

    // Validate team exists
    try {
      await this.teamsService.findOneTeam(teamId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Team with ID "${teamId}" not found`);
      }
      throw error;
    }

    // Validate player exists
    try {
      await this.playersService.findOnePlayer(playerId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Player with ID "${playerId}" not found`);
      }
      throw error;
    }

    // Check if relationship already exists
    const existingRelationship = await this.teamPlayerModel.findOne({
      teamId: teamObjectId,
      playerId: playerObjectId,
    });

    if (existingRelationship) {
      throw new ConflictException(
        `Player "${playerId}" is already associated with team "${teamId}"`
      );
    }

    const teamPlayer = new this.teamPlayerModel({
      teamId: teamObjectId,
      playerId: playerObjectId,
    });

    return teamPlayer.save();
  }

  /**
   * Bulk assign multiple players to a team
   * Validates:
   * - Team exists
   * - All players exist
   * - No duplicate relationships
   */
  async bulkAssignPlayersToTeam(
    bulkDto: BulkAssignTeamPlayerDto,
  ): Promise<{
    success: number;
    failed: number;
    results: Array<{
      playerId: string;
      success: boolean;
      message?: string;
    }>;
  }> {
    const { teamId, playerIds } = bulkDto;
  
    const teamObjectId = this.validateAndConvertId(teamId);
  
    // 1️⃣ Ensure team exists
    await this.teamsService.findOneTeam(teamId);
  
    // 2️⃣ Remove duplicates & convert IDs
    const uniquePlayerIds = [...new Set(playerIds)];
    const playerObjectIds = uniquePlayerIds.map(id =>
      this.validateAndConvertId(id),
    );
  
    // 3️⃣ Validate all players exist by checking each one
    const playerValidationResults = await Promise.allSettled(
      uniquePlayerIds.map(id => this.playersService.findOnePlayer(id))
    );
  
    const existingPlayersSet = new Set<string>();
    playerValidationResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        existingPlayersSet.add(playerObjectIds[index].toString());
      }
    });
  
    // 4️⃣ Fetch existing team-player relations
    const existingRelations = await this.teamPlayerModel.find({
      teamId: teamObjectId,
      playerId: { $in: playerObjectIds },
    }).exec();
  
    const alreadyAssignedSet = new Set(
      existingRelations.map(r => r.playerId.toString()),
    );
  
    const results: Array<{
      playerId: string;
      success: boolean;
      message?: string;
    }> = [];
    const bulkInsert: Array<{
      teamId: Types.ObjectId;
      playerId: Types.ObjectId;
    }> = [];
  
    // 5️⃣ Classify each player
    for (let i = 0; i < uniquePlayerIds.length; i++) {
      const playerId = uniquePlayerIds[i];
      const playerObjectId = playerObjectIds[i];
      const validationResult = playerValidationResults[i];
  
      // Check if player exists
      if (validationResult.status === 'rejected') {
        results.push({
          playerId,
          success: false,
          message: `Player with ID "${playerId}" not found`,
        });
        continue;
      }
  
      // Check if already assigned
      if (alreadyAssignedSet.has(playerObjectId.toString())) {
        results.push({
          playerId,
          success: false,
          message: `Player is already assigned to this team`,
        });
        continue;
      }
  
      // Add to bulk insert
      bulkInsert.push({
        teamId: teamObjectId,
        playerId: playerObjectId,
      });
  
      results.push({
        playerId,
        success: true,
      });
    }
  
    // 6️⃣ Bulk insert new relations
    if (bulkInsert.length > 0) {
      await this.teamPlayerModel.insertMany(bulkInsert, {
        ordered: false,
      });
    }
  
    const success = bulkInsert.length;
    const failed = results.length - success;
  
    return {
      success,
      failed,
      results,
    };
  }
  
  /**
   * Remove a player from a team (soft delete the team-player relationship)
   */
  async removePlayerFromTeam(createTeamPlayerDto: CreateTeamPlayerDto): Promise<void> {
    const { teamId, playerId } = createTeamPlayerDto;

    // Validate and convert IDs
    const teamObjectId = this.validateAndConvertId(teamId);
    const playerObjectId = this.validateAndConvertId(playerId);

    // Find the relationship
    const relationship = await this.teamPlayerModel.findOne({
      teamId: teamObjectId,
      playerId: playerObjectId,
    });

    if (!relationship) {
      throw new NotFoundException(
        `Player "${playerId}" is not associated with team "${teamId}"`
      );
    }

    // Soft delete the relationship
    await this.teamPlayerModel.delete({ _id: relationship._id });
  }

  /**
   * Create a new team-player relationship (alias for assignPlayerToTeam for backward compatibility)
   */
  async create(createTeamPlayerDto: CreateTeamPlayerDto): Promise<TeamPlayerDocument> {
    return this.assignPlayerToTeam(createTeamPlayerDto);
  }

  /**
   * Find all team-player relationships
   * Optionally filter by teamId or playerId
   */
  async findAll(teamId?: string, playerId?: string): Promise<TeamPlayerDocument[]> {
    const query: any = {};
    
    if (teamId) {
      query.teamId = this.validateAndConvertId(teamId);
    }
    
    if (playerId) {
      query.playerId = this.validateAndConvertId(playerId);
    }

    return this.teamPlayerModel
      .find(query)
      .populate('teamId', 'name description')
      .populate('playerId', 'name number age email')
      .exec();
  }

  /**
   * Find a team-player relationship by ID
   */
  async findOne(id: string): Promise<TeamPlayerDocument> {
    const objectId = this.validateAndConvertId(id);
    const teamPlayer = await this.teamPlayerModel
      .findById(objectId)
      .populate('teamId', 'name description')
      .populate('playerId', 'name number age email')
      .exec();

    if (!teamPlayer) {
      throw new NotFoundException(`Team-player relationship with ID "${id}" not found`);
    }

    return teamPlayer;
  }

  /**
   * Update a team-player relationship
   */
  async update(id: string, updateTeamPlayerDto: UpdateTeamPlayerDto): Promise<TeamPlayerDocument> {
    const objectId = this.validateAndConvertId(id);
    await this.findOne(id); // Validate relationship exists

    // Validate team and player if they're being updated
    if (updateTeamPlayerDto.teamId) {
      try {
        await this.teamsService.findOneTeam(updateTeamPlayerDto.teamId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`Team with ID "${updateTeamPlayerDto.teamId}" not found`);
        }
        throw error;
      }
    }

    if (updateTeamPlayerDto.playerId) {
      try {
        await this.playersService.findOnePlayer(updateTeamPlayerDto.playerId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`Player with ID "${updateTeamPlayerDto.playerId}" not found`);
        }
        throw error;
      }
    }

    const updateData: any = { ...updateTeamPlayerDto };
    
    // Convert string IDs to ObjectIds if provided
    if (updateTeamPlayerDto.teamId) {
      updateData.teamId = this.validateAndConvertId(updateTeamPlayerDto.teamId);
    }
    
    if (updateTeamPlayerDto.playerId) {
      updateData.playerId = this.validateAndConvertId(updateTeamPlayerDto.playerId);
    }

    const updatedTeamPlayer = await this.teamPlayerModel
      .findByIdAndUpdate(objectId, updateData, { new: true, runValidators: true })
      .populate('teamId', 'name description')
      .populate('playerId', 'name number age email')
      .exec();

    if (!updatedTeamPlayer) {
      throw new NotFoundException(`Team-player relationship with ID "${id}" not found`);
    }

    return updatedTeamPlayer;
  }

  /**
   * Soft delete a team-player relationship
   * Validates relationship exists and is not already deleted before soft deletion
   */
  async remove(id: string): Promise<void> {
    const objectId = this.validateAndConvertId(id);
    const teamPlayer = await this.findOne(id);
    
    // Guard: Prevent double delete
    if (teamPlayer.deletedAt) {
      throw new BadRequestException(`Team-player relationship with ID "${id}" is already deleted`);
    }
    
    // Use mongoose-delete's delete method for soft delete
    await this.teamPlayerModel.delete({ _id: objectId });
  }

  /**
   * Restore a soft-deleted team-player relationship
   */
  async restore(id: string): Promise<TeamPlayerDocument> {
    const objectId = this.validateAndConvertId(id);
    const teamPlayer = await this.teamPlayerModel.findOneWithDeleted({ _id: objectId }).exec();
    
    if (!teamPlayer) {
      throw new NotFoundException(`Deleted team-player relationship with ID "${id}" not found`);
    }
    
    if (!teamPlayer.deleted) {
      throw new BadRequestException(`Team-player relationship with ID "${id}" is not deleted`);
    }
    
    await this.teamPlayerModel.restore({ _id: objectId });
    
    return this.findOne(id);
  }

  /**
   * Hard delete a team-player relationship (admin only - for cleanup jobs)
   * WARNING: This permanently deletes the document
   */
  async hardDelete(id: string): Promise<void> {
    const objectId = this.validateAndConvertId(id);
    await this.findOne(id); // Validate exists
    await this.teamPlayerModel.deleteOne({ _id: objectId }, { hardDelete: true });
  }

  /**
   * Get all players for a specific team
   */
  async getTeamPlayers(teamId: string, activeOnly: boolean = false): Promise<TeamPlayerDocument[]> {
    const teamObjectId = this.validateAndConvertId(teamId);
    const query: any = { teamId: teamObjectId };

    // Note: activeOnly is kept for future use if isActive field is added to the schema
    // For now, we just return all non-deleted relationships

    return this.teamPlayerModel
      .find(query)
      .populate('playerId', 'name number age email')
      .exec();
  }

  /**
   * Get all teams for a specific player
   */
  async getPlayerTeams(playerId: string, activeOnly: boolean = false): Promise<TeamPlayerDocument[]> {
    const playerObjectId = this.validateAndConvertId(playerId);
    const query: any = { playerId: playerObjectId };

    // Note: activeOnly is kept for future use if isActive field is added to the schema
    // For now, we just return all non-deleted relationships

    return this.teamPlayerModel
      .find(query)
      .populate('teamId', 'name description')
      .exec();
  }

  /**
   * Validate that players belong to a team
   * Used by matches service for lineup validation
   * Note: Soft-deleted relationships are automatically excluded by mongoose-delete
   */
  async validatePlayersBelongToTeam(
    teamId: string, 
    playerIds: string[]
  ): Promise<boolean> {
    const teamObjectId = this.validateAndConvertId(teamId);
    const playerObjectIds = playerIds
      .map(id => {
        try {
          return this.validateAndConvertId(id);
        } catch {
          return null;
        }
      })
      .filter((id): id is Types.ObjectId => id !== null);
    
    if (playerObjectIds.length !== playerIds.length) {
      return false;
    }
    
    const teamPlayers = await this.teamPlayerModel.find({
      teamId: teamObjectId,
      playerId: { $in: playerObjectIds },
    }).exec();

    return teamPlayers.length === playerIds.length;
  }
}
