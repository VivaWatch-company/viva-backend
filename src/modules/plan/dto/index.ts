import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export enum PlanInterval {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsEnum(PlanInterval)
  period: PlanInterval;

  @IsBoolean()
  isMain?: boolean;

  @IsBoolean()
  isActive?: boolean;

  @IsBoolean()
  isEnterprise?: boolean;
}

export class CreatePlanBenefitDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  planId: string;
}
