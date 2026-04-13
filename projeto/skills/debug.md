# Debug Skill — Finding Why Tests Fail

**Load this skill when investigating test failures or errors.**

---

## 1. Read First

- [ ] CLAUDE.md
- [ ] lessons.md (check for known watchouts)

---

## 2. Gather Information

1. Read the failing test
2. Read the implementation
3. Check error message
4. Check test setup (beforeEach, mocks)

---

## 3. Common Issues

| Issue              | Check                    |
| ------------------ | ------------------------ |
| Test not compiling | TypeScript errors        |
| Database error     | Prisma connection        |
| Auth error         | JWT/API Key headers      |
| 404                | Route definition         |
| 500                | Operation error handling |

---

## 4. Debug Steps

```
1. Run test with verbose: npm test -- --verbose
2. Check error message
3. Read implementation
4. Fix issue
5. Re-run test
```

---

## 5. Still Failing?

If stuck > 30 min:

- [ ] Load systematic-debug.md
- [ ] Create journal entry
- [ ] Ask for help
