---
title: CLI Reference
type: concept
sources: [initial-setup-session]
related: [asana-client, architecture, skills-system]
created: 2026-04-08
updated: 2026-04-08
confidence: high
---

# CLI Reference

The `cli.ts` command-line interface.

## Why CLI over inline imports

On Windows, `ts-node -e "import { ... }"` produces no output due to module resolution issues. The CLI uses proper TypeScript compilation. All skill SKILL.md files reference CLI commands.

## Commands

### Setup & Verification

```bash
npx ts-node cli.ts setup
# Shows: user, workspace, teams, projects — and their GIDs
```

### Tasks

```bash
npx ts-node cli.ts tasks list <project_gid>
npx ts-node cli.ts tasks create '{"name":"...","assignee":"...","due_on":"YYYY-MM-DD","projects":["..."]}'
npx ts-node cli.ts tasks complete <task_gid>
npx ts-node cli.ts tasks search <query_text>
npx ts-node cli.ts tasks my
```

### Goals

```bash
npx ts-node cli.ts goals list
npx ts-node cli.ts goals create '{"name":"...","owner":"...","due_on":"YYYY-MM-DD"}'
npx ts-node cli.ts goals progress <goal_gid> <current_value> <target_value>
npx ts-node cli.ts goals status <goal_gid> <on_track|at_risk|off_track> <title>
```

### Projects

```bash
npx ts-node cli.ts projects list
npx ts-node cli.ts projects create '{"name":"...","color":"dark-blue","default_view":"board","team":"TEAM_GID"}'
npx ts-node cli.ts projects sections <project_gid>
```

### Users

```bash
npx ts-node cli.ts users me
npx ts-node cli.ts users list
```

## Output format

- Lists: name + GID for each item
- Single items: name + GID + key details
- Errors: API error message
- Create operations: URL to the new resource
