import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayerDocument } from './entities/player.entity';
import type { PlayerModel } from './entities/player.entity';
import { validateAndConvertId } from '@core/utils/validateId';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private playerModel: PlayerModel,
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<PlayerDocument> {
    try {
      await this.checkIfEmailExists(createPlayerDto.email);
      const player = new this.playerModel(createPlayerDto);
      return await player.save();
      
    } catch (error) {
      throw new BadRequestException(error.message);     
    }
   
  }


  async findAllPlayers(): Promise<PlayerDocument[]> {
    try {
      return await this.playerModel.find().exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  async findOnePlayer(id: string): Promise<PlayerDocument> {
    try {
      const objectId = validateAndConvertId(id);
      const player = await this.playerModel.findById(objectId).exec();
      if (!player) {
        throw new NotFoundException(`Player with Not found`);
      }
      return player;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllPlayersByIds(ids: string[]): Promise<PlayerDocument[]> {
    try {
      const objectIds = ids.map(id => validateAndConvertId(id));
      const players = await this.playerModel.find({ _id: { $in: objectIds } }).exec();
      return players;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  async updatePlayer(id: string, updatePlayerDto: UpdatePlayerDto): Promise<PlayerDocument> {
    try {
      const objectId = validateAndConvertId(id);
      await this.findOnePlayer(id);
  
      const updatedPlayer = await this.playerModel
        .findByIdAndUpdate(objectId, updatePlayerDto, { new: true, runValidators: true })
        .exec();
      return updatedPlayer;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  async deletePlayer(id: string): Promise<PlayerDocument> {
    try {
      const objectId = validateAndConvertId(id);
   const player =   await this.findOnePlayer(id);
      await this.playerModel.delete({ _id: objectId });
      return player;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async checkIfEmailExists(email: string): Promise<void> {
    try {

      const players = await this.playerModel.find({ email }).limit(1).exec();
      
      if (players && players.length > 0) {
        throw new BadRequestException(`Email ${email} already exists`);
      }
    } catch (error) {
    
      throw new BadRequestException(error.message);
    }
  }
}
