import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  caregiverId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  message: string;

  channel?: NotificationChannel;
}
