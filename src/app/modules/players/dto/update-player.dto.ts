import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
  @ApiPropertyOptional({
    description: 'Player full name',
    example: 'Lionel Messi',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Jersey number',
    example: 7,
    minimum: 1,
    maximum: 99,
  })
  number?: number;

  @ApiPropertyOptional({
    description: 'Player age',
    example: 25,
    minimum: 16,
    maximum: 50,
  })
  age?: number;

  @ApiPropertyOptional({
    description: 'email',
    example: 'example@example.com',
  })
  email?: string;
}
