---
title: Validation
type: concept
sources: [2026-04-08-initial-setup-session]
related: [asana-client, cli-reference]
created: 2026-04-08
updated: 2026-04-08
confidence: high
---

# Validation

Pre-submission checks at `shared/validate-task.ts`.

## What it validates

### Tasks
- Name required and non-empty
- `due_on` must be YYYY-MM-DD
- `due_at` must be ISO 8601
- Warns if both `due_on` and `due_at` set (due_at takes precedence)
- Warns if no project/workspace/parent specified

### Goals
- Name required and non-empty
- `due_on` and `start_on` must be YYYY-MM-DD
- `start_on` cannot be after `due_on`
- Warns if no workspace or team specified

### Projects
- Name required and non-empty
- Validates `color` against 18 valid Asana colors + `none`
- Validates `default_view` against: list, board, calendar, timeline

## Return format

```typescript
interface ValidationResult {
  valid: boolean;    // true if no errors
  errors: string[];  // blocking issues
  warnings: string[];  // non-blocking notes
}
```
