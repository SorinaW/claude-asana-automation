---
title: Skills System
type: concept
sources: [initial-setup-session]
related: [architecture, n8n-connection, asana-client]
created: 2026-04-08
updated: 2026-04-08
confidence: high
---

# Skills System

How Claude Code skills work and how the Asana skills are structured.

## How skills activate

Each skill has a `SKILL.md` file with YAML frontmatter:

```yaml
---
name: asana-task-manager
description: Create, update, assign tasks... Use when user says "create a task", "assign task"...
---
```

Claude reads the `description` field and matches it against what the user types. When there's a match, Claude follows the instructions in the SKILL.md body.

## Global skills directory

Skills are installed to your Claude Code config directory:

```
~/.claude/skills/
├── asana/                    # Asana skills
│   ├── task-manager/SKILL.md
│   ├── goal-manager/SKILL.md
│   ├── project-manager/SKILL.md
│   ├── explorer/SKILL.md
│   └── shared-resources/
└── ...                       # Other skills
```

## Four Asana skills

| Skill | Trigger phrases | What it does |
|-------|----------------|-------------|
| `asana-task-manager` | "create a task", "assign", "mark done", "list tasks", "search tasks" | CRUD on tasks, subtasks, comments, batch operations |
| `asana-goal-manager` | "create a goal", "OKR", "goal progress", "status update" | Goals, sub-goals, metrics, status updates |
| `asana-project-manager` | "create a project", "add sections", "set up board" | Projects, sections, templates |
| `asana-explorer` | "who's in Asana", "show workspace", "list users" | Workspace discovery, user/team/project lookup |

## How skills use the API

Each skill references the [[cli-reference]] commands. Claude runs them via Bash:

```bash
cd /path/to/asana-connection && npx ts-node cli.ts tasks create '{"name":"..."}'
```

## Customizing skills

After running `setup`, update each SKILL.md with your GIDs:
- `YOUR_WORKSPACE_GID` → your workspace GID from setup output
- `YOUR_USER_GID` → your user GID
- `YOUR_TEAM_GID` → your team GID
- `YOUR_PROJECT_GID` → your default project GID
