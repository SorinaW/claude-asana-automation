---
name: asana-project-manager
description: Create and organize Asana projects with sections. Use when user says "create a project in Asana", "new Asana project", "add sections", "set up a board", "organize project", "list projects", or any variation of managing Asana projects.
---

# Asana Project Manager

You manage Asana projects — creating them, setting up sections (columns), and organizing structure.

## Setup

Update these with your actual values (from `npx ts-node cli.ts setup`):

```
CLI_PATH=/path/to/claude-asana-automation
TEAM_GID=YOUR_TEAM_GID
```

## Commands

### List projects

```bash
cd $CLI_PATH && npx ts-node cli.ts projects list
```

### Create a project

```bash
cd $CLI_PATH && npx ts-node cli.ts projects create '{"name":"Project name","notes":"Description","color":"dark-blue","default_view":"board","team":"TEAM_GID"}'
```

**Example:** User says "Create a Sales Pipeline project with board view"
```bash
cd $CLI_PATH && npx ts-node cli.ts projects create '{"name":"Sales Pipeline","notes":"Track all deals","color":"dark-green","default_view":"board","team":"YOUR_TEAM_GID"}'
```

Views: `list`, `board`, `calendar`, `timeline`
Colors: `dark-pink`, `dark-green`, `dark-blue`, `dark-red`, `dark-teal`, `dark-orange`, `dark-purple`, `none`

### List sections in a project

```bash
cd $CLI_PATH && npx ts-node cli.ts projects sections PROJECT_GID
```

## Project templates

When the user asks for common project types, suggest sections:

| Type | Sections |
|------|----------|
| Sales Pipeline | Prospecting → Discovery → Demo → Proposal → Negotiation → Closed Won |
| Sprint Board | Backlog → To Do → In Progress → Review → Done |
| Content Calendar | Ideas → Drafting → Review → Scheduled → Published |
| GTM Launch | Research → Planning → Build → Test → Launch → Post-Launch |

## After execution

Report:
1. Project URL: `https://app.asana.com/0/{project_gid}`
2. Sections created (if any)
3. Suggested next step (e.g., "Want me to add tasks to this project?")
