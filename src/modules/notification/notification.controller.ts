import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto';
import { isLeft, isRight } from '../../lib/either';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateNotificationDto) {
    const result = await this.notificationService.create(dto);
    if (isLeft(result)) {
      return { error: result.value.name, message: result.value.message };
    }
    return result.value;
  }

  @Get()
  async findAll() {
    const result = await this.notificationService.findAll();
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.notificationService.findById(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }
}
