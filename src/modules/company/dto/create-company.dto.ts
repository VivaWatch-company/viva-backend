import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Company name', example: 'Acme Corporation' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Company slug (lowercase alphanumeric with hyphens)',
    example: 'acme-corp',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must be lowercase alphanumeric with hyphens',
  })
  slug: string;

  @ApiProperty({
    description: 'Company document (CNPJ/CPF)',
    example: '12345678901',
  })
  @IsString()
  @IsNotEmpty()
  document: string;
}
