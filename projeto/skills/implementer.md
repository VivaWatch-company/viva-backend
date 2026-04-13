# Implementer Skill — Building New Features

**Load this skill when building new features, endpoints, or modules.**

---

## 1. Read First

- [ ] CLAUDE.md — Rules & conventions
- [ ] lessons.md — Patterns learned

---

## 2. Understand the Feature

1. Read the relevant schema in `prisma/`
2. Check existing similar modules for pattern
3. Identify what operations are needed (CRUD)

---

## 3. Plan the Implementation

For each operation needed:

| Step | Action                             |
| ---- | ---------------------------------- |
| 1    | Create DTO in `dto/`               |
| 2    | Create operation in `operations/`  |
| 3    | Create service that uses operation |
| 4    | Create controller                  |
| 5    | Update module                      |
| 6    | Create unit test                   |

---

## 4. Implementation Template

### DTO

```typescript
// dto/create-entity.dto.ts
export class CreateEntityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

### Operation

```typescript
// operations/create-entity.operation.ts
export class CreateEntityOperation extends BaseOperation<
  CreateEntityDto,
  Entity,
  DomainError
> {
  async call(): Promise<Either<DomainError, Entity>> {
    // Validate
    if (!this.params.name) {
      return this.fail(new ValidationError('Name required'));
    }

    // Business logic
    const entity = await this.prisma.entity.create({
      data: this.params,
    });

    return this.ok(entity);
  }
}
```

### Service

```typescript
// entity.service.ts
@Injectable()
export class EntityService {
  async create(dto: CreateEntityDto): Promise<Either<DomainError, Entity>> {
    return await new CreateEntityOperation(this.prisma, dto).call();
  }
}
```

### Controller

```typescript
// entity.controller.ts
@Controller('entities')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @Post()
  async create(@Body() dto: CreateEntityDto) {
    const result = await this.entityService.create(dto);
    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
    return result.value;
  }
}
```

---

## 5. Verify

```bash
npm run lint
npm run test
npm run build
```

---

## 6. Document

- [ ] Create journal entry in `projeto/journals/`
- [ ] Update lessons.md if new pattern
- [ ] Mark task [x] in plan.md
