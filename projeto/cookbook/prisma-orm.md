# Prisma ORM Cookbook

**Quick reference for Prisma patterns.**

---

## Schema Definition

```prisma
// company.prisma
model Company {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  document  String   @unique

  users     User[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("companies")
}
```

---

## Basic CRUD

```typescript
// Create
const company = await prisma.company.create({
  data: { name, slug, document },
});

// Find unique
const company = await prisma.company.findUnique({
  where: { id },
});

// Find first
const company = await prisma.company.findFirst({
  where: { slug },
});

// Find many
const companies = await prisma.company.findMany({
  where: { isActive: true },
  orderBy: { createdAt: 'desc' },
  skip: 0,
  take: 10,
});

// Update
const company = await prisma.company.update({
  where: { id },
  data: { name },
});

// Delete
await prisma.company.delete({
  where: { id },
});
```

---

## Relations

```typescript
// Include related
const company = await prisma.company.findUnique({
  where: { id },
  include: { users: true },
});

// With nested create
const company = await prisma.company.create({
  data: {
    name: 'Test',
    users: {
      create: [{ email: 'user@test.com', password: 'hash' }],
    },
  },
  include: { users: true },
});
```

---

## Transactions

```typescript
// Sequential
const [company, user] = await prisma.$transaction([
  prisma.company.create({ data: { name } }),
  prisma.user.create({ data: { email } }),
]);

// Interactive
const result = await prisma.$transaction(async (tx) => {
  const company = await tx.company.create({ data: { name } });
  await tx.user.update({
    where: { id: userId },
    data: { companyId: company.id },
  });
  return company;
});
```

---

## Pagination

```typescript
const { data, total, page, limit } = await paginate<Company>(
  prisma.company,
  { where: { isActive: true } },
  { page: 1, limit: 10 },
);
```

---

## Common Issues

| Issue            | Solution                    |
| ---------------- | --------------------------- |
| Missing relation | Add relation in schema      |
| Type error       | Use `$inferSelect` or `Get` |
| Migration stuck  | Check active connections    |

---

## Commands

```bash
# Generate client
npx prisma generate

# Push schema
npx prisma db push

# Create migration
npx prisma migrate dev --name init

# Studio (GUI)
npx prisma studio
```
