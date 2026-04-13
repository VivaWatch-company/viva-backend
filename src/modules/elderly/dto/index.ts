import { IsString, IsNotEmpty } from 'class-validator';

export class CreateElderlyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  age: string;

  @IsString()
  document: string;

  birthDate?: Date;
}

export class UpdateElderlyDto {
  @IsString()
  name?: string;

  @IsString()
  age?: string;

  document?: string;

  birthDate?: Date;
}
