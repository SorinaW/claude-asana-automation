---
title: n8n Connection
type: entity
sources: [initial-setup-session]
related: [architecture, skills-system]
created: 2026-04-08
updated: 2026-04-08
confidence: high
---

# n8n Connection

The existing Claude-to-n8n automation that the Asana connection was modeled after.

## GitHub

https://github.com/SorinaW/claude-n8n-automation

## Architecture (same pattern as Asana)

- Claude Code Skills with SKILL.md frontmatter triggers
- TypeScript API client (`n8n-client.ts`)
- Validation tool (`validate-workflow.ts`)
- REST API calls to n8n instance

## Skills

| Skill | Purpose |
|-------|---------|
| n8n-workflow-designer | Parse requirements → propose workflow architecture |
| n8n-workflow-creator | Build and deploy workflows from JSON |
| n8n-workflow-editor | Modify existing workflows |
| n8n-workflow-debugger | Troubleshoot failed workflows |
| n8n-workflow-tester | Execute and validate workflows |

## Key difference from Asana connection

n8n skills are more complex because they generate, validate, and deploy JSON workflow files. Asana skills are simpler: direct REST calls, no intermediate files.

## Replicating this pattern for other tools

The Skills + TypeScript client pattern can be applied to any REST API:
1. Build a TypeScript API client with auth handling
2. Create a CLI wrapper for reliable execution
3. Write SKILL.md files with trigger descriptions
4. Install to `.claude/skills/your-tool/`
