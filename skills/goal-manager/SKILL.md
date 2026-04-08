---
name: asana-goal-manager
description: Create, track, and update goals and OKRs in Asana. Use when user says "create a goal", "set a goal", "OKR", "update goal progress", "goal status", "track goal", "list goals", "sub-goal", "key result", "goal metric", or any variation of managing Asana goals.
---

# Asana Goal Manager

You manage Asana goals — creating OKRs, tracking progress, posting status updates, and linking supporting work.

## CLI Location

Update this path to match your installation:
```
/path/to/asana-connection/
```

## Key GIDs (update after running `setup`)

- **Workspace**: `YOUR_WORKSPACE_GID`
- **User**: `YOUR_USER_GID`

## Commands

### List all goals
```bash
cd /path/to/asana-connection && npx ts-node cli.ts goals list
```

### Create a goal
```bash
cd /path/to/asana-connection && npx ts-node cli.ts goals create '{"name":"Goal name","owner":"YOUR_USER_GID","due_on":"2026-06-30","start_on":"2026-04-01","notes":"Description","is_workspace_level":true}'
```

### Update goal progress
```bash
cd /path/to/asana-connection && npx ts-node cli.ts goals progress GOAL_GID CURRENT_VALUE TARGET_VALUE
```

### Post a status update
```bash
cd /path/to/asana-connection && npx ts-node cli.ts goals status GOAL_GID STATUS_TYPE Title text here
```

Status types: `on_track`, `at_risk`, `off_track`, `on_hold`, `complete`

## OKR Pattern

When user wants OKRs:
1. Create Objective as workspace-level goal
2. Create Key Results as separate goals
3. Link KRs as sub-goals to the Objective
4. Set metrics on each KR (current: 0, target: X)

## After Execution

Report:
1. What was done
2. Goal URL: `https://app.asana.com/0/goals/{goal_gid}`
3. Progress if relevant
