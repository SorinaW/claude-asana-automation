# Hot Cache

Last updated: 2026-04-08

## Current state

Asana connection is fully operational. Four skills installed globally in `.claude/skills/asana/`. API token stored securely (gitignored `.asana-api-key` file). Run `npx ts-node cli.ts setup` to verify connection and discover workspace GIDs.

## Architecture

Claude Code Skills pattern (same as n8n connection): SKILL.md frontmatter triggers → CLI commands → TypeScript REST client → Asana API. Zero runtime dependencies.

## Open items

- Skills should be customized with your workspace/user/team GIDs after running `setup`
- Wiki pages can be expanded as new features are added
- Run lint workflow periodically to keep wiki healthy
