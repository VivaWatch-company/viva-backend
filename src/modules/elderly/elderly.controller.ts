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
import { ElderlyService } from './elderly.service';
import { CreateElderlyDto, UpdateElderlyDto } from './dto';
import { isLeft } from '../../lib/either';

@ApiTags('Elderly')
@Controller('elderly')
export class ElderlyController {
  constructor(private readonly elderlyService: ElderlyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new elderly person' })
  @ApiResponse({ status: 201, description: 'Elderly created successfully' })
  @ApiBadRequestResponse({ description: 'Bad request - validation error' })
  async create(@Body() dto: CreateElderlyDto) {
    const result = await this.elderlyService.create(dto);
    if (isLeft(result)) {
      return { error: result.value.name, message: result.value.message };
    }
    return result.value;
  }

  @Get()
  @ApiOperation({ summary: 'Get all elderly people' })
  @ApiResponse({ status: 200, description: 'List of elderly people' })
  async findAll() {
    const result = await this.elderlyService.findAll();
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an elderly person by ID' })
  @ApiParam({ name: 'id', description: 'Elderly UUID', type: String })
  @ApiResponse({ status: 200, description: 'Elderly found' })
  @ApiBadRequestResponse({ description: 'Elderly not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.elderlyService.findById(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an elderly person' })
  @ApiParam({ name: 'id', description: 'Elderly UUID', type: String })
  @ApiResponse({ status: 200, description: 'Elderly updated successfully' })
  @ApiBadRequestResponse({ description: 'Elderly not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateElderlyDto,
  ) {
    const result = await this.elderlyService.update(id, dto);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an elderly person' })
  @ApiParam({ name: 'id', description: 'Elderly UUID', type: String })
  @ApiResponse({ status: 204, description: 'Elderly deleted successfully' })
  @ApiBadRequestResponse({ description: 'Elderly not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.elderlyService.delete(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }
}
