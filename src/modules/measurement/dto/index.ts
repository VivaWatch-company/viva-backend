import { IsString, IsNotEmpty, IsInt, IsBoolean } from 'class-validator';

export class CreateMeasurementDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsInt()
  bpm: number;

  @IsInt()
  spo2: number;

  @IsBoolean()
  fallDetected: boolean;
}
