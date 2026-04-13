# QUICK REFERENCE — VivaWatch Projeto System

**Print this if you like**

---

## Entry Point (Read in Order)

```
┌─────────────────────────────────────────┐
│        NEW AGENT ONBOARDING              │
└──────────────┬──────────────────────────┘
                │
         ┌──────▼──────┐
         │  CLAUDE.md  │  Rules
         └──────┬──────┘
                │
         ┌──────▼────────┐
         │   soul.md     │  Identity
         └──────┬────────┘
                │
         ┌──────▼────────┐
         │  lessons.md   │  Patterns
         └──────┬────────┘
                │
         ┌──────▼────────┐
         │  plan.md      │  Tasks
         └──────┬────────┘
                │
         ┌──────▼────────────────┐
         │   skills/<your_role>  │  Load your skill
         └──────┬────────────────┘
```

---

## Task Workflow

```
START → Plan → Implement → Test → Lint → Document → END

         ↓              ↓          ↓        ↓
    Write code      Pass tests  Fix lint  Update journal
```

---

## Decision Tree: Load Which Skill?

```
Are you BUILDING a new feature?
  YES → skills/implementer.md

Are you HUNTING why tests fail?
  YES → skills/debug.md

Are you stuck in debugging loop > 1 hr?
  YES → skills/systematic-debug.md
```

---

## Before Committing

```
npm run lint        ← ESLint + autofix
npm run test       ← All tests green
npm run build      ← Production build
```

---

## Common File Locations

```
src/
├── lib/
│   ├── either/           ← Either pattern
│   └── base-operation/    ← Base operation
├── modules/
│   ├── company/
│   ├── user/
│   └── ...
└── projeto/
    ├── CLAUDE.md          ← Rules
    ├── soul.md           ← Identity
    ├── plan.md           ← Tasks [x] when done
    └── lessons.md        ← Patterns
```

---

## Success Criteria

Your work is DONE when:

```
✅ npm run lint passes
✅ npm run test passes
✅ Tests cover new feature
✅ No `any` types
✅ Either pattern for errors
✅ Operation classes for business logic
✅ journal entry created
✅ plan.md task marked [x]
```

---

**PRINT THIS. KEEP IT VISIBLE.**
**Then: Read CLAUDE.md + soul.md. You're ready.**
