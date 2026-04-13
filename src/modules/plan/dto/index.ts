import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PlanInterval {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export class CreatePlanDto {
  @ApiProperty({ description: 'Plan name', example: 'Premium Plan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Plan price', example: 99.99 })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Plan billing period',
    enum: PlanInterval,
    example: 'MONTHLY',
  })
  @IsEnum(PlanInterval)
  period: PlanInterval;

  @ApiProperty({
    description: 'Is main plan flag',
    required: false,
    example: false,
  })
  @IsBoolean()
  isMain?: boolean;

  @ApiProperty({
    description: 'Is active flag',
    required: false,
    example: true,
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Is enterprise plan flag',
    required: false,
    example: false,
  })
  @IsBoolean()
  isEnterprise?: boolean;
}

export class CreatePlanBenefitDto {
  @ApiProperty({ description: 'Benefit title', example: 'Unlimited Devices' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Benefit description',
    example: 'Connect unlimited devices to the platform',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Plan UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  planId: string;
}
