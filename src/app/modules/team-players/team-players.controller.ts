import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TeamPlayersService } from './team-players.service';
import { CreateTeamPlayerDto } from './dto/create-team-player.dto';
import { BulkAssignTeamPlayerDto } from './dto/bulk-assign-team-player.dto';
import { UpdateTeamPlayerDto } from './dto/update-team-player.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('team-players')
@ApiTags('Team Players')
export class TeamPlayersController {
  constructor(private readonly teamPlayersService: TeamPlayersService) {}

  @Post('assign')
  @HttpCode(HttpStatus.CREATED)
  bulkAssignPlayersToTeam(@Body() bulkAssignDto: BulkAssignTeamPlayerDto) {
    return this.teamPlayersService.bulkAssignPlayersToTeam(bulkAssignDto);
  }

  @Post('remove')
  @HttpCode(HttpStatus.OK)
  removePlayerFromTeam(@Body() createTeamPlayerDto: CreateTeamPlayerDto) {
    return this.teamPlayersService.removePlayerFromTeam(createTeamPlayerDto);
  }

  @Get()
  findAllTeamPlayers(
    @Query('teamId') teamId?: string,
    @Query('playerId') playerId?: string,
  ) {
    return this.teamPlayersService.findAll(teamId, playerId);
  }

  @Get('team/:teamId')
  getTeamPlayersByTeamId(
    @Param('teamId') teamId: string,
    @Query('activeOnly') activeOnly?: string,
  ) {
    return this.teamPlayersService.getTeamPlayers(
      teamId,
      activeOnly === 'true',
    );
  }

  @Get('player/:playerId')
  getPlayerTeams(
    @Param('playerId') playerId: string,
    @Query('activeOnly') activeOnly?: string,
  ) {
    return this.teamPlayersService.getPlayerTeams(
      playerId,
      activeOnly === 'true',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamPlayersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeamPlayerDto: UpdateTeamPlayerDto,
  ) {
    return this.teamPlayersService.update(id, updateTeamPlayerDto);
  }

  @Delete(':id')

  remove(@Param('id') id: string) {
    return this.teamPlayersService.remove(id);
  }
}
