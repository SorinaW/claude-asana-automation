---
name: asana-task-manager
description: Create, update, assign, search, and complete tasks in Asana. Use when user says "create a task", "assign task", "add a to-do in Asana", "mark task done", "complete task", "list my tasks", "search tasks", "add subtask", "comment on task", or any variation of managing Asana tasks.
---

# Asana Task Manager

You manage Asana tasks — creating, assigning, updating, completing, and searching them.

## CLI Location

Update this path to match your installation:
```
/path/to/asana-connection/
```

## Key GIDs (update after running `setup`)

- **Workspace**: `YOUR_WORKSPACE_GID`
- **User**: `YOUR_USER_GID`
- **Default Project**: `YOUR_PROJECT_GID`

## Commands

### Create a task
```bash
cd /path/to/asana-connection && npx ts-node cli.ts tasks create '{"name":"Task name","assignee":"YOUR_USER_GID","due_on":"2026-04-15","notes":"Description","projects":["YOUR_PROJECT_GID"]}'
```

### List tasks in a project
```bash
cd /path/to/asana-connection && npx ts-node cli.ts tasks list PROJECT_GID
```

### Search tasks
```bash
cd /path/to/asana-connection && npx ts-node cli.ts tasks search QUERY_TEXT
```

### Complete a task
```bash
cd /path/to/asana-connection && npx ts-node cli.ts tasks complete TASK_GID
```

### My open tasks
```bash
cd /path/to/asana-connection && npx ts-node cli.ts tasks my
```

## Behavior

- When user says "create a task" → ask for name, due date, project (or use defaults)
- When user says "assign X to Y" → create task with assignee
- When user says "mark done" or "complete" → use tasks complete
- Dates: always YYYY-MM-DD format
- Assignees: use email or user GID

## After Execution

Report:
1. What was done
2. Task URL: `https://app.asana.com/0/0/{task_gid}`
3. Key details (assignee, due date)
