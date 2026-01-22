import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @ApiPropertyOptional({
    description: 'Team name',
    example: 'Manchester United',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Team name',
    example: 'Manchester United',
  })
  description?: string;
}
