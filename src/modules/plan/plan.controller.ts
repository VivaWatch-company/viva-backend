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
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto';
import { isLeft, isRight } from '../../lib/either';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePlanDto) {
    const result = await this.planService.create(dto);
    if (isLeft(result)) {
      return { error: result.value.name, message: result.value.message };
    }
    return result.value;
  }

  @Get()
  async findAll() {
    const result = await this.planService.findAll();
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.planService.findById(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreatePlanDto>,
  ) {
    const result = await this.planService.update(id, dto);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.planService.delete(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }
}
