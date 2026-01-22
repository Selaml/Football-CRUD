import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('matches')
@ApiTags('Matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  createMatch(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.createMatch(createMatchDto);
  }

  @Get()
  findAllMatches() {
    return this.matchesService.findAllMatches();
  }

  @Get(':id')
  findOneMatch(@Param('id') id: string) {
    return this.matchesService.findOneMatch(id);
  }

  @Patch(':id')
  updateMatch(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.updateMatch(id, updateMatchDto);
  }

  @Delete(':id')
  deleteMatch(@Param('id') id: string) {
    return this.matchesService.deleteMatch(id);
  }
}
