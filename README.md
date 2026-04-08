# Claude Code × Asana Connection

Control Asana by typing natural language in Claude Code. Create tasks, assign goals, manage projects — just by talking.

Built using the same [Claude Code Skills](https://docs.anthropic.com/en/docs/claude-code) pattern as [claude-n8n-automation](https://github.com/SorinaW/claude-n8n-automation). Knowledge base follows [Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) pattern.

## What you can do

Just talk to Claude naturally:

| You say | What happens |
|---------|-------------|
| "Create a task to review the pipeline, due Friday" | Task created in Asana with assignee and due date |
| "Set a goal: increase pipeline by 40% by Q3" | Goal created with owner and timeline |
| "List my open tasks" | Shows your tasks from Asana |
| "Create a Sales Pipeline project with board view" | Project created with sections |
| "Mark that task done" | Task completed |
| "Update progress on the pipeline goal to 25/100" | Goal metric updated |
| "Who's in my workspace?" | Lists users, teams, projects |

## How it works

```
You type naturally
  → Claude matches trigger words in SKILL.md
    → Skill runs CLI command
      → CLI calls Asana REST API
        → Result reported back to you
```

No MCP server. No background processes. No vector databases. Just markdown skill files + a TypeScript API client.

## Setup (5 minutes)

### 1. Clone and install

```bash
git clone https://github.com/SorinaW/claude-asana-connection.git
cd claude-asana-connection
npm install
```

### 2. Get your Asana API token

1. Go to https://app.asana.com/0/my-apps
2. Developer Console → Personal Access Tokens → **Create New Token**
3. Copy the token

### 3. Save the token

```bash
echo "YOUR_TOKEN_HERE" > .asana-api-key
```

This file is gitignored — it will never be committed.

### 4. Verify connection

```bash
npx ts-node cli.ts setup
```

You'll see your name, workspace GID, teams, and projects. **Save these GIDs.**

### 5. Set your default workspace

```bash
export ASANA_WORKSPACE_GID=your_workspace_gid_from_setup
```

### 6. Install skills to Claude Code

Copy the skills to your Claude Code skills directory:

```bash
cp -r skills/task-manager ~/.claude/skills/asana/task-manager
cp -r skills/goal-manager ~/.claude/skills/asana/goal-manager
cp -r skills/project-manager ~/.claude/skills/asana/project-manager
cp -r skills/explorer ~/.claude/skills/asana/explorer
```

Then open each `SKILL.md` and replace:
- `YOUR_WORKSPACE_GID` → your workspace GID
- `YOUR_USER_GID` → your user GID
- `YOUR_TEAM_GID` → your team GID
- `YOUR_PROJECT_GID` → your default project GID
- `/path/to/asana-connection` → your actual install path

### 7. Done!

Open Claude Code and just start talking about Asana tasks.

## Project structure

```
claude-asana-connection/
├── shared/
│   ├── asana-client.ts       # Asana REST API client (50+ methods, zero deps)
│   └── validate-task.ts      # Pre-submission validation
├── skills/                    # Claude Code skill templates
│   ├── task-manager/SKILL.md  # Create, assign, search, complete tasks
│   ├── goal-manager/SKILL.md  # Goals, OKRs, progress, status updates
│   ├── project-manager/SKILL.md # Projects, sections, board setup
│   └── explorer/SKILL.md     # Workspace discovery
├── raw/                       # Source documents (Karpathy wiki pattern)
├── wiki/                      # LLM-maintained knowledge base
│   ├── index.md               # Master catalog
│   ├── log.md                 # Change timeline
│   ├── hot.md                 # Quick context cache
│   ├── concepts/              # Technical concepts
│   ├── entities/              # Tools and integrations
│   ├── guides/                # How-to guides
│   └── sources/               # Source summaries
├── cli.ts                     # CLI runner
├── CLAUDE.md                  # Project config + wiki workflows
├── package.json
└── tsconfig.json
```

## The Karpathy Wiki

This project includes a knowledge base following [Andrej Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f):

- **`raw/`** — Immutable source documents (you drop files here)
- **`wiki/`** — LLM-generated knowledge pages with cross-references
- **Three workflows**: INGEST (add knowledge), QUERY (search), LINT (health check)

The wiki compounds over time. Every session adds knowledge. Future Claude sessions can query the wiki to understand how the connection works without re-reading all the code.

## CLI Reference

```bash
# Setup
npx ts-node cli.ts setup

# Tasks
npx ts-node cli.ts tasks create '{"name":"Review pipeline","due_on":"2026-04-15"}'
npx ts-node cli.ts tasks list PROJECT_GID
npx ts-node cli.ts tasks complete TASK_GID
npx ts-node cli.ts tasks search "pipeline"
npx ts-node cli.ts tasks my

# Goals
npx ts-node cli.ts goals list
npx ts-node cli.ts goals create '{"name":"Grow pipeline 40%","due_on":"2026-06-30"}'
npx ts-node cli.ts goals progress GOAL_GID 25 100
npx ts-node cli.ts goals status GOAL_GID on_track "Weekly update"

# Projects
npx ts-node cli.ts projects list
npx ts-node cli.ts projects create '{"name":"Q2 Pipeline","default_view":"board"}'
npx ts-node cli.ts projects sections PROJECT_GID

# Users
npx ts-node cli.ts users me
npx ts-node cli.ts users list
```

## API Coverage

The client covers 50+ Asana API methods:

| Category | Methods |
|----------|---------|
| Tasks | create, get, update, delete, list, search, complete, batch create |
| Subtasks | create, list |
| Goals | create, get, update, list, sub-goals, supporting work, metrics |
| Projects | create, get, list |
| Sections | create, list, add task to section |
| Status Updates | create, list |
| Users | me, get, list |
| Teams | list |
| Tags | create, list |
| Portfolios | list |
| Comments | add, list stories |
| Attachments | list |
| Custom Fields | list for project |

## Extending to other tools

This pattern works for any REST API:

1. **Build a TypeScript client** with auth handling (`shared/your-client.ts`)
2. **Create a CLI wrapper** for reliable cross-platform execution (`cli.ts`)
3. **Write SKILL.md files** with trigger descriptions for Claude Code
4. **Install to `.claude/skills/`** — Claude activates them automatically

See [claude-n8n-automation](https://github.com/SorinaW/claude-n8n-automation) for another implementation of this pattern.

## License

MIT — Sorina Weber
