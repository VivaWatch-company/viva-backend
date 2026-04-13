# CLAUDE.md — Clear Project Rules for VivaWatch

**Read FIRST always by the orchestrator and each sub-agent.**

## 1. Stack & Architecture

### Core Stack

- **Runtime**: Node.js 20+ (TypeScript 6.0+)
- **Framework**: NestJS 11 (declarative, modular, robust)
- **Database**: PostgreSQL 14+ (Prisma ORM)
- **Cache/Queue**: Redis (BullMQ for async jobs)
- **Auth**: JWT + API Key (header: `x-auth-api-key`)
- **Testing**: Jest 30+ (ci: `npm run test:ci`)

### Project Structure

```
src/
├── lib/
│   ├── either/           # Either pattern for error handling
│   └── base-operation/   # Base operation with Either
├── modules/
│   ├── company/
│   ├── user/
│   ├── device/
│   ├── elderly/
│   ├── measurement/
│   ├── notification/
│   ├── plan/
│   └── subscription/
├── common/              # Guards, filters, decorators
├── app.module.ts
├── config.ts
└── main.ts
```

## 2. Code Conventions

### Module Design Pattern

- 1 module = 1 entity
- Pattern: `<entity>.module.ts` → `<entity>.service.ts` → `<entity>.controller.ts`
- Operations: `<entity>.operation.ts` (Either pattern)
- Always use DTOs for input validation
- Services: business logic, never HTTP logic
- Controllers: handle HTTP only
- Operations: encapsulate business logic with Either

### Naming Conventions

- Files: kebab-case (`company.service.ts`)
- Classes: PascalCase (`CompanyService`)
- Methods/constants: camelCase (`createCompany()`)
- Operations: `VerbEntityOperation` pattern

### Error Handling (Either Pattern)

```typescript
// ✅ DO: Use Either for error handling
class CreateCompanyOperation extends BaseOperation<CreateCompanyDto, Company, DomainError> {
  async call(): Promise<Either<DomainError, Company>> {
    const existing = await this.prisma.company.findUnique({ where: { slug } });
    if (existing) {
      return this.fail(new CompanyAlreadyExistsError(slug));
    }
    return this.ok(company);
  }
}

// ❌ DON'T: Throw errors directly
async createCompany(dto: CreateCompanyDto) {
  throw new ConflictException('Company exists');
}
```

### Authentication Flow

1. **Login** (`POST /auth/login`) → JWT + refresh token
2. **Private routes** → Check JWT + API Key
3. **Token refresh** → `POST /auth/refresh`

## 3. Patterns & Best Practices

### Operation Pattern

```typescript
// modules/company/operations/create-company.operation.ts
export class CreateCompanyOperation extends BaseOperation<
  CreateCompanyDto,
  Company,
  DomainError
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async call(): Promise<Either<DomainError, Company>> {
    const company = await this.prisma.company.create({ data: this.params });
    return this.ok(company);
  }
}
```

### Service Composition

```typescript
// ❌ DON'T: Direct database calls in controller
@Post()
create(@Body() dto: CreateCompanyDto) {
  return this.prisma.company.create({ data: dto });
}

// ✅ DO: Use operation
@Post()
async create(@Body() dto: CreateCompanyDto) {
  return await new CreateCompanyOperation(this.prisma, dto).call();
}
```

## 4. Testing

- Unit tests co-located with code (`*.spec.ts`)
- E2E tests in `test/` directory
- Test operations with Either pattern

## 5. Code Review Checklist

- [ ] Either pattern for error handling
- [ ] Operations for business logic
- [ ] DTOs with validation
- [ ] Unit tests for operations
- [ ] No `any` types

## 6. Common Mistakes (DON'T DO)

1. ❌ Mixing database/HTTP logic
2. ❌ Using `any` type
3. ❌ Direct throws in operations (use Either)
4. ❌ Direct database access in controller

---

**Everything else is in lessons.md and skills/**
