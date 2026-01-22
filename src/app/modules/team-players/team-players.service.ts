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
import { validateAndConvertId } from '@core/utils/validateId';

@Injectable()
export class TeamPlayersService {
  constructor(
    @InjectModel(TeamPlayer.name) private teamPlayerModel: TeamPlayerModel,
    private teamsService: TeamsService,
    private playersService: PlayersService,
  ) {}

  async assignPlayerToTeam(createTeamPlayerDto: CreateTeamPlayerDto): Promise<TeamPlayerDocument> {
    try {
    const { teamId, playerId } = createTeamPlayerDto;

   
    const teamObjectId = validateAndConvertId(teamId);
    const playerObjectId = validateAndConvertId(playerId);

    
      await this.teamsService.findOneTeam(teamId);
      
      await this.playersService.findOnePlayer(playerId);
    
    const existingRelationship = await this.teamPlayerModel.findOne({
      teamId: teamObjectId,
      playerId: playerObjectId,
    });

    if (existingRelationship) {
      throw new ConflictException(
        `Player is already assigned to this team`
      );
    }

    const teamPlayer = new this.teamPlayerModel({
      teamId: teamObjectId,
      playerId: playerObjectId,
    });

    return teamPlayer.save();
  
  } catch (error) {
    throw new BadRequestException(error.message);
  }
  }
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
  
    const teamObjectId = validateAndConvertId(teamId);

    await this.teamsService.findOneTeam(teamId);
  
    const uniquePlayerIds = [...new Set(playerIds)];
    const playerObjectIds = uniquePlayerIds.map(id =>
      validateAndConvertId(id),
    );
  
    const playerIdsStrings = playerObjectIds.map(id => id.toString());
    const players = await this.playersService.findAllPlayersByIds(playerIdsStrings)
  
    const existingPlayersSet = new Set(
      players.map(p => p._id.toString()),
    );
  
    const existingRelations = await this.teamPlayerModel.find(
      {
        teamId: teamObjectId,
        playerId: { $in: playerObjectIds },
      },
      { playerId: 1 },
    );
  
    const alreadyAssignedSet = new Set(
      existingRelations.map(r => r.playerId.toString()),
    );
  
    const results: { playerId: string; success: boolean; message?: string }[] = [];
    const bulkInsert: { teamId: Types.ObjectId; playerId: Types.ObjectId }[] = [];
    
    for (const playerId of uniquePlayerIds) {
      const playerObjectId = playerId.toString();
  
      if (!existingPlayersSet.has(playerObjectId)) {
        results.push({
          playerId,
          success: false,
          message: `Player not found`,
        });
        continue;
      }
  
      if (alreadyAssignedSet.has(playerObjectId)) {
        results.push({
          playerId,
          success: false,
          message: `Player is already assigned to this team`,
        });
        continue;
      }
  
      bulkInsert.push({
        teamId: teamObjectId,
        playerId: new Types.ObjectId(playerObjectId),
      });
  
      results.push({
        playerId,
        success: true,
      });
    }
  
    if (bulkInsert.length) {
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
  

  findAllteamsAndPlayers(): Promise<TeamPlayerDocument[]> {
    try {
      return this.teamPlayerModel.find().populate('teamId', 'name description').populate('playerId', 'name number age email').exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
   
  }

  async removePlayerFromTeam(
    createTeamPlayerDto: CreateTeamPlayerDto,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const { teamId, playerId } = createTeamPlayerDto;
  
    const teamObjectId = validateAndConvertId(teamId);
    const playerObjectId = validateAndConvertId(playerId);
  
    const relationship = await this.teamPlayerModel.findOne({
      teamId: teamObjectId,
      playerId: playerObjectId,
    });
  
    if (!relationship) {
      throw new NotFoundException(
        `Player is not associated with the team`,
      );
    }
  
    await this.teamPlayerModel.deleteOne({ _id: relationship._id });
  
    return {
      success: true,
      message: `Player was successfully removed from the team`,
    };
  }
  

  async findOne(id: string): Promise<TeamPlayerDocument> {
    const objectId = validateAndConvertId(id);
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


  async getTeamPlayers(teamId: string): Promise<TeamPlayerDocument[]> {
    const teamObjectId = validateAndConvertId(teamId);
    const query: any = { teamId: teamObjectId };
  return this.teamPlayerModel
      .find(query)
      .populate('playerId', 'name number age email')
      .exec();
  }

 
  async getPlayerTeams(playerId: string): Promise<TeamPlayerDocument[]> {
    const playerObjectId = validateAndConvertId(playerId);
    const query: any = { playerId: playerObjectId };
 
    return this.teamPlayerModel
      .find(query)
      .populate('teamId', 'name description')
      .exec();
  }

}
