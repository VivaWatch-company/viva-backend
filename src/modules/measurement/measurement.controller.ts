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
import { MeasurementService } from './measurement.service';
import { CreateMeasurementDto } from './dto';
import { isLeft, isRight } from '../../lib/either';

@Controller('measurements')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateMeasurementDto) {
    const result = await this.measurementService.create(dto);
    if (isLeft(result)) {
      return { error: result.value.name, message: result.value.message };
    }
    return result.value;
  }

  @Get()
  async findAll(@Query('deviceId') deviceId?: string) {
    const result = await this.measurementService.findAll(deviceId);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.measurementService.findById(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.measurementService.delete(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }
}
