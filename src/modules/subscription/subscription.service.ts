import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Either, either } from '../../lib/either';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';

export type SubscriptionSuccess = {
  id: string;
  planId: string;
  status: string;
  startAt: Date;
  endAt: Date | null;
  renewAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export class SubscriptionNotFoundError extends Error {
  constructor(id: string) {
    super(`Subscription not found: ${id}`);
    this.name = 'SubscriptionNotFoundError';
  }
}

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateSubscriptionDto,
  ): Promise<Either<Error, SubscriptionSuccess>> {
    const s = await this.prisma.subscription.create({ data: dto as any });
    return either.right({
      id: s.id,
      planId: s.planId,
      status: s.status,
      startAt: s.startAt,
      endAt: s.endAt,
      renewAt: s.renewAt,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    });
  }

  async findAll(): Promise<Either<Error, SubscriptionSuccess[]>> {
    const subscriptions = await this.prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return either.right(
      subscriptions.map((s) => ({
        id: s.id,
        planId: s.planId,
        status: s.status,
        startAt: s.startAt,
        endAt: s.endAt,
        renewAt: s.renewAt,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    );
  }

  async findById(id: string): Promise<Either<Error, SubscriptionSuccess>> {
    const s = await this.prisma.subscription.findUnique({ where: { id } });
    if (!s) return either.left(new SubscriptionNotFoundError(id));
    return either.right({
      id: s.id,
      planId: s.planId,
      status: s.status,
      startAt: s.startAt,
      endAt: s.endAt,
      renewAt: s.renewAt,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    });
  }

  async update(
    id: string,
    dto: UpdateSubscriptionDto,
  ): Promise<Either<Error, SubscriptionSuccess>> {
    const existing = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!existing) return either.left(new SubscriptionNotFoundError(id));
    const s = await this.prisma.subscription.update({
      where: { id },
      data: dto as any,
    });
    return either.right({
      id: s.id,
      planId: s.planId,
      status: s.status,
      startAt: s.startAt,
      endAt: s.endAt,
      renewAt: s.renewAt,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    });
  }

  async delete(
    id: string,
  ): Promise<Either<Error, { id: string; success: boolean }>> {
    const existing = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!existing) return either.left(new SubscriptionNotFoundError(id));
    await this.prisma.subscription.delete({ where: { id } });
    return either.right({ id, success: true });
  }
}
