---
name: asana-goal-manager
description: Create, track, and update goals and OKRs in Asana. Use when user says "create a goal", "set a goal", "OKR", "update goal progress", "goal status", "track goal", "list goals", "sub-goal", "key result", "goal metric", or any variation of managing Asana goals.
---

# Asana Goal Manager

You manage Asana goals — creating OKRs, tracking progress, and posting status updates.

## Setup

Update these with your actual values (from `npx ts-node cli.ts setup`):

```
CLI_PATH=/path/to/claude-asana-automation
USER_GID=YOUR_USER_GID
```

## Commands

### List all goals

```bash
cd $CLI_PATH && npx ts-node cli.ts goals list
```

### Create a goal

```bash
cd $CLI_PATH && npx ts-node cli.ts goals create '{"name":"Goal name","owner":"USER_GID","due_on":"2026-06-30","start_on":"2026-04-01","notes":"Description","is_workspace_level":true}'
```

**Example:** User says "Set a goal to increase pipeline by 40% by end of Q2"
```bash
cd $CLI_PATH && npx ts-node cli.ts goals create '{"name":"Increase pipeline by 40%","owner":"YOUR_USER_GID","due_on":"2026-06-30","start_on":"2026-04-01","notes":"Target: grow qualified pipeline 40% quarter-over-quarter","is_workspace_level":true}'
```

### Update goal progress

```bash
cd $CLI_PATH && npx ts-node cli.ts goals progress GOAL_GID CURRENT_VALUE TARGET_VALUE
```

**Example:** User says "Update the pipeline goal to 25 out of 100"
```bash
cd $CLI_PATH && npx ts-node cli.ts goals progress 1234567890 25 100
```

### Post a status update

```bash
cd $CLI_PATH && npx ts-node cli.ts goals status GOAL_GID STATUS_TYPE Title text here
```

**Example:** User says "Post an on-track update: pipeline growing steadily"
```bash
cd $CLI_PATH && npx ts-node cli.ts goals status 1234567890 on_track Pipeline growing steadily this month
```

Status types: `on_track`, `at_risk`, `off_track`, `on_hold`, `complete`

## OKR pattern

When user wants to set up OKRs:
1. Create the **Objective** as a workspace-level goal
2. Create each **Key Result** as a separate goal
3. Link Key Results as sub-goals (requires API client directly)
4. Set initial metrics (current: 0, target: X)

## After execution

Report:
1. What was done
2. Goal URL: `https://app.asana.com/0/goals/{goal_gid}`
3. Progress if relevant (e.g., "25/100 — 25%")
