---
title: Architecture
type: concept
sources: [initial-setup-session]
related: [asana-client, skills-system, cli-reference, n8n-connection, authentication]
created: 2026-04-08
updated: 2026-04-08
confidence: high
---

# Architecture

How the Asana-Claude connection is structured and why.

## Pattern: Claude Code Skills Framework

The connection uses the same pattern as the [[n8n-connection]]: Claude Code's native skills system with TypeScript API clients. NOT an MCP server, NOT a standalone CLI tool.

```
User speaks naturally
    ↓
Claude matches trigger words in SKILL.md frontmatter
    ↓
Skill activates → reads shared tools (asana-client.ts)
    ↓
Claude runs CLI command via Bash tool
    ↓
cli.ts calls asana-client.ts functions
    ↓
asana-client.ts makes REST calls to app.asana.com/api/1.0
    ↓
Claude reports result to user
```

## Why this pattern (not MCP)

- **Simplicity**: No server to run, no ports to open, no process to keep alive
- **Consistency**: Matches existing n8n connection pattern
- **Portability**: Works anywhere Claude Code runs (VS Code, terminal, web)
- **Zero runtime dependencies**: Only Node.js built-in `https` module for API calls

## Components

| Component | Location | Purpose |
|-----------|----------|---------|
| [[asana-client]] | `shared/asana-client.ts` | REST API client (50+ methods) |
| [[validation]] | `shared/validate-task.ts` | Pre-submission validation |
| [[cli-reference]] | `cli.ts` | CLI entry point for all operations |
| [[skills-system]] | `.claude/skills/asana/` | Skill definitions with triggers |
| [[authentication]] | `.asana-api-key` | Token storage (gitignored) |

## Design decisions

1. **TypeScript over Python**: Matches n8n connection language; ts-node available everywhere
2. **CLI wrapper over direct imports**: Inline `ts-node -e` had issues on Windows; CLI is reliable
3. **Environment-based workspace GID**: Set via `ASANA_WORKSPACE_GID` env var — no hardcoded values
4. **Credential chain**: Env var → local file → vault — flexible for different setups
