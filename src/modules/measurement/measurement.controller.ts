import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { MeasurementService } from './measurement.service';
import { CreateMeasurementDto } from './dto';
import { isLeft } from '../../lib/either';

@ApiTags('Measurements')
@Controller('measurements')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new measurement' })
  @ApiResponse({ status: 201, description: 'Measurement created successfully' })
  @ApiBadRequestResponse({ description: 'Bad request - validation error' })
  async create(@Body() dto: CreateMeasurementDto) {
    const result = await this.measurementService.create(dto);
    if (isLeft(result)) {
      return { error: result.value.name, message: result.value.message };
    }
    return result.value;
  }

  @Get()
  @ApiOperation({ summary: 'Get all measurements or filter by device' })
  @ApiQuery({
    name: 'deviceId',
    description: 'Device UUID (optional)',
    required: false,
    type: String,
  })
  @ApiResponse({ status: 200, description: 'List of measurements' })
  async findAll(@Query('deviceId') deviceId?: string) {
    const result = await this.measurementService.findAll(deviceId);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a measurement by ID' })
  @ApiParam({ name: 'id', description: 'Measurement UUID', type: String })
  @ApiResponse({ status: 200, description: 'Measurement found' })
  @ApiBadRequestResponse({ description: 'Measurement not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.measurementService.findById(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a measurement' })
  @ApiParam({ name: 'id', description: 'Measurement UUID', type: String })
  @ApiResponse({ status: 204, description: 'Measurement deleted successfully' })
  @ApiBadRequestResponse({ description: 'Measurement not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.measurementService.delete(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }
}
