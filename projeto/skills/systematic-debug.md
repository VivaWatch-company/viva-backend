# Systematic Debug Skill — Deep Investigation

**Load this skill when simple debugging doesn't work.**

---

## When to Use

- Test fails but error is unclear
- Flaky tests (sometimes pass, sometimes fail)
- Complex integration issues

---

## Investigation Protocol

### Step 1: Isolate

```
1. Run ONLY the failing test
2. Run in isolation (--runInBand)
3. Check if passes/fails consistently
```

### Step 2: Gather Evidence

```
1. Full error stack trace
2. Test setup (beforeEach)
3. Database state
4. Environment variables
```

### Step 3: Hypothesis

```
1. What SHOULD happen?
2. What IS happening?
3. What's different?
4. What's the root cause?
```

### Step 4: Test Hypothesis

```
1. Create minimal reproduction
2. Fix in isolation
3. Verify fix works
```

---

## Evidence Collection

```bash
# Run single test
npm test -- --testPathPattern="entity.spec.ts" --verbose

# Run in band
npm test -- --runInBand

# With coverage
npm test -- --coverage
```

---

## Documentation

If issue found:

- [ ] Document in lessons.md (watchouts section)
- [ ] Create journal entry
- [ ] Mark plan.md if needed
