import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Either, either } from '../../lib/either';
import { CreateDeviceDto, UpdateDeviceDto } from './dto';

export type DeviceSuccess = {
  id: string;
  name: string;
  serialNumber: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
};

export class DeviceNotFoundError extends Error {
  constructor(id: string) {
    super(`Device not found: ${id}`);
    this.name = 'DeviceNotFoundError';
  }
}

export class DeviceAlreadyExistsError extends Error {
  constructor(serialNumber: string) {
    super(`Device with serial number "${serialNumber}" already exists`);
    this.name = 'DeviceAlreadyExistsError';
  }
}

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDeviceDto): Promise<Either<Error, DeviceSuccess>> {
    const existing = await this.prisma.device.findUnique({
      where: { serialNumber: dto.serialNumber },
    });

    if (existing) {
      return either.left(new DeviceAlreadyExistsError(dto.serialNumber));
    }

    const device = await this.prisma.device.create({ data: dto });

    return either.right({
      id: device.id,
      name: device.name,
      serialNumber: device.serialNumber,
      companyId: device.companyId,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    });
  }

  async findAll(): Promise<Either<Error, DeviceSuccess[]>> {
    const devices = await this.prisma.device.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return either.right(
      devices.map((d) => ({
        id: d.id,
        name: d.name,
        serialNumber: d.serialNumber,
        companyId: d.companyId,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
    );
  }

  async findById(id: string): Promise<Either<Error, DeviceSuccess>> {
    const device = await this.prisma.device.findUnique({ where: { id } });

    if (!device) {
      return either.left(new DeviceNotFoundError(id));
    }

    return either.right({
      id: device.id,
      name: device.name,
      serialNumber: device.serialNumber,
      companyId: device.companyId,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    });
  }

  async update(
    id: string,
    dto: UpdateDeviceDto,
  ): Promise<Either<Error, DeviceSuccess>> {
    const existing = await this.prisma.device.findUnique({ where: { id } });

    if (!existing) {
      return either.left(new DeviceNotFoundError(id));
    }

    const device = await this.prisma.device.update({
      where: { id },
      data: dto,
    });

    return either.right({
      id: device.id,
      name: device.name,
      serialNumber: device.serialNumber,
      companyId: device.companyId,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    });
  }

  async delete(
    id: string,
  ): Promise<Either<Error, { id: string; success: boolean }>> {
    const existing = await this.prisma.device.findUnique({ where: { id } });

    if (!existing) {
      return either.left(new DeviceNotFoundError(id));
    }

    await this.prisma.device.delete({ where: { id } });

    return either.right({ id, success: true });
  }
}
