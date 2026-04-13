import { IsString, IsNotEmpty, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMeasurementDto {
  @ApiProperty({
    description: 'Device UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({ description: 'Heart rate in beats per minute', example: 72 })
  @IsInt()
  bpm: number;

  @ApiProperty({
    description: 'Blood oxygen saturation percentage',
    example: 98,
  })
  @IsInt()
  spo2: number;

  @ApiProperty({ description: 'Whether a fall was detected', example: false })
  @IsBoolean()
  fallDetected: boolean;
}
