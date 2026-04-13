# NestJS Patterns Cookbook

**Quick reference for common NestJS patterns.**

---

## Module Pattern

```typescript
// company.module.ts
@Module({
  imports: [PrismaModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
```

---

## Service Pattern

```typescript
// company.service.ts
@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCompanyDto): Promise<Either<DomainError, Company>> {
    return await new CreateCompanyOperation(this.prisma, dto).call();
  }
}
```

---

## Controller Pattern

```typescript
// company.controller.ts
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  async create(@Body() dto: CreateCompanyDto, @CurrentUser() user: User) {
    const result = await this.companyService.create(dto);
    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
    return result.value;
  }

  @Get()
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  async findAll() {
    return this.companyService.findAll();
  }
}
```

---

## DTO Validation

```typescript
// create-company.dto.ts
export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/)
  slug: string;

  @IsString()
  @IsNotEmpty()
  document: string;
}
```

---

## Error Handling

```typescript
// Custom error
export class CompanyNotFoundError extends Error {
  constructor(id: string) {
    super(`Company not found: ${id}`);
    this.name = 'CompanyNotFoundError';
  }
}

// In operation
if (!company) {
  return this.fail(new CompanyNotFoundError(this.params.id));
}
```

---

## Guards

```typescript
// JwtAuthGuard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// ApiKeyGuard
@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.headers['x-auth-api-key'] === process.env.API_KEY;
  }
}
```

---

## Swagger Setup

```typescript
// main.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('VivaWatch API')
  .setDescription('Health monitoring API for elderly care')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

---

## Decorators

```typescript
// current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```
