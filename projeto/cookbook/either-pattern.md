# Either Pattern Cookbook

**Error handling with functional approach using Either<L, R>.**

---

## Basic Types

```typescript
// Either<L, R> = Left<L> | Right<R>
// Left = Error/Failure
// Right = Success

export type Either<L, R> = Left<L> | Right<R>;

export class Left<L> {
  constructor(public readonly value: L) {}

  isLeft(): this is Left<L> {
    return true;
  }
  isRight(): boolean {
    return false;
  }
}

export class Right<R> {
  constructor(public readonly value: R) {}

  isLeft(): boolean {
    return false;
  }
  isRight(): this is Right<R> {
    return true;
  }
}
```

---

## Helper Functions

```typescript
export const either = {
  left: <L>(value: L): Either<L, never> => new Left(value),
  right: <R>(value: R): Either<never, R> => new Right(value),
};

export function isLeft<L, R>(e: Either<L, R>): e is Left<L> {
  return e.isLeft();
}

export function isRight<L, R>(e: Either<L, R>): e is Right<R> {
  return e.isRight();
}
```

---

## Usage in Service

```typescript
// company.service.ts
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
      // ... other fields
    });
  }
}
```

---

## Usage in Controller

```typescript
// company.controller.ts
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(@Body() dto: CreateCompanyDto) {
    const result = await this.companyService.create(dto);

    if (isLeft(result)) {
      return { error: result.value.name, message: result.value.message };
    }

    return result.value;
  }
}
```

---

## Custom Errors

```typescript
export class CompanyNotFoundError extends Error {
  constructor(id: string) {
    super(`Company not found: ${id}`);
    this.name = 'CompanyNotFoundError';
  }
}

export class CompanyAlreadyExistsError extends Error {
  constructor(slug: string) {
    super(`Company with slug "${slug}" already exists`);
    this.name = 'CompanyAlreadyExistsError';
  }
}
```

---

## Why Either?

1. **Explicit error handling** - No hidden exceptions
2. **Type-safe** - TypeScript knows error vs success
3. **Composable** - Easy to chain operations
4. **Functional** - No try/catch needed

---

## Alternatives Considered

- **throw** - Not type-safe, breaks flow
- **Result<T, E>** - Same as Either, different name
- **Optional** - Only for nullable, not errors
