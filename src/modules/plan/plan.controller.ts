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
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto';
import { isLeft } from '../../lib/either';

@ApiTags('Plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({ status: 201, description: 'Plan created successfully' })
  @ApiBadRequestResponse({
    description: 'Bad request - validation error or duplicate name',
  })
  async create(@Body() dto: CreatePlanDto) {
    const result = await this.planService.create(dto);
    if (isLeft(result)) {
      return { error: result.value.name, message: result.value.message };
    }
    return result.value;
  }

  @Get()
  @ApiOperation({ summary: 'Get all plans' })
  @ApiResponse({ status: 200, description: 'List of plans' })
  async findAll() {
    const result = await this.planService.findAll();
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a plan by ID' })
  @ApiParam({ name: 'id', description: 'Plan UUID', type: String })
  @ApiResponse({ status: 200, description: 'Plan found' })
  @ApiBadRequestResponse({ description: 'Plan not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.planService.findById(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a plan' })
  @ApiParam({ name: 'id', description: 'Plan UUID', type: String })
  @ApiResponse({ status: 200, description: 'Plan updated successfully' })
  @ApiBadRequestResponse({ description: 'Plan not found' })
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
  @ApiOperation({ summary: 'Delete a plan' })
  @ApiParam({ name: 'id', description: 'Plan UUID', type: String })
  @ApiResponse({ status: 204, description: 'Plan deleted successfully' })
  @ApiBadRequestResponse({ description: 'Plan not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.planService.delete(id);
    if (isLeft(result)) {
      return { error: result.value.message };
    }
    return result.value;
  }
}
