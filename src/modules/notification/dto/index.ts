import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum NotificationType {
  URGENCY = 'URGENCY',
  ATTENTION = 'ATTENTION',
  FALL = 'FALL',
  LOW_SPO2 = 'LOW_SPO2',
  HIGH_BPM = 'HIGH_BPM',
  GENERIC = 'GENERIC',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  READ = 'READ',
}

export enum NotificationChannel {
  DASHBOARD = 'DASHBOARD',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
}

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Device UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    description: 'Caregiver UUID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  caregiverId: string;

  @ApiProperty({
    description: 'Notification type',
    enum: NotificationType,
    example: 'GENERIC',
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Notification message',
    example: 'Patient heart rate is elevated',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Notification channel',
    enum: NotificationChannel,
    required: false,
    example: 'DASHBOARD',
  })
  @IsOptional()
  channel?: NotificationChannel;
}
