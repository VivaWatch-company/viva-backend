import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  COMPANY_OWNER = 'COMPANY_OWNER',
  CAREGIVER = 'CAREGIVER',
}

export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'User password', example: 'securePassword123' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    required: false,
    example: 'CAREGIVER',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'Company UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @ApiProperty({
    description: 'Is owner flag',
    required: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isOwner?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'User name',
    required: false,
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'User role', enum: UserRole, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'Is active flag',
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateUserPasswordDto {
  @ApiProperty({ description: 'Current password', example: 'oldPassword123' })
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({ description: 'New password', example: 'newPassword456' })
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}
