import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto';
import { isLeft } from '../../lib/either';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCompanyDto) {
    const result = await this.companyService.create(dto);
    if (isLeft(result)) {
      return { error: result.value.name, message: result.value.message };
    }
    return result.value;
  }

  @Get()
  async findAll() {
    const result = await this.companyService.findAll();
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.companyService.findById(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateCompanyDto>,
  ) {
    const result = await this.companyService.update(id, dto);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.companyService.delete(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }
}
