import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { TeamPlayersService } from './team-players.service';
import { CreateTeamPlayerDto } from './dto/create-team-player.dto';
import { BulkAssignTeamPlayerDto } from './dto/bulk-assign-team-player.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('team-players')
@ApiTags('Team Players')
export class TeamPlayersController {
  constructor(private readonly teamPlayersService: TeamPlayersService) {}

  @Post('assign')
  bulkAssignPlayersToTeam(@Body() bulkAssignDto: BulkAssignTeamPlayerDto) {
    return this.teamPlayersService.bulkAssignPlayersToTeam(bulkAssignDto);
  }
  @Get('all')
  findAllteamsAndPlayers() {
    return this.teamPlayersService.findAllteamsAndPlayers();
  }

  @Get('team/:teamId')
  getTeamPlayersByTeamId(
    @Param('teamId') teamId: string,
  ) {
    return this.teamPlayersService.getTeamPlayers(
      teamId
     
    );
  }

  @Get('player/:playerId')
  getPlayerTeams(
    @Param('playerId') playerId: string,
  ) {
    return this.teamPlayersService.getPlayerTeams(
      playerId
    );
  }
  @Delete('remove')
  removePlayerFromTeam(@Body() createTeamPlayerDto: CreateTeamPlayerDto) {
    return this.teamPlayersService.removePlayerFromTeam(createTeamPlayerDto);
  }

}
