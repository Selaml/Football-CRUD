import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('players')
@ApiTags('Players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.createPlayer(createPlayerDto);
  }

  @Get()
  findAllPlayers() {
    return this.playersService.findAllPlayers();
  }

  @Get(':id')
  findOnePlayer(@Param('id') id: string) {
    return this.playersService.findOnePlayer(id);
  }

  @Patch(':id')
  updatePlayer(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.updatePlayer(id, updatePlayerDto);
  }

  @Delete(':id')
  deletePlayer(@Param('id') id: string) {
    return this.playersService.deletePlayer(id);
  }
}
