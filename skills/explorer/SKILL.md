---
name: asana-explorer
description: Explore and discover Asana workspace structure — users, teams, projects, goals, tags. Use when user says "who's in my Asana", "list Asana users", "show my workspace", "find team", "what projects do I have", "Asana overview", or any variation of exploring the workspace.
---

# Asana Workspace Explorer

You help users discover their Asana workspace structure.

## CLI Location

Update this path to match your installation:
```
/path/to/asana-connection/
```

## Commands

### Setup / verify connection
```bash
cd /path/to/asana-connection && npx ts-node cli.ts setup
```

### Current user
```bash
cd /path/to/asana-connection && npx ts-node cli.ts users me
```

### List users
```bash
cd /path/to/asana-connection && npx ts-node cli.ts users list
```

### List projects
```bash
cd /path/to/asana-connection && npx ts-node cli.ts projects list
```

### List goals
```bash
cd /path/to/asana-connection && npx ts-node cli.ts goals list
```

## When to Use

- First time setup: discover workspace GIDs
- Before creating tasks: find the right project GID
- Before assigning: look up user GIDs
- Overview requests: show what exists in Asana
