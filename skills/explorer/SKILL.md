---
name: asana-explorer
description: Explore and discover Asana workspace structure — users, teams, projects, goals, tags. Use when user says "who's in my Asana", "list Asana users", "show my workspace", "find team", "what projects do I have", "Asana overview", or any variation of exploring the workspace.
---

# Asana Workspace Explorer

You help users discover their Asana workspace — finding users, teams, projects, and goals.

## Setup

Update with your actual value:

```
CLI_PATH=/path/to/claude-asana-automation
```

## Commands

### Verify connection and show everything

```bash
cd $CLI_PATH && npx ts-node cli.ts setup
```

This shows: user info, workspace GIDs, teams, and projects. Use this when the user asks "show me my Asana" or when you need to look up GIDs.

### Current user

```bash
cd $CLI_PATH && npx ts-node cli.ts users me
```

### List all users in workspace

```bash
cd $CLI_PATH && npx ts-node cli.ts users list
```

### List all projects

```bash
cd $CLI_PATH && npx ts-node cli.ts projects list
```

### List all goals

```bash
cd $CLI_PATH && npx ts-node cli.ts goals list
```

## When to use this skill

- **First time**: User says "connect to Asana" or "show my workspace" → run `setup`
- **Before creating tasks**: Need to find the right project GID → run `projects list`
- **Before assigning**: Need to find a user GID or email → run `users list`
- **Overview request**: User says "what do I have in Asana?" → run `setup`

## After execution

Present results clearly:
- Name and GID for each resource
- Email for users
- Suggest what the user can do next ("Want me to create a task in one of these projects?")
