# lessons.md — Consolidated Learning & Patterns

**Live document. Updated by agents after each task. Read BEFORE planning.**

---

## ✅ Pattern: Either for Error Handling

### What We Learned

- Either<L, R> represents either Left (error) or Right (success)
- Left<L> for errors, Right<R> for success
- Never throw in operations, return Either instead

### Example

```typescript
type Either<L, R> = Left<L> | Right<R>;

class Left<L> {
  constructor(public readonly value: L) {}
  isLeft(): this is Left<L> {
    return true;
  }
  isRight(): boolean {
    return false;
  }
}

class Right<R> {
  constructor(public readonly value: R) {}
  isLeft(): boolean {
    return false;
  }
  isRight(): this is Right<R> {
    return true;
  }
}

// Usage
const result = await operation.call();
if (result.isLeft()) {
  return result.value; // Handle error
}
return result.value; // Handle success
```

---

## ✅ Pattern: BaseOperation

### What We Learned

- BaseOperation wraps business logic with Either
- TParams: input type, TSuccess: success type, TError: error type
- Methods: ok() for success, fail() for error

### Example

```typescript
class CreateCompanyOperation extends BaseOperation<
  CreateCompanyDto,
  Company,
  DomainError
> {
  async call(): Promise<Either<DomainError, Company>> {
    if (!this.params.name) {
      return this.fail(new ValidationError('Name required'));
    }
    const company = await this.prisma.company.create({ data: this.params });
    return this.ok(company);
  }
}
```

---

## ✅ Pattern: NestJS Module per Entity

### What We Learned

- 1 module = 1 entity (Company, User, Device...)
- Each module: module.ts + service.ts + controller.ts + operations/

### Example

```
modules/company/
├── company.module.ts    # Module definition
├── company.service.ts  # Database operations
├── company.controller.ts # HTTP endpoints
├── dto/
│   ├── index.ts
│   └── create-company.dto.ts
├── operations/
│   ├── index.ts
│   ├── create-company.operation.ts
│   └── list-companies.operation.ts
└── company.spec.ts     # Tests
```

---

## ⚠️ Watchout: Prisma Relations

### Issue

- Missing relations in schema can cause runtime errors
- Always define relations in Prisma schema

---

## 🔐 Security Notes

- Passwords: hash with bcrypt
- API Key: validate on protected routes
- JWT: validate on private routes

---

## 📝 Next Patterns to Document

- [ ] Auth module patterns
- [ ] E2E test patterns
- [ ] DTO validation patterns

**Last Updated**: 2026-04-13
