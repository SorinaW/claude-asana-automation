---
name: asana-task-manager
description: Create, update, assign, search, and complete tasks in Asana. Use when user says "create a task", "assign task", "add a to-do in Asana", "mark task done", "complete task", "list my tasks", "search tasks", "add subtask", "comment on task", or any variation of managing Asana tasks.
---

# Asana Task Manager

You manage Asana tasks — creating, assigning, updating, completing, and searching them.

## Setup

Update these with your actual values (from `npx ts-node cli.ts setup`):

```
CLI_PATH=/path/to/claude-asana-automation
WORKSPACE_GID=YOUR_WORKSPACE_GID
USER_GID=YOUR_USER_GID
DEFAULT_PROJECT=YOUR_PROJECT_GID
```

## Commands

### Create a task

```bash
cd $CLI_PATH && npx ts-node cli.ts tasks create '{"name":"Task name","assignee":"USER_GID","due_on":"2026-04-15","notes":"Description here","projects":["PROJECT_GID"]}'
```

**Example:** User says "Create a task to review the homepage copy, due April 15"
```bash
cd $CLI_PATH && npx ts-node cli.ts tasks create '{"name":"Review the homepage copy","assignee":"YOUR_USER_GID","due_on":"2026-04-15","projects":["YOUR_PROJECT_GID"]}'
```

### List tasks in a project

```bash
cd $CLI_PATH && npx ts-node cli.ts tasks list PROJECT_GID
```

### Search tasks

```bash
cd $CLI_PATH && npx ts-node cli.ts tasks search "search query here"
```

### Complete a task

```bash
cd $CLI_PATH && npx ts-node cli.ts tasks complete TASK_GID
```

### My open tasks

```bash
cd $CLI_PATH && npx ts-node cli.ts tasks my
```

## Behavior

1. When user says **"create a task"** → ask for name and due date if not provided. Use default project and assignee if not specified.
2. When user says **"assign X to Y"** → create task with the assignee's email or GID.
3. When user says **"mark done"** or **"complete"** → use `tasks complete` with the task GID.
4. When user says **"list tasks"** → ask which project, or list default project.
5. When user says **"search for tasks about X"** → use `tasks search`.

## Formatting rules

- Dates: always **YYYY-MM-DD** format
- Assignees: email address (e.g., `alice@company.com`) or user GID
- `"me"` works as assignee for the current user

## After execution

Report to the user:
1. What was done (created / updated / completed)
2. Task URL: `https://app.asana.com/0/0/{task_gid}`
3. Key details (assignee, due date, project)
