---
title: Asana Client (API)
type: concept
sources: [initial-setup-session]
related: [architecture, authentication, cli-reference, asana-api]
created: 2026-04-08
updated: 2026-04-08
confidence: high
---

# Asana Client (API)

The TypeScript REST client at `shared/asana-client.ts`.

## Design

- **Zero runtime dependencies** — uses Node.js built-in `https` module
- **Bearer token auth** — reads from [[authentication]] chain
- **Configurable workspace** — set via `ASANA_WORKSPACE_GID` env var
- **All methods async** — return `Promise<{ status: number, data: any }>`

## Methods by category

### Workspaces
- `listWorkspaces()`

### Projects
- `listProjects(workspaceGid?)` / `getProject(gid)` / `createProject({...})`

### Tasks
- `createTask({...})` / `getTask(gid)` / `updateTask(gid, {...})` / `deleteTask(gid)`
- `listTasksForProject(gid)` / `searchTasks(workspaceGid, {...})`
- `addTaskToProject(taskGid, projectGid)` / `completeTask(gid)`
- `batchCreateTasks([...])` / `getMyTasks()`

### Subtasks
- `createSubtask(parentGid, {...})` / `listSubtasks(gid)`

### Sections
- `listSections(projectGid)` / `createSection(projectGid, name)` / `addTaskToSection(sectionGid, taskGid)`

### Goals
- `listGoals({...})` / `getGoal(gid)` / `createGoal({...})` / `updateGoal(gid, {...})`
- `addGoalSubgoal(parentGid, subgoalGid)` / `addGoalSupportingWork(goalGid, projectGid)`
- `updateGoalMetric(gid, {...})` — set progress (current/target/unit)

### Status Updates
- `createStatusUpdate({...})` / `listStatusUpdates(parentGid, subtype)`

### Users / Teams / Tags / Portfolios
- `getMe()` / `listUsers(wsGid?)` / `getUser(gid)`
- `listTeams(orgGid?)` / `createTag({...})` / `listTags(wsGid?)`
- `listPortfolios(wsGid?, owner?)`

### Comments & Attachments
- `addComment(taskGid, text)` / `listStories(taskGid)` / `listAttachments(taskGid)`

### Custom Fields
- `listCustomFieldsForProject(projectGid)`

## Rate limiting

Asana allows ~1500 requests/minute. `batchCreateTasks` includes 100ms delays.
