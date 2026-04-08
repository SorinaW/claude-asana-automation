---
title: Asana REST API
type: concept
sources: [2026-04-08-initial-setup-session]
related: [asana-client, authentication, architecture]
created: 2026-04-08
updated: 2026-04-08
confidence: high
---

# Asana REST API

Key details about the Asana API that the [[asana-client]] talks to.

## Base URL

```
https://app.asana.com/api/1.0
```

## Authentication

```
Authorization: Bearer {personal_access_token}
Content-Type: application/json
```

## Request format

All create/update requests wrap data in a `data` envelope:

```json
{
  "data": {
    "name": "Task name",
    "assignee": "user_gid"
  }
}
```

## Response format

Responses also use a `data` envelope:

```json
{
  "data": {
    "gid": "1234567890",
    "name": "Task name",
    ...
  }
}
```

List responses:
```json
{
  "data": [
    { "gid": "...", "name": "..." },
    ...
  ]
}
```

## Key endpoints used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/users/me` | Current user info |
| GET | `/workspaces` | List workspaces |
| GET/POST | `/projects` | List/create projects |
| GET/POST | `/tasks` | List/create tasks |
| PUT | `/tasks/{gid}` | Update task |
| POST | `/tasks/{gid}/subtasks` | Create subtask |
| GET/POST | `/goals` | List/create goals |
| POST | `/goals/{gid}/setMetricCurrentValue` | Update goal progress |
| POST | `/status_updates` | Post status update |
| GET | `/workspaces/{gid}/tasks/search` | Search tasks |
| POST | `/sections/{gid}/addTask` | Move task to section |

## Opt_fields

The API supports `opt_fields` parameter to request specific fields, reducing response size:

```
?opt_fields=name,assignee,assignee.name,due_on,completed
```

## Rate limits

- ~1500 requests per minute
- 429 status code when exceeded
- Built-in delays in batch operations (100-150ms)

## URL construction

- Task: `https://app.asana.com/0/0/{task_gid}`
- Project: `https://app.asana.com/0/{project_gid}`
- Goal: `https://app.asana.com/0/goals/{goal_gid}`
