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
import { ElderlyService } from './elderly.service';
import { CreateElderlyDto, UpdateElderlyDto } from './dto';
import { isLeft, isRight } from '../../lib/either';

@Controller('elderly')
export class ElderlyController {
  constructor(private readonly elderlyService: ElderlyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateElderlyDto) {
    const result = await this.elderlyService.create(dto);
    if (isLeft(result)) {
      return { error: result.value.name, message: result.value.message };
    }
    return result.value;
  }

  @Get()
  async findAll() {
    const result = await this.elderlyService.findAll();
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.elderlyService.findById(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Put(':id')
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
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.elderlyService.delete(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }
}
