import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ description: 'Device name', example: 'Health Monitor Alpha' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Device serial number', example: 'DEV-001-2024' })
  @IsString()
  @IsNotEmpty()
  serialNumber!: string;

  @ApiProperty({
    description: 'Company UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  companyId!: string;
}

export class UpdateDeviceDto {
  @ApiProperty({
    description: 'Device name',
    required: false,
    example: 'Updated Device Name',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Device status',
    enum: DeviceStatus,
    required: false,
    example: 'ACTIVE',
  })
  @IsEnum(DeviceStatus)
  @IsOptional()
  status?: DeviceStatus;
}
