import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match, MatchDocument } from './entities/match.entity';
import type { MatchModel } from './entities/match.entity';
import { validateAndConvertId } from '@core/utils/validateId';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private matchModel: MatchModel,
    private teamsService: TeamsService,
  ) {}

  async createMatch(createMatchDto: CreateMatchDto): Promise<MatchDocument> {
    try {
      const { homeTeam, awayTeam, place } = createMatchDto;

      // Validate and convert IDs
      const homeTeamObjectId = validateAndConvertId(homeTeam);
      const awayTeamObjectId = validateAndConvertId(awayTeam);

      if (homeTeam === awayTeam) {
        throw new BadRequestException('Home team and away team cannot be the same');
      }

      await this.teamsService.findOneTeam(homeTeam);
      await this.teamsService.findOneTeam(awayTeam);

      const match = new this.matchModel({
        homeTeam: homeTeamObjectId,
        awayTeam: awayTeamObjectId,
        place,
      });

      return await match.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllMatches(): Promise<MatchDocument[]> {
    try {
      return await this.matchModel
        .find()
        .populate('homeTeam', 'name description')
        .populate('awayTeam', 'name description')
        .exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneMatch(id: string): Promise<MatchDocument> {
    try {
      const objectId = validateAndConvertId(id);
      const match = await this.matchModel
        .findById(objectId)
        .populate('homeTeam', 'name description')
        .populate('awayTeam', 'name description')
        .exec();

      if (!match) {
        throw new NotFoundException(`Match Not found`);
      }
      return match;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateMatch(
    id: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<MatchDocument> {

    try {
      const matchId = validateAndConvertId(id);
  
      const match = await this.matchModel.findById(matchId);
      if (!match) {
        throw new NotFoundException('Match not found');
      }
  
      const finalHomeTeamId = updateMatchDto.homeTeam
        ? validateAndConvertId(updateMatchDto.homeTeam)
        : match.homeTeam;
    
      const finalAwayTeamId = updateMatchDto.awayTeam
        ? validateAndConvertId(updateMatchDto.awayTeam)
        : match.awayTeam;
    
      if (finalHomeTeamId.equals(finalAwayTeamId)) {
        throw new BadRequestException(
          'Home team and away team cannot be the same',
        );
      }
      await Promise.all([
        this.teamsService.findOneTeam(finalHomeTeamId.toString()),
        this.teamsService.findOneTeam(finalAwayTeamId.toString()),
      ]);
      const updateData = {
        ...updateMatchDto,
        homeTeam: finalHomeTeamId,
        awayTeam: finalAwayTeamId,
      };
    
      const updatedMatch = await this.matchModel
        .findByIdAndUpdate(matchId, updateData, {
          new: true,
          runValidators: true,
        })
        .populate('homeTeam', 'name description')
        .populate('awayTeam', 'name description');
    
      return updatedMatch;
      
    } catch (error) {
      throw new BadRequestException(error.message);
      
    }
   
  }
  

  async deleteMatch(id: string): Promise<MatchDocument> {
    try {
      const objectId = validateAndConvertId(id);
      const match = await this.findOneMatch(id);
      await this.matchModel.delete({ _id: objectId });
      return match;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
