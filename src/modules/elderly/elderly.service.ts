import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Either, either } from '../../lib/either';
import { CreateElderlyDto, UpdateElderlyDto } from './dto';

export type ElderlySuccess = {
  id: string;
  name: string;
  age: string;
  document: string;
  birthDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export class ElderlyNotFoundError extends Error {
  constructor(id: string) {
    super(`Elderly not found: ${id}`);
    this.name = 'ElderlyNotFoundError';
  }
}

@Injectable()
export class ElderlyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateElderlyDto): Promise<Either<Error, ElderlySuccess>> {
    const elderly = await this.prisma.elderly.create({ data: dto });
    return either.right({
      id: elderly.id,
      name: elderly.name,
      age: elderly.age,
      document: elderly.document,
      birthDate: elderly.birthDate,
      createdAt: elderly.createdAt,
      updatedAt: elderly.updatedAt,
    });
  }

  async findAll(): Promise<Either<Error, ElderlySuccess[]>> {
    const elderly = await this.prisma.elderly.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return either.right(
      elderly.map((e) => ({
        id: e.id,
        name: e.name,
        age: e.age,
        document: e.document,
        birthDate: e.birthDate,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      })),
    );
  }

  async findById(id: string): Promise<Either<Error, ElderlySuccess>> {
    const elderly = await this.prisma.elderly.findUnique({ where: { id } });
    if (!elderly) return either.left(new ElderlyNotFoundError(id));
    return either.right({
      id: elderly.id,
      name: elderly.name,
      age: elderly.age,
      document: elderly.document,
      birthDate: elderly.birthDate,
      createdAt: elderly.createdAt,
      updatedAt: elderly.updatedAt,
    });
  }

  async update(
    id: string,
    dto: UpdateElderlyDto,
  ): Promise<Either<Error, ElderlySuccess>> {
    const existing = await this.prisma.elderly.findUnique({ where: { id } });
    if (!existing) return either.left(new ElderlyNotFoundError(id));
    const elderly = await this.prisma.elderly.update({
      where: { id },
      data: dto,
    });
    return either.right({
      id: elderly.id,
      name: elderly.name,
      age: elderly.age,
      document: elderly.document,
      birthDate: elderly.birthDate,
      createdAt: elderly.createdAt,
      updatedAt: elderly.updatedAt,
    });
  }

  async delete(
    id: string,
  ): Promise<Either<Error, { id: string; success: boolean }>> {
    const existing = await this.prisma.elderly.findUnique({ where: { id } });
    if (!existing) return either.left(new ElderlyNotFoundError(id));
    await this.prisma.elderly.delete({ where: { id } });
    return either.right({ id, success: true });
  }
}
