import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateElderlyDto {
  @ApiProperty({ description: 'Elderly person name', example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Elderly person age', example: '75' })
  @IsString()
  @IsNotEmpty()
  age: string;

  @ApiProperty({
    description: 'Elderly person document (CPF)',
    example: '12345678901',
    required: false,
  })
  @IsString()
  document: string;

  @ApiProperty({
    description: 'Elderly person birth date',
    example: '1951-01-01',
    required: false,
  })
  birthDate?: Date;
}

export class UpdateElderlyDto {
  @ApiProperty({
    description: 'Elderly person name',
    required: false,
    example: 'John Smith',
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Elderly person age',
    required: false,
    example: '76',
  })
  @IsString()
  age?: string;

  @ApiProperty({
    description: 'Elderly person document (CPF)',
    required: false,
  })
  @IsString()
  document?: string;

  @ApiProperty({ description: 'Elderly person birth date', required: false })
  @IsOptional()
  birthDate?: Date;
}
