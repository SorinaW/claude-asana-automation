# Initial Asana Connection Setup Session

**Date:** 2026-04-08
**Type:** Implementation session

## What happened

Built an Asana connection for Claude Code, modeled after the existing [claude-n8n-automation](https://github.com/SorinaW/claude-n8n-automation) project. The goal: control Asana (tasks, goals, projects) by typing natural language in Claude Code.

## Research phase

1. Explored the n8n connection repo — uses Claude Code Skills framework with TypeScript API clients
2. Decided to replicate the same pattern for Asana
3. Researched the Asana REST API (app.asana.com/api/1.0)

## Architecture decisions

- **Pattern:** Claude Code Skills (same as n8n connection)
- **Language:** TypeScript with ts-node
- **Auth:** Personal Access Token via `.asana-api-key` file (gitignored)
- **API approach:** Direct REST calls using Node.js built-in `https` module (zero runtime dependencies)

## What was built

1. **API Client** (`shared/asana-client.ts`) — 50+ methods: tasks, goals, projects, sections, users, teams, tags, portfolios, comments, attachments
2. **Validation** (`shared/validate-task.ts`) — pre-submission checks for tasks, goals, projects
3. **CLI Runner** (`cli.ts`) — commands for setup, tasks, goals, projects, users
4. **4 Claude Code Skills** — task-manager, goal-manager, project-manager, explorer
5. **Karpathy-style Wiki** — knowledge base documenting the connection

## Issue encountered

- Inline `ts-node -e "import {...}"` produced no output on Windows
- Fixed by routing all operations through `cli.ts`
- Skills updated to use CLI commands

## Verification

- `setup` command connected successfully
- Test task created and completed
- Projects, goals, and users listed correctly
