import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({
    description: 'Home Team ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsNotEmpty()
  homeTeam: string;

  @ApiProperty({
    description: 'Away Team ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  @IsNotEmpty()
  awayTeam: string;

  @ApiProperty({
    description: 'Match venue/place',
    example: 'Addis Ababa Stadium',
  })
  @IsString()
  @IsNotEmpty()
  place: string;
}
