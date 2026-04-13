import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Either, either } from '../../lib/either';
import { CreateCompanyDto } from './dto';

export type CompanySuccess = {
  id: string;
  name: string;
  slug: string;
  document: string;
  createdAt: Date;
  updatedAt: Date;
};

export class CompanyAlreadyExistsError extends Error {
  constructor(slug: string) {
    super(`Company with slug "${slug}" already exists`);
    this.name = 'CompanyAlreadyExistsError';
  }
}

export class CompanyNotFoundError extends Error {
  constructor(id: string) {
    super(`Company not found: ${id}`);
    this.name = 'CompanyNotFoundError';
  }
}

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCompanyDto): Promise<Either<Error, CompanySuccess>> {
    const existing = await this.prisma.company.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      return either.left(new CompanyAlreadyExistsError(dto.slug));
    }

    const company = await this.prisma.company.create({ data: dto });

    return either.right({
      id: company.id,
      name: company.name,
      slug: company.slug,
      document: company.document,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }

  async findAll(): Promise<Either<Error, CompanySuccess[]>> {
    const companies = await this.prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return either.right(
      companies.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        document: c.document,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    );
  }

  async findById(id: string): Promise<Either<Error, CompanySuccess>> {
    const company = await this.prisma.company.findUnique({ where: { id } });

    if (!company) {
      return either.left(new CompanyNotFoundError(id));
    }

    return either.right({
      id: company.id,
      name: company.name,
      slug: company.slug,
      document: company.document,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }

  async update(
    id: string,
    dto: Partial<CreateCompanyDto>,
  ): Promise<Either<Error, CompanySuccess>> {
    const existing = await this.prisma.company.findUnique({ where: { id } });

    if (!existing) {
      return either.left(new CompanyNotFoundError(id));
    }

    const company = await this.prisma.company.update({
      where: { id },
      data: dto,
    });

    return either.right({
      id: company.id,
      name: company.name,
      slug: company.slug,
      document: company.document,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }

  async delete(
    id: string,
  ): Promise<Either<Error, { id: string; success: boolean }>> {
    const existing = await this.prisma.company.findUnique({ where: { id } });

    if (!existing) {
      return either.left(new CompanyNotFoundError(id));
    }

    await this.prisma.company.delete({ where: { id } });

    return either.right({ id, success: true });
  }
}
