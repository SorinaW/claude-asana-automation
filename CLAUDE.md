# Asana Connection for Claude Code

## Overview
Control Asana directly from Claude Code — create tasks, assign goals, manage projects, and track progress, all by typing natural language. Built using the same Claude Code Skills pattern as the [claude-n8n-automation](https://github.com/SorinaW/claude-n8n-automation).

## Setup
1. Generate an Asana Personal Access Token at https://app.asana.com/0/my-apps
2. Create a `.asana-api-key` file in this directory with your token (or set `ASANA_API_KEY` env var)
3. Run `npm install` then `npx ts-node cli.ts setup` to verify connection and discover your workspace GIDs

## Architecture
- **shared/asana-client.ts** — TypeScript REST client for the Asana API (zero runtime dependencies, uses Node.js built-in `https`)
- **shared/validate-task.ts** — Validation for task/goal/project data before API submission
- **cli.ts** — CLI runner for direct execution
- **Skills** — Claude Code skill definitions installed to `.claude/skills/asana/`

## Skills
| Skill | Triggers on | Purpose |
|-------|------------|---------|
| `asana-task-manager` | "create a task", "assign", "mark done", "list tasks" | CRUD on tasks, subtasks, comments |
| `asana-goal-manager` | "create a goal", "OKR", "goal progress", "status update" | Goals, sub-goals, metrics, status |
| `asana-project-manager` | "create a project", "add sections", "set up board" | Projects, sections, templates |
| `asana-explorer` | "who's in Asana", "show workspace", "list users" | Workspace discovery |

## How it works

```
You type naturally → Claude matches skill trigger → Skill runs CLI command → CLI calls Asana REST API → Result reported back
```

No MCP server, no ports, no background processes. Just markdown skills + a TypeScript API client.

## API Key Location
The API key is read from (in order):
1. `ASANA_API_KEY` environment variable
2. `.asana-api-key` file in project root
3. `~/.asana-api-key` in home directory

## Quick reference
- All dates: YYYY-MM-DD format
- Assignees: email addresses or user GIDs (run `setup` to find yours)
- Rate limit: ~1500 req/min (batch operations have built-in delays)
- Task URLs: `https://app.asana.com/0/0/{task_gid}`
- Project URLs: `https://app.asana.com/0/{project_gid}`
- Goal URLs: `https://app.asana.com/0/goals/{goal_gid}`

## After setup: discover your GIDs

Run `npx ts-node cli.ts setup` to find your:
- Workspace GID → set as `ASANA_WORKSPACE_GID` env var
- User GID → use as default assignee in skills
- Team GID → required for creating projects in organization workspaces
- Project GIDs → use when creating tasks

Then update the skill SKILL.md files with your actual GIDs.

---

# Wiki — Knowledge Base

This project includes a [Karpathy-style LLM knowledge base](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) for persistent, compounding knowledge about the connection.

## Structure

```
raw/          # Immutable source documents (session transcripts, references)
wiki/         # LLM-generated and maintained knowledge layer
├── index.md  # Master catalog of all pages
├── log.md    # Append-only timeline of all changes
├── hot.md    # Hot cache (~500 words of most recent/important context)
├── concepts/ # Technical concept pages (architecture, API, skills, etc.)
├── entities/ # Organization/tool pages (credential vaults, related connections)
├── guides/   # How-to guides (installation, troubleshooting)
└── sources/  # Summary pages for each ingested source
```

## Wiki Workflows

### Workflow 1: INGEST (Processing New Sources)
1. Drop source material into `raw/`
2. Read source thoroughly
3. Create a source summary in `wiki/sources/`
4. Create or update concept/entity pages with new knowledge
5. Add cross-references (`[[backlinks]]`) between related pages
6. Update `wiki/index.md` with new entries
7. Append entry to `wiki/log.md` with timestamp
8. Update `wiki/hot.md` if the new info changes current state

### Workflow 2: QUERY (Searching & Answering)
1. Read `wiki/hot.md` first (might have the answer)
2. Search `wiki/index.md` for relevant pages
3. Read target pages and follow cross-references
4. Synthesize answer with citations to wiki pages

### Workflow 3: LINT (Health Checking)
1. Find contradictions between pages
2. Spot stale facts superseded by newer sources
3. Locate orphan pages with zero inbound links
4. Flag missing cross-references
5. Identify research gaps
6. Append findings to `wiki/log.md`

## Page Conventions

All wiki pages use YAML frontmatter:
```yaml
---
title: Page Title
type: concept|entity|source|guide
sources: [list of source page names]
related: [list of related pages]
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: high|medium|low
---
```
