# Claude Code × Asana Automation

> Talk to Claude. It controls your Asana. No buttons, no UI — just type.

```
You: "Create a task to review the Q2 pipeline, due Friday, in my Sales project"
Claude: ✅ Task created — https://app.asana.com/0/0/1234567890

You: "Set a goal: close 5 enterprise deals by end of Q3"  
Claude: ✅ Goal created — https://app.asana.com/0/goals/9876543210

You: "Mark that task done"
Claude: ✅ Task completed.
```

This lets you control Asana entirely from [Claude Code](https://docs.anthropic.com/en/docs/claude-code) using natural language. Built with the same pattern as [claude-n8n-automation](https://github.com/SorinaW/claude-n8n-automation). Knowledge base follows [Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) method.

---

## Quick Start (5 minutes)

### Step 1: Clone and install

```bash
git clone https://github.com/SorinaW/claude-asana-automation.git
cd claude-asana-automation
npm install
```

### Step 2: Get your Asana API token

1. Open https://app.asana.com/0/my-apps
2. Click **Developer Console** → **Personal Access Tokens** → **Create New Token**
3. Name it `Claude Code`, copy the token

### Step 3: Save the token

```bash
echo "paste_your_token_here" > .asana-api-key
```

This file is gitignored — it never gets committed.

### Step 4: Test the connection

```bash
npx ts-node cli.ts setup
```

You should see something like:

```
Connected as: Your Name (your@email.com)
User GID: 12345678

Workspaces:
  - My Workspace (GID: 87654321)

Teams:
  - Engineering (GID: 11111111)

Projects:
  - Q2 Roadmap (GID: 22222222)
  - Bug Tracker (GID: 33333333)

Setup complete! Connection is working.
```

**Save these GIDs** — you need them in the next step.

### Step 5: Set your default workspace

```bash
export ASANA_WORKSPACE_GID=your_workspace_gid_from_above
```

### Step 6: Install the skills into Claude Code

Claude Code uses "skills" — markdown files that tell Claude what it can do. Copy them to your Claude Code config:

```bash
# Create the directory
mkdir -p ~/.claude/skills/asana

# Copy all skills
cp -r skills/* ~/.claude/skills/asana/
```

Then open each `SKILL.md` file and replace the placeholders with your GIDs:

| Placeholder | Replace with | Where to find it |
|------------|-------------|-----------------|
| `YOUR_WORKSPACE_GID` | Your workspace GID | From `setup` output |
| `YOUR_USER_GID` | Your user GID | From `setup` output |
| `YOUR_TEAM_GID` | Your team GID | From `setup` output |
| `YOUR_PROJECT_GID` | Your default project GID | From `setup` output |
| `/path/to/asana-connection` | Full path to this repo | Where you cloned it |

### Step 7: Test it!

Open Claude Code and type:

```
List my Asana projects
```

Claude should run the CLI and show your projects. If it works, you're done!

---

## What can I do with this?

### Tasks
| You say | What happens |
|---------|-------------|
| "Create a task called Review homepage copy, due April 15" | Creates task with due date |
| "Assign the API migration task to sarah@company.com" | Creates assigned task |
| "List tasks in my Roadmap project" | Shows all tasks with status |
| "Search for tasks about onboarding" | Searches by keyword |
| "Mark task 1234567 done" | Completes the task |
| "What are my open tasks?" | Lists your incomplete tasks |

### Goals & OKRs
| You say | What happens |
|---------|-------------|
| "Create a goal: increase revenue 30% by Q4" | Creates goal with timeline |
| "Update the revenue goal to 15 out of 30%" | Sets progress metric |
| "Post a status update: on track, pipeline growing" | Adds status to goal |
| "List my goals" | Shows all goals with progress |

### Projects
| You say | What happens |
|---------|-------------|
| "Create a project called Q3 Launch with board view" | Creates board project |
| "Add sections: To Do, In Progress, Done" | Adds columns |
| "List my projects" | Shows all projects |

### Workspace
| You say | What happens |
|---------|-------------|
| "Who's in my Asana workspace?" | Lists all users |
| "Show my teams" | Lists teams |
| "Run Asana setup" | Verifies connection |

---

## How it works

This project has three parts:

### 1. TypeScript API Client (`shared/asana-client.ts`)

A zero-dependency REST client that talks to the [Asana API](https://developers.asana.com/reference). Uses only Node.js built-in `https` — no npm packages needed for API calls. Covers 50+ methods across tasks, goals, projects, sections, users, teams, tags, and more.

### 2. CLI Runner (`cli.ts`)

A command-line wrapper around the API client. This is what Claude actually executes:

```bash
npx ts-node cli.ts tasks create '{"name":"Review pipeline","due_on":"2026-04-15"}'
npx ts-node cli.ts goals list
npx ts-node cli.ts projects create '{"name":"Q3 Launch","default_view":"board"}'
npx ts-node cli.ts users me
```

### 3. Claude Code Skills (`skills/`)

[Claude Code skills](https://docs.anthropic.com/en/docs/claude-code) are markdown files that tell Claude what it can do. Each skill has:
- **A trigger description** — Claude reads this to know when to activate (e.g., "when user says create a task")
- **CLI commands** — The exact commands Claude should run
- **Behavior rules** — How to handle defaults, ask for missing info, report results

When you say "create a task in Asana," Claude matches your words against the skill descriptions and follows the instructions.

```
You: "Create a task to fix the login bug, due tomorrow"
  ↓
Claude matches → asana-task-manager skill
  ↓
Skill says → run: npx ts-node cli.ts tasks create '{"name":"Fix login bug","due_on":"2026-04-09"}'
  ↓
CLI calls → Asana REST API
  ↓
Claude reports → "Task created: https://app.asana.com/0/0/1234567890"
```

---

## CLI Reference

```bash
# Connection
npx ts-node cli.ts setup                              # Verify connection, show GIDs

# Tasks
npx ts-node cli.ts tasks create '{"name":"...","assignee":"...","due_on":"YYYY-MM-DD","projects":["..."]}'
npx ts-node cli.ts tasks list <project_gid>            # List tasks in project
npx ts-node cli.ts tasks complete <task_gid>            # Mark done
npx ts-node cli.ts tasks search <query>                 # Search by text
npx ts-node cli.ts tasks my                             # Your open tasks

# Goals
npx ts-node cli.ts goals list                           # All goals
npx ts-node cli.ts goals create '{"name":"...","owner":"...","due_on":"YYYY-MM-DD"}'
npx ts-node cli.ts goals progress <gid> <current> <target>  # Update metric
npx ts-node cli.ts goals status <gid> on_track "Title"  # Post status

# Projects
npx ts-node cli.ts projects list                        # All projects
npx ts-node cli.ts projects create '{"name":"...","default_view":"board","team":"..."}'
npx ts-node cli.ts projects sections <project_gid>      # List sections

# Users
npx ts-node cli.ts users me                             # Current user
npx ts-node cli.ts users list                           # All workspace users
```

---

## Project structure

```
claude-asana-automation/
├── shared/
│   ├── asana-client.ts        # REST API client (50+ methods, zero runtime deps)
│   └── validate-task.ts       # Input validation
├── skills/                     # Claude Code skill templates (copy to ~/.claude/skills/asana/)
│   ├── task-manager/SKILL.md
│   ├── goal-manager/SKILL.md
│   ├── project-manager/SKILL.md
│   └── explorer/SKILL.md
├── raw/                        # Wiki: source documents
├── wiki/                       # Wiki: LLM-maintained knowledge base
├── cli.ts                      # CLI entry point
├── CLAUDE.md                   # Project config for Claude Code
├── package.json
└── tsconfig.json
```

---

## The Karpathy Wiki

This project includes a knowledge base following [Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). Instead of a database, you use organized markdown files that Claude can search, update, and cross-reference.

- **`raw/`** — Drop source docs here (immutable)
- **`wiki/`** — Claude maintains summaries, concepts, and cross-references
- **Three workflows**: `INGEST` (add knowledge), `QUERY` (search), `LINT` (health check)

The wiki compounds over time. Each session adds knowledge. Future sessions can query it without re-reading all the code.

---

## Extending to other tools

This pattern works for any REST API. To add your own:

1. Build a TypeScript API client (`shared/your-client.ts`)
2. Create a CLI wrapper (`cli.ts`)
3. Write SKILL.md files with trigger descriptions
4. Install to `~/.claude/skills/your-tool/`

See also: [claude-n8n-automation](https://github.com/SorinaW/claude-n8n-automation) — same pattern for n8n workflow automation.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `setup` shows "API key not found" | Create `.asana-api-key` file with your token, or set `ASANA_API_KEY` env var |
| `setup` shows "Bad request" | Your token may be invalid — regenerate at https://app.asana.com/0/my-apps |
| No output from commands | Make sure you ran `npm install` first |
| "Workspace GID required" | Set `ASANA_WORKSPACE_GID` env var with your workspace GID from `setup` |
| Skills don't activate in Claude | Check skills are copied to `~/.claude/skills/asana/` and GID placeholders are replaced |
| Rate limit errors (429) | Asana allows ~1500 req/min — batch operations have built-in delays |

---

## Requirements

- Node.js 18+
- Claude Code CLI
- Asana account (free tier works)

## License

MIT — [Sorina Weber](https://github.com/SorinaW)
