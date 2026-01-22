import { IsMongoId, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkAssignTeamPlayerDto {
  @ApiProperty({
    description: 'Team ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsNotEmpty()
  teamId: string;

  @ApiProperty({
    description: 'Array of Player IDs (MongoDB ObjectIds)',
    example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one player ID is required' })
  @IsMongoId({ each: true })
  @IsNotEmpty()
  playerIds: string[];
}
