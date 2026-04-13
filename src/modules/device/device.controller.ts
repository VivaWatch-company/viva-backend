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
import { DeviceService } from './device.service';
import { CreateDeviceDto, UpdateDeviceDto } from './dto';
import { isLeft } from '../../lib/either';

@ApiTags('Devices')
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new device' })
  @ApiResponse({ status: 201, description: 'Device created successfully' })
  @ApiBadRequestResponse({
    description: 'Bad request - validation error or duplicate serial number',
  })
  async create(@Body() dto: CreateDeviceDto) {
    const result = await this.deviceService.create(dto);
    if (isLeft(result)) {
      return { error: result.value.name, message: result.value.message };
    }
    return result.value;
  }

  @Get()
  @ApiOperation({ summary: 'Get all devices' })
  @ApiResponse({ status: 200, description: 'List of devices' })
  async findAll() {
    const result = await this.deviceService.findAll();
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a device by ID' })
  @ApiParam({ name: 'id', description: 'Device UUID', type: String })
  @ApiResponse({ status: 200, description: 'Device found' })
  @ApiBadRequestResponse({ description: 'Device not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.deviceService.findById(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a device' })
  @ApiParam({ name: 'id', description: 'Device UUID', type: String })
  @ApiResponse({ status: 200, description: 'Device updated successfully' })
  @ApiBadRequestResponse({ description: 'Device not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDeviceDto,
  ) {
    const result = await this.deviceService.update(id, dto);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a device' })
  @ApiParam({ name: 'id', description: 'Device UUID', type: String })
  @ApiResponse({ status: 204, description: 'Device deleted successfully' })
  @ApiBadRequestResponse({ description: 'Device not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.deviceService.delete(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }
}
