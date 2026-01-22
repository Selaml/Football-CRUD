import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamPlayerDto } from './create-team-player.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTeamPlayerDto extends PartialType(CreateTeamPlayerDto) {

}
