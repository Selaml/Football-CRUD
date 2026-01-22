import { IsString, IsNotEmpty, IsNumber, IsEnum, Min, Max, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({
    description: 'Player full name',
    example: 'Lionel Messi',
  })
  @IsString()
  @IsNotEmpty()
  name: string;


  @ApiProperty({
    description: 'Player jersey number',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(99)
  number: number;

  @ApiProperty({
    description: 'Player age',
    example: 25,
    minimum: 16,
    maximum: 50,
  })
  @IsNumber()
  @Min(16)
  @Max(50)
  age: number;

  @ApiProperty({
    description: 'email',
    example: 'example@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
