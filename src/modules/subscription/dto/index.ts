import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  planId: string;
}

export class UpdateSubscriptionDto {
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @IsDateString()
  endAt?: string;

  @IsDateString()
  renewAt?: string;
}
