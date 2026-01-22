import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiTags } from '@nestjs/swagger';
@Controller('teams')
@ApiTags('Teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  createTeam(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.createTeam(createTeamDto);
  }

  @Get()
  findAllPlayers() {
    return this.teamsService.findAllTeams();
  }

  @Get(':id')
  findOneTeam(@Param('id') id: string) {
    return this.teamsService.findOneTeam(id);
  }

  @Patch(':id')
  updateTeam(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.updateTeam(id, updateTeamDto);
  }

  @Delete(':id')
  deleteTeam(@Param('id') id: string) {
    return this.teamsService.deleteTeam(id);
  }
}
