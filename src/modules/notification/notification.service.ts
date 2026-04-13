import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Either, either } from '../../lib/either';
import { CreateNotificationDto } from './dto';

export type NotificationSuccess = {
  id: string;
  deviceId: string;
  caregiverId: string;
  type: string;
  status: string;
  channel: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};

export class NotificationNotFoundError extends Error {
  constructor(id: string) {
    super(`Notification not found: ${id}`);
    this.name = 'NotificationNotFoundError';
  }
}

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateNotificationDto,
  ): Promise<Either<Error, NotificationSuccess>> {
    const n = await this.prisma.notification.create({ data: dto as any });
    return either.right({
      id: n.id,
      deviceId: n.deviceId,
      caregiverId: n.caregiverId,
      type: n.type,
      status: n.status,
      channel: n.channel,
      message: n.message,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    });
  }

  async findAll(): Promise<Either<Error, NotificationSuccess[]>> {
    const notifications = await this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return either.right(
      notifications.map((n) => ({
        id: n.id,
        deviceId: n.deviceId,
        caregiverId: n.caregiverId,
        type: n.type,
        status: n.status,
        channel: n.channel,
        message: n.message,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      })),
    );
  }

  async findById(id: string): Promise<Either<Error, NotificationSuccess>> {
    const n = await this.prisma.notification.findUnique({ where: { id } });
    if (!n) return either.left(new NotificationNotFoundError(id));
    return either.right({
      id: n.id,
      deviceId: n.deviceId,
      caregiverId: n.caregiverId,
      type: n.type,
      status: n.status,
      channel: n.channel,
      message: n.message,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    });
  }
}
