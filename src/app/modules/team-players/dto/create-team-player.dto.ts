import { IsMongoId, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamPlayerDto {
  @ApiProperty({
    description: 'Team ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsNotEmpty()
  teamId: string;

  @ApiProperty({
    description: 'Player ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  @IsNotEmpty()
  playerId: string;

}
