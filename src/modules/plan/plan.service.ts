import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Either, either } from '../../lib/either';
import { CreatePlanDto } from './dto';

export type PlanSuccess = {
  id: string;
  name: string;
  price: number;
  period: string;
  isMain: boolean;
  isActive: boolean;
  isEnterprise: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class PlanNotFoundError extends Error {
  constructor(id: string) {
    super(`Plan not found: ${id}`);
    this.name = 'PlanNotFoundError';
  }
}

export class PlanAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`Plan with name "${name}" already exists`);
    this.name = 'PlanAlreadyExistsError';
  }
}

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePlanDto): Promise<Either<Error, PlanSuccess>> {
    const existing = await this.prisma.plan.findUnique({
      where: { name: dto.name },
    });
    if (existing) return either.left(new PlanAlreadyExistsError(dto.name));
    const plan = await this.prisma.plan.create({ data: dto as any });
    return either.right({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      period: plan.period,
      isMain: plan.isMain,
      isActive: plan.isActive,
      isEnterprise: plan.isEnterprise,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    });
  }

  async findAll(): Promise<Either<Error, PlanSuccess[]>> {
    const plans = await this.prisma.plan.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return either.right(
      plans.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        period: p.period,
        isMain: p.isMain,
        isActive: p.isActive,
        isEnterprise: p.isEnterprise,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    );
  }

  async findById(id: string): Promise<Either<Error, PlanSuccess>> {
    const p = await this.prisma.plan.findUnique({ where: { id } });
    if (!p) return either.left(new PlanNotFoundError(id));
    return either.right({
      id: p.id,
      name: p.name,
      price: p.price,
      period: p.period,
      isMain: p.isMain,
      isActive: p.isActive,
      isEnterprise: p.isEnterprise,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  async update(
    id: string,
    dto: Partial<CreatePlanDto>,
  ): Promise<Either<Error, PlanSuccess>> {
    const existing = await this.prisma.plan.findUnique({ where: { id } });
    if (!existing) return either.left(new PlanNotFoundError(id));
    const plan = await this.prisma.plan.update({
      where: { id },
      data: dto as any,
    });
    return either.right({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      period: plan.period,
      isMain: plan.isMain,
      isActive: plan.isActive,
      isEnterprise: plan.isEnterprise,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    });
  }

  async delete(
    id: string,
  ): Promise<Either<Error, { id: string; success: boolean }>> {
    const existing = await this.prisma.plan.findUnique({ where: { id } });
    if (!existing) return either.left(new PlanNotFoundError(id));
    await this.prisma.plan.delete({ where: { id } });
    return either.right({ id, success: true });
  }
}
