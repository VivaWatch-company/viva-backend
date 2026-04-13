import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Either, either } from '../../lib/either';
import { CreateMeasurementDto } from './dto';

export type MeasurementSuccess = {
  id: string;
  deviceId: string;
  bpm: number;
  spo2: number;
  fallDetected: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class MeasurementNotFoundError extends Error {
  constructor(id: string) {
    super(`Measurement not found: ${id}`);
    this.name = 'MeasurementNotFoundError';
  }
}

@Injectable()
export class MeasurementService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateMeasurementDto,
  ): Promise<Either<Error, MeasurementSuccess>> {
    const m = await this.prisma.measurement.create({ data: dto });
    return either.right({
      id: m.id,
      deviceId: m.deviceId,
      bpm: m.bpm,
      spo2: m.spo2,
      fallDetected: m.fallDetected,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    });
  }

  async findAll(
    deviceId?: string,
  ): Promise<Either<Error, MeasurementSuccess[]>> {
    const where = deviceId ? { deviceId } : {};
    const measurements = await this.prisma.measurement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return either.right(
      measurements.map((m) => ({
        id: m.id,
        deviceId: m.deviceId,
        bpm: m.bpm,
        spo2: m.spo2,
        fallDetected: m.fallDetected,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
    );
  }

  async findById(id: string): Promise<Either<Error, MeasurementSuccess>> {
    const m = await this.prisma.measurement.findUnique({ where: { id } });
    if (!m) return either.left(new MeasurementNotFoundError(id));
    return either.right({
      id: m.id,
      deviceId: m.deviceId,
      bpm: m.bpm,
      spo2: m.spo2,
      fallDetected: m.fallDetected,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    });
  }

  async delete(
    id: string,
  ): Promise<Either<Error, { id: string; success: boolean }>> {
    const existing = await this.prisma.measurement.findUnique({
      where: { id },
    });
    if (!existing) return either.left(new MeasurementNotFoundError(id));
    await this.prisma.measurement.delete({ where: { id } });
    return either.right({ id, success: true });
  }
}
