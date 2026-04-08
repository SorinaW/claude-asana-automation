#!/usr/bin/env npx ts-node
/**
 * Asana CLI — Run Asana operations directly from the command line.
 * Usage: npx ts-node cli.ts <command> [options]
 *
 * Commands:
 *   setup                    Verify API connection and show workspace info
 *   tasks list <project_gid> List tasks in a project
 *   tasks create <json>      Create a task from JSON
 *   tasks complete <gid>     Mark a task as complete
 *   tasks search <query>     Search tasks by text
 *   goals list               List workspace goals
 *   goals create <json>      Create a goal from JSON
 *   goals progress <gid> <current> <target>  Update goal progress
 *   projects list            List all projects
 *   projects create <json>   Create a project from JSON
 *   users list               List workspace users
 *   users me                 Show current user info
 */

import * as client from './shared/asana-client';

const args = process.argv.slice(2);
const command = args[0];
const subcommand = args[1];

async function main() {
  try {
    switch (command) {
      case 'setup':
        await runSetup();
        break;

      case 'tasks':
        await handleTasks();
        break;

      case 'goals':
        await handleGoals();
        break;

      case 'projects':
        await handleProjects();
        break;

      case 'users':
        await handleUsers();
        break;

      default:
        printHelp();
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

async function runSetup() {
  console.log('Verifying Asana connection...\n');

  const me = await client.getMe();
  if (me.status !== 200) {
    console.error('Failed to connect. Check your API key.');
    console.error('Response:', JSON.stringify(me.data, null, 2));
    process.exit(1);
  }

  const user = me.data.data;
  console.log(`Connected as: ${user.name} (${user.email})`);
  console.log(`User GID: ${user.gid}\n`);

  const workspaces = await client.listWorkspaces();
  console.log('Workspaces:');
  for (const ws of workspaces.data.data) {
    console.log(`  - ${ws.name} (GID: ${ws.gid})`);
  }

  if (workspaces.data.data.length > 0) {
    const defaultWs = workspaces.data.data[0];
    console.log(`\nTo set default workspace, run:`);
    console.log(`  export ASANA_WORKSPACE_GID=${defaultWs.gid}`);
    console.log(`  # or add to .env file`);

    // Try to list teams
    try {
      const teams = await client.listTeams(defaultWs.gid);
      if (teams.data.data && teams.data.data.length > 0) {
        console.log(`\nTeams in ${defaultWs.name}:`);
        for (const team of teams.data.data) {
          console.log(`  - ${team.name} (GID: ${team.gid})`);
        }
      }
    } catch {
      // Teams might not be available in personal workspaces
    }

    // List projects
    const projects = await client.listProjects(defaultWs.gid);
    if (projects.data.data && projects.data.data.length > 0) {
      console.log(`\nProjects (first 10):`);
      for (const proj of projects.data.data.slice(0, 10)) {
        console.log(`  - ${proj.name} (GID: ${proj.gid})`);
      }
    }
  }

  console.log('\nSetup complete! Connection is working.');
}

async function handleTasks() {
  switch (subcommand) {
    case 'list': {
      const projectGid = args[2];
      if (!projectGid) {
        console.error('Usage: tasks list <project_gid>');
        process.exit(1);
      }
      const result = await client.listTasksForProject(projectGid);
      printJson(result);
      break;
    }

    case 'create': {
      const jsonStr = args[2];
      if (!jsonStr) {
        console.error('Usage: tasks create \'{"name":"...","assignee":"..."}\'');
        process.exit(1);
      }
      const data = JSON.parse(jsonStr);
      const result = await client.createTask(data);
      printJson(result);
      if (result.data.data) {
        console.log(`\nTask URL: https://app.asana.com/0/0/${result.data.data.gid}`);
      }
      break;
    }

    case 'complete': {
      const gid = args[2];
      if (!gid) {
        console.error('Usage: tasks complete <task_gid>');
        process.exit(1);
      }
      const result = await client.completeTask(gid);
      printJson(result);
      break;
    }

    case 'search': {
      const query = args.slice(2).join(' ');
      if (!query) {
        console.error('Usage: tasks search <query>');
        process.exit(1);
      }
      const wsGid = client.getWorkspaceGid();
      if (!wsGid) {
        console.error('Set ASANA_WORKSPACE_GID to search tasks.');
        process.exit(1);
      }
      const result = await client.searchTasks(wsGid, { text: query, completed: false });
      printJson(result);
      break;
    }

    case 'my': {
      const result = await client.getMyTasks();
      printJson(result);
      break;
    }

    default:
      console.error('Tasks subcommands: list, create, complete, search, my');
  }
}

async function handleGoals() {
  switch (subcommand) {
    case 'list': {
      const result = await client.listGoals({});
      printJson(result);
      break;
    }

    case 'create': {
      const jsonStr = args[2];
      if (!jsonStr) {
        console.error('Usage: goals create \'{"name":"...","owner":"..."}\'');
        process.exit(1);
      }
      const data = JSON.parse(jsonStr);
      const result = await client.createGoal(data);
      printJson(result);
      if (result.data.data) {
        console.log(`\nGoal URL: https://app.asana.com/0/goals/${result.data.data.gid}`);
      }
      break;
    }

    case 'progress': {
      const goalGid = args[2];
      const current = parseFloat(args[3]);
      const target = parseFloat(args[4]);
      if (!goalGid || isNaN(current) || isNaN(target)) {
        console.error('Usage: goals progress <goal_gid> <current> <target>');
        process.exit(1);
      }
      const result = await client.updateGoalMetric(goalGid, {
        current_number_value: current,
        target_number_value: target,
      });
      printJson(result);
      break;
    }

    case 'status': {
      const goalGid = args[2];
      const statusType = args[3] as any;
      const title = args.slice(4).join(' ');
      if (!goalGid || !statusType || !title) {
        console.error('Usage: goals status <goal_gid> <on_track|at_risk|off_track> <title>');
        process.exit(1);
      }
      const result = await client.createStatusUpdate({
        parent: goalGid,
        status_type: statusType,
        title,
      });
      printJson(result);
      break;
    }

    default:
      console.error('Goals subcommands: list, create, progress, status');
  }
}

async function handleProjects() {
  switch (subcommand) {
    case 'list': {
      const result = await client.listProjects();
      printJson(result);
      break;
    }

    case 'create': {
      const jsonStr = args[2];
      if (!jsonStr) {
        console.error('Usage: projects create \'{"name":"..."}\'');
        process.exit(1);
      }
      const data = JSON.parse(jsonStr);
      const result = await client.createProject(data);
      printJson(result);
      if (result.data.data) {
        console.log(`\nProject URL: https://app.asana.com/0/${result.data.data.gid}`);
      }
      break;
    }

    case 'sections': {
      const projectGid = args[2];
      if (!projectGid) {
        console.error('Usage: projects sections <project_gid>');
        process.exit(1);
      }
      const result = await client.listSections(projectGid);
      printJson(result);
      break;
    }

    default:
      console.error('Projects subcommands: list, create, sections');
  }
}

async function handleUsers() {
  switch (subcommand) {
    case 'me': {
      const result = await client.getMe();
      printJson(result);
      break;
    }

    case 'list': {
      const result = await client.listUsers();
      printJson(result);
      break;
    }

    default:
      console.error('Users subcommands: me, list');
  }
}

function printJson(result: any) {
  if (result.data?.data) {
    const data = result.data.data;
    if (Array.isArray(data)) {
      console.log(`Found ${data.length} results:\n`);
      for (const item of data) {
        console.log(`  - ${item.name || item.title || item.gid} (GID: ${item.gid})`);
        if (item.email) console.log(`    Email: ${item.email}`);
        if (item.assignee?.name) console.log(`    Assignee: ${item.assignee.name}`);
        if (item.due_on) console.log(`    Due: ${item.due_on}`);
        if (item.completed !== undefined) console.log(`    Completed: ${item.completed}`);
        if (item.status) console.log(`    Status: ${item.status}`);
      }
    } else {
      console.log(`${data.name || data.title || 'Result'} (GID: ${data.gid})`);
      if (data.email) console.log(`Email: ${data.email}`);
    }
  } else if (result.data?.errors) {
    console.error('API Errors:');
    for (const err of result.data.errors) {
      console.error(`  - ${err.message}`);
    }
  } else {
    console.log(JSON.stringify(result.data, null, 2));
  }
}

function printHelp() {
  console.log(`
Asana CLI — Control Asana from the command line

Usage: npx ts-node cli.ts <command> [subcommand] [options]

Commands:
  setup                              Verify connection and show workspace info
  tasks list <project_gid>           List tasks in a project
  tasks create '<json>'              Create a task
  tasks complete <task_gid>          Mark task complete
  tasks search <query>               Search tasks by text
  tasks my                           List my open tasks
  goals list                         List workspace goals
  goals create '<json>'              Create a goal
  goals progress <gid> <cur> <tgt>   Update goal progress
  goals status <gid> <type> <title>  Post status update
  projects list                      List all projects
  projects create '<json>'           Create a project
  projects sections <project_gid>    List project sections
  users me                           Show current user
  users list                         List workspace users

Examples:
  npx ts-node cli.ts setup
  npx ts-node cli.ts tasks create '{"name":"Review Q2 pipeline","assignee":"me","due_on":"2026-04-15"}'
  npx ts-node cli.ts goals create '{"name":"Increase DACH pipeline 40%","due_on":"2026-06-30"}'
  npx ts-node cli.ts tasks search "DACH pipeline"
`);
}

main();
