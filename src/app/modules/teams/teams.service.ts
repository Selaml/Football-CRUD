import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

;
import { validateAndConvertId } from '@core/utils/validateId';
import { CreateTeamDto } from './dto/create-team.dto';
import type { TeamDocument, TeamModel } from './entities/team.entity';
import { PlayerDocument } from '../players/entities/player.entity';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel('Team') private teamModel: TeamModel,
  ) {}

  async createTeam(createTeamDto: CreateTeamDto): Promise<TeamDocument> {
    try {
      await this.checkIfTeamNameExists(createTeamDto.name);
      const team = new this.teamModel(createTeamDto);
      return await team.save();
      
    } catch (error) {
      throw new BadRequestException(error.message);     
    }
   
  }


  async findAllTeams(): Promise<TeamDocument[]> {
    try {
      return await this.teamModel.find().exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  async findOneTeam(id: string): Promise<TeamDocument> {
    try {
      const objectId = validateAndConvertId(id);
      const team = await this.teamModel.findById(objectId).exec();
      if (!team) {
        throw new NotFoundException(`Team Not found`);
      }
      return team;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  async updateTeam(
    id: string,
    updateTeamDto: UpdateTeamDto,
  ): Promise<TeamDocument> {
    try {
      const objectId = validateAndConvertId(id);
  
      
      await this.findOneTeam(id);
  
      if (updateTeamDto.name) {
        const nameExists = await this.teamModel.exists({
          name: updateTeamDto.name,
          _id: { $ne: objectId },
        });
  
        if (nameExists) {
          throw new BadRequestException(
            `Team with name '${updateTeamDto.name}' already exists`,
          );
        }
      }
      
  
      const updatedTeam = await this.teamModel
        .findByIdAndUpdate(objectId, updateTeamDto, {
          new: true,
          runValidators: true,
        })
        .exec();
  
      return updatedTeam;
    } catch (error) {
     
      throw new BadRequestException(error.message);
    }
  }
  


  async deleteTeam(id: string): Promise<TeamDocument> {
    try {
      const objectId = validateAndConvertId(id);
   const team =   await this.findOneTeam(id);
      await this.teamModel.delete({ _id: objectId });
      return team;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async checkIfTeamNameExists(name: string): Promise<void> {
    try {

      const teams = await this.teamModel.find({ name }).limit(1).exec();
      
      if (teams && teams.length > 0) {
        throw new BadRequestException(`Team ${name} already exists`);
      }
    } catch (error) {
    
      throw new BadRequestException(error.message);
    }
  }
}
