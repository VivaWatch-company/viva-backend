import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  TRIALING = 'TRIALING',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID',
}

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Plan UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  planId: string;
}

export class UpdateSubscriptionDto {
  @ApiProperty({
    description: 'Subscription status',
    enum: SubscriptionStatus,
    required: false,
    example: 'ACTIVE',
  })
  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @ApiProperty({
    description: 'Subscription end date',
    required: false,
    example: '2025-12-31',
  })
  @IsDateString()
  @IsOptional()
  endAt?: string;

  @ApiProperty({
    description: 'Subscription renewal date',
    required: false,
    example: '2025-01-31',
  })
  @IsDateString()
  @IsOptional()
  renewAt?: string;
}
