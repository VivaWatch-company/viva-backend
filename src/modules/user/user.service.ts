import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Either, either } from '../../lib/either';
import { CreateUserDto, UpdateUserDto, UserRole } from './dto';

export type UserSuccess = {
  id: string;
  email: string;
  role: UserRole;
  isOwner: boolean;
  isActive: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User not found: ${id}`);
    this.name = 'UserNotFoundError';
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email "${email}" already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<Either<Error, UserSuccess>> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) return either.left(new UserAlreadyExistsError(dto.email));

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password,
        role: dto.role || UserRole.CAREGIVER,
        companyId: dto.companyId,
        isOwner: dto.isOwner || false,
        isActive: true,
      },
    });

    return either.right({
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      isOwner: user.isOwner,
      isActive: user.isActive,
      companyId: user.companyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findAll(companyId?: string): Promise<Either<Error, UserSuccess[]>> {
    const where = companyId ? { companyId } : {};
    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return either.right(
      users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role as UserRole,
        isOwner: u.isOwner,
        isActive: u.isActive,
        companyId: u.companyId,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
    );
  }

  async findById(id: string): Promise<Either<Error, UserSuccess>> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return either.left(new UserNotFoundError(id));
    return either.right({
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      isOwner: user.isOwner,
      isActive: user.isActive,
      companyId: user.companyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async update(
    id: string,
    dto: UpdateUserDto,
  ): Promise<Either<Error, UserSuccess>> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) return either.left(new UserNotFoundError(id));

    const user = await this.prisma.user.update({ where: { id }, data: dto });
    return either.right({
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      isOwner: user.isOwner,
      isActive: user.isActive,
      companyId: user.companyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async delete(
    id: string,
  ): Promise<Either<Error, { id: string; success: boolean }>> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) return either.left(new UserNotFoundError(id));
    await this.prisma.user.delete({ where: { id } });
    return either.right({ id, success: true });
  }

  async findByEmail(email: string): Promise<Either<Error, UserSuccess>> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return either.left(new UserNotFoundError(email));
    return either.right({
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      isOwner: user.isOwner,
      isActive: user.isActive,
      companyId: user.companyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
