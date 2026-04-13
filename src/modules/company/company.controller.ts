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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto';
import { isLeft } from '../../lib/either';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  @ApiBadRequestResponse({
    description: 'Bad request - validation error or duplicate slug',
  })
  async create(@Body() dto: CreateCompanyDto) {
    const result = await this.companyService.create(dto);
    if (isLeft(result)) {
      return { error: result.value.name, message: result.value.message };
    }
    return result.value;
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ status: 200, description: 'List of companies' })
  async findAll() {
    const result = await this.companyService.findAll();
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiParam({ name: 'id', description: 'Company UUID', type: String })
  @ApiResponse({ status: 200, description: 'Company found' })
  @ApiBadRequestResponse({ description: 'Company not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.companyService.findById(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a company' })
  @ApiParam({ name: 'id', description: 'Company UUID', type: String })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  @ApiBadRequestResponse({ description: 'Company not found' })
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
  @ApiOperation({ summary: 'Delete a company' })
  @ApiParam({ name: 'id', description: 'Company UUID', type: String })
  @ApiResponse({ status: 204, description: 'Company deleted successfully' })
  @ApiBadRequestResponse({ description: 'Company not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.companyService.delete(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }
}
