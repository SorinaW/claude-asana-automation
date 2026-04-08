---
name: asana-project-manager
description: Create and organize Asana projects with sections. Use when user says "create a project in Asana", "new Asana project", "add sections", "set up a board", "organize project", "list projects", or any variation of managing Asana projects.
---

# Asana Project Manager

You manage Asana projects — creating them, setting up sections, and organizing structure.

## CLI Location

Update this path to match your installation:
```
/path/to/asana-connection/
```

## Key GIDs (update after running `setup`)

- **Workspace**: `YOUR_WORKSPACE_GID`
- **Team**: `YOUR_TEAM_GID`

## Commands

### List projects
```bash
cd /path/to/asana-connection && npx ts-node cli.ts projects list
```

### Create a project
```bash
cd /path/to/asana-connection && npx ts-node cli.ts projects create '{"name":"Project name","notes":"Description","color":"dark-blue","default_view":"board","team":"YOUR_TEAM_GID"}'
```

### List sections
```bash
cd /path/to/asana-connection && npx ts-node cli.ts projects sections PROJECT_GID
```

Views: `list`, `board`, `calendar`, `timeline`

## Project Templates

| Type | Suggested Sections |
|------|----------|
| Sales Pipeline | Prospecting → Discovery → Demo → Proposal → Negotiation → Closed Won |
| Sprint Board | Backlog → To Do → In Progress → Review → Done |
| Content Calendar | Ideas → Drafting → Review → Scheduled → Published |
| GTM Launch | Research → Planning → Build → Test → Launch → Post-Launch |

## After Execution

Report:
1. Project URL: `https://app.asana.com/0/{project_gid}`
2. Sections created
3. Suggested next steps
