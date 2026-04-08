---
title: Asana Connection — Installation Guide
type: guide
sources: [initial-setup-session]
related: [architecture, authentication, skills-system, cli-reference]
created: 2026-04-08
updated: 2026-04-08
confidence: high
---

# Asana Connection — Installation Guide

How to set up the Asana-Claude connection from scratch.

## Prerequisites

- Node.js (v18+) installed
- Claude Code CLI
- An Asana account with API access

## Step 1: Clone and install

```bash
git clone https://github.com/SorinaW/claude-asana-connection.git
cd claude-asana-connection
npm install
```

## Step 2: Get an Asana Personal Access Token

1. Go to https://app.asana.com/0/my-apps
2. Developer Console → Personal Access Tokens → Create New Token
3. Give it a name (e.g., "Claude Code") and copy the token

## Step 3: Store the token

Create a `.asana-api-key` file in the project root:

```bash
echo "YOUR_TOKEN_HERE" > .asana-api-key
```

Or set it as an environment variable:
```bash
export ASANA_API_KEY="YOUR_TOKEN_HERE"
```

The file is gitignored — it will never be committed.

## Step 4: Verify connection and discover GIDs

```bash
npx ts-node cli.ts setup
```

This will show:
- Your name and email
- Your user GID
- Your workspace GID(s)
- Your teams
- Your projects

**Save these GIDs** — you'll need them for the skills.

## Step 5: Set your default workspace

```bash
export ASANA_WORKSPACE_GID=your_workspace_gid_here
```

## Step 6: Install skills globally

Copy the skill folders to your Claude Code skills directory:

```bash
# The skills directory location depends on your OS/setup
cp -r skills/asana ~/.claude/skills/
```

Then update each SKILL.md with your actual GIDs:
- Replace `YOUR_WORKSPACE_GID` with your workspace GID
- Replace `YOUR_USER_GID` with your user GID
- Replace `YOUR_TEAM_GID` with your team GID
- Replace `YOUR_PROJECT_GID` with your default project GID

## Step 7: Test it

Just talk to Claude naturally:
- "Create a task in Asana called Review pipeline, due Friday"
- "List my Asana goals"
- "Show my projects"

The [[skills-system]] activates automatically based on trigger words.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| No output from inline ts-node | Use `cli.ts` commands instead (Windows compatibility) |
| "API key not found" | Check `.asana-api-key` exists or `ASANA_API_KEY` env var is set |
| "Workspace GID required" | Set `ASANA_WORKSPACE_GID` env var |
| Rate limiting (429) | Asana allows ~1500 req/min; batch operations have built-in delays |
