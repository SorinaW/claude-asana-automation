---
title: Workspace Configuration
type: entity
sources: [initial-setup-session]
related: [asana-client, authentication, installation-guide]
created: 2026-04-08
updated: 2026-04-08
confidence: high
---

# Workspace Configuration

How to discover and configure your Asana workspace for the connection.

## Discovering your GIDs

Run the setup command to discover all your workspace details:

```bash
npx ts-node cli.ts setup
```

This returns:
- **User**: Your name, email, and user GID
- **Workspace(s)**: Name and GID for each workspace
- **Teams**: Name and GID for each team
- **Projects**: Name and GID for existing projects

## Required configuration

| Setting | How to set | Used for |
|---------|-----------|----------|
| Workspace GID | `ASANA_WORKSPACE_GID` env var | Default workspace for all operations |
| API Token | `.asana-api-key` file or `ASANA_API_KEY` env var | Authentication |

## Optional: Customize skill defaults

After discovering your GIDs, update the SKILL.md files to include your defaults:
- Default assignee (your user GID or email)
- Default project (your most-used project GID)
- Default team (required for org workspaces when creating projects)

## Example `.env` file

```bash
ASANA_API_KEY=your_token_here
ASANA_WORKSPACE_GID=your_workspace_gid
```

## Notes

- Personal workspaces have one workspace and one team
- Organization workspaces may have multiple teams
- Team GID is required when creating projects in organization workspaces
- The `setup` command is idempotent — run it anytime to refresh your GID list
