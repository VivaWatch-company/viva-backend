import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum DeviceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  DECOMMISSIONED = 'DECOMMISSIONED',
  ERROR = 'ERROR',
  LOW_BATTERY = 'LOW_BATTERY',
  DISCONNECTED = 'DISCONNECTED',
}

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  serialNumber!: string;

  @IsString()
  @IsNotEmpty()
  companyId!: string;
}

export class UpdateDeviceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(DeviceStatus)
  @IsOptional()
  status?: DeviceStatus;
}
