/**
 * Asana REST API Client for Claude Code Skills
 * Handles authentication, requests, and common operations.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// --- Configuration ---

const API_BASE = 'https://app.asana.com/api/1.0';

function getApiKey(): string {
  // Try environment variable first
  if (process.env.ASANA_API_KEY) {
    return process.env.ASANA_API_KEY;
  }

  // Try .asana-api-key file (project root, then home directory)
  const locations = [
    path.join(process.cwd(), '.asana-api-key'),
    path.join(process.env.HOME || process.env.USERPROFILE || '', '.asana-api-key'),
  ];

  for (const loc of locations) {
    try {
      return fs.readFileSync(loc, 'utf-8').trim();
    } catch {
      // Continue to next location
    }
  }

  // Optional: Try a credential vault file (customize path for your setup)
  const vaultPath = process.env.CREDENTIAL_VAULT_PATH;
  if (vaultPath) {
    try {
      const vault = JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));
      if (vault.sales?.asana?.access_token) {
        return vault.sales.asana.access_token;
      }
    } catch {
      // Continue
    }
  }

  throw new Error(
    'Asana API key not found. Set ASANA_API_KEY env var or create .asana-api-key file.'
  );
}

function getWorkspaceGid(): string | undefined {
  return process.env.ASANA_WORKSPACE_GID || undefined;
}

// --- HTTP Client ---

interface ApiResponse {
  status: number;
  data: any;
}

async function request(
  method: string,
  endpoint: string,
  body?: any,
  queryParams?: Record<string, string>
): Promise<ApiResponse> {
  const apiKey = getApiKey();
  let urlPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (queryParams) {
    const qs = new URLSearchParams(queryParams).toString();
    urlPath += `?${qs}`;
  }

  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      hostname: 'app.asana.com',
      port: 443,
      path: `/api/1.0${urlPath}`,
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 30000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode || 0, data: parsed });
        } catch {
          resolve({ status: res.statusCode || 0, data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// --- Workspaces ---

export async function listWorkspaces() {
  return request('GET', '/workspaces');
}

// --- Projects ---

export async function listProjects(workspaceGid?: string) {
  const ws = workspaceGid || getWorkspaceGid();
  const params: Record<string, string> = { limit: '100' };
  if (ws) params.workspace = ws;
  return request('GET', '/projects', undefined, params);
}

export async function getProject(projectGid: string) {
  return request('GET', `/projects/${projectGid}`);
}

export async function createProject(data: {
  name: string;
  workspace?: string;
  team?: string;
  notes?: string;
  color?: string;
  default_view?: string;
  public?: boolean;
}) {
  const workspace = data.workspace || getWorkspaceGid();
  return request('POST', '/projects', {
    data: { ...data, workspace },
  });
}

// --- Tasks ---

export async function createTask(data: {
  name: string;
  projects?: string[];
  assignee?: string;
  due_on?: string;
  due_at?: string;
  notes?: string;
  html_notes?: string;
  workspace?: string;
  parent?: string;
  tags?: string[];
  followers?: string[];
  custom_fields?: Record<string, any>;
}) {
  const workspace = data.workspace || getWorkspaceGid();
  return request('POST', '/tasks', {
    data: { ...data, workspace },
  });
}

export async function getTask(taskGid: string) {
  return request('GET', `/tasks/${taskGid}`);
}

export async function updateTask(
  taskGid: string,
  data: {
    name?: string;
    assignee?: string;
    due_on?: string;
    due_at?: string;
    notes?: string;
    completed?: boolean;
    custom_fields?: Record<string, any>;
  }
) {
  return request('PUT', `/tasks/${taskGid}`, { data });
}

export async function deleteTask(taskGid: string) {
  return request('DELETE', `/tasks/${taskGid}`);
}

export async function listTasksForProject(
  projectGid: string,
  params?: { completed_since?: string; limit?: string }
) {
  return request('GET', `/projects/${projectGid}/tasks`, undefined, {
    limit: '100',
    opt_fields: 'name,assignee,assignee.name,due_on,completed,notes,tags,tags.name,custom_fields',
    ...params,
  });
}

export async function searchTasks(
  workspaceGid: string,
  params: {
    text?: string;
    assignee?: string;
    'projects.any'?: string;
    completed?: boolean;
    'due_on.before'?: string;
    'due_on.after'?: string;
    sort_by?: string;
  }
) {
  const queryParams: Record<string, string> = {
    opt_fields: 'name,assignee,assignee.name,due_on,completed,notes,permalink_url',
  };
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      queryParams[key] = String(value);
    }
  }
  return request(
    'GET',
    `/workspaces/${workspaceGid}/tasks/search`,
    undefined,
    queryParams
  );
}

export async function addTaskToProject(taskGid: string, projectGid: string) {
  return request('POST', `/tasks/${taskGid}/addProject`, {
    data: { project: projectGid },
  });
}

// --- Subtasks ---

export async function createSubtask(
  parentTaskGid: string,
  data: {
    name: string;
    assignee?: string;
    due_on?: string;
    notes?: string;
  }
) {
  return request('POST', `/tasks/${parentTaskGid}/subtasks`, { data });
}

export async function listSubtasks(taskGid: string) {
  return request('GET', `/tasks/${taskGid}/subtasks`, undefined, {
    opt_fields: 'name,assignee,assignee.name,due_on,completed',
  });
}

// --- Sections ---

export async function listSections(projectGid: string) {
  return request('GET', `/projects/${projectGid}/sections`);
}

export async function createSection(projectGid: string, name: string) {
  return request('POST', `/projects/${projectGid}/sections`, {
    data: { name },
  });
}

export async function addTaskToSection(sectionGid: string, taskGid: string) {
  return request('POST', `/sections/${sectionGid}/addTask`, {
    data: { task: taskGid },
  });
}

// --- Goals ---

export async function listGoals(params: {
  workspace?: string;
  team?: string;
  project?: string;
  is_workspace_level?: boolean;
  time_periods?: string[];
}) {
  const ws = params.workspace || getWorkspaceGid();
  const queryParams: Record<string, string> = {
    opt_fields:
      'name,owner,owner.name,due_on,start_on,status,current_status_update,current_status_update.text,notes,html_notes,metric,metric.current_number_value,metric.target_number_value,metric.unit',
    limit: '100',
  };
  if (ws) queryParams.workspace = ws;
  if (params.team) queryParams.team = params.team;
  if (params.project) queryParams.project = params.project;
  if (params.is_workspace_level !== undefined) {
    queryParams.is_workspace_level = String(params.is_workspace_level);
  }
  return request('GET', '/goals', undefined, queryParams);
}

export async function getGoal(goalGid: string) {
  return request('GET', `/goals/${goalGid}`, undefined, {
    opt_fields:
      'name,owner,owner.name,due_on,start_on,status,notes,html_notes,metric,metric.current_number_value,metric.target_number_value,metric.unit,followers,team,workspace,time_period',
  });
}

export async function createGoal(data: {
  name: string;
  workspace?: string;
  owner?: string;
  due_on?: string;
  start_on?: string;
  notes?: string;
  html_notes?: string;
  is_workspace_level?: boolean;
  team?: string;
  time_period?: string;
  liked?: boolean;
  followers?: string[];
}) {
  const workspace = data.workspace || getWorkspaceGid();
  return request('POST', '/goals', {
    data: { ...data, workspace },
  });
}

export async function updateGoal(
  goalGid: string,
  data: {
    name?: string;
    owner?: string;
    due_on?: string;
    start_on?: string;
    notes?: string;
    status?: string;
    liked?: boolean;
  }
) {
  return request('PUT', `/goals/${goalGid}`, { data });
}

export async function addGoalSubgoal(parentGoalGid: string, subgoalGid: string) {
  return request('POST', `/goals/${parentGoalGid}/addSubgoal`, {
    data: { subgoal: subgoalGid },
  });
}

export async function addGoalSupportingWork(goalGid: string, projectGid: string) {
  return request('POST', `/goals/${goalGid}/addSupportingWorkForGoal`, {
    data: { supporting_work: projectGid },
  });
}

// --- Goal Metrics (Progress) ---

export async function updateGoalMetric(
  goalGid: string,
  data: {
    current_number_value?: number;
    target_number_value?: number;
    initial_number_value?: number;
    unit?: string;
    precision?: number;
    currency_code?: string;
  }
) {
  return request('POST', `/goals/${goalGid}/setMetricCurrentValue`, { data });
}

// --- Status Updates ---

export async function createStatusUpdate(data: {
  parent: string;
  status_type: 'on_track' | 'at_risk' | 'off_track' | 'on_hold' | 'complete';
  title: string;
  text?: string;
  html_text?: string;
}) {
  return request('POST', '/status_updates', { data });
}

export async function listStatusUpdates(parentGid: string, resourceSubtype: string) {
  return request('GET', `/status_updates`, undefined, {
    parent: parentGid,
    resource_subtype: resourceSubtype,
    opt_fields: 'title,text,status_type,created_at,created_by,created_by.name',
    limit: '10',
  });
}

// --- Users ---

export async function getMe() {
  return request('GET', '/users/me');
}

export async function listUsers(workspaceGid?: string) {
  const ws = workspaceGid || getWorkspaceGid();
  if (!ws) throw new Error('Workspace GID required');
  return request('GET', `/workspaces/${ws}/users`, undefined, {
    opt_fields: 'name,email',
    limit: '100',
  });
}

export async function getUser(userGid: string) {
  return request('GET', `/users/${userGid}`);
}

// --- Teams ---

export async function listTeams(organizationGid?: string) {
  const org = organizationGid || getWorkspaceGid();
  if (!org) throw new Error('Organization GID required');
  return request('GET', `/organizations/${org}/teams`, undefined, {
    limit: '100',
  });
}

// --- Tags ---

export async function createTag(data: { name: string; workspace?: string; color?: string }) {
  const workspace = data.workspace || getWorkspaceGid();
  return request('POST', '/tags', {
    data: { ...data, workspace },
  });
}

export async function listTags(workspaceGid?: string) {
  const ws = workspaceGid || getWorkspaceGid();
  if (!ws) throw new Error('Workspace GID required');
  return request('GET', `/workspaces/${ws}/tags`, undefined, { limit: '100' });
}

// --- Portfolios ---

export async function listPortfolios(workspaceGid?: string, owner?: string) {
  const ws = workspaceGid || getWorkspaceGid();
  if (!ws) throw new Error('Workspace GID required');
  return request('GET', '/portfolios', undefined, {
    workspace: ws,
    owner: owner || 'me',
    opt_fields: 'name,owner,owner.name',
    limit: '100',
  });
}

// --- Custom Fields ---

export async function listCustomFieldsForProject(projectGid: string) {
  return request('GET', `/projects/${projectGid}/custom_field_settings`, undefined, {
    opt_fields: 'custom_field,custom_field.name,custom_field.type,custom_field.enum_options',
  });
}

// --- Stories (Comments) ---

export async function addComment(taskGid: string, text: string) {
  return request('POST', `/tasks/${taskGid}/stories`, {
    data: { text },
  });
}

export async function listStories(taskGid: string) {
  return request('GET', `/tasks/${taskGid}/stories`, undefined, {
    opt_fields: 'text,created_at,created_by,created_by.name,type',
    limit: '50',
  });
}

// --- Attachments ---

export async function listAttachments(taskGid: string) {
  return request('GET', `/tasks/${taskGid}/attachments`, undefined, {
    opt_fields: 'name,download_url,host,created_at',
  });
}

// --- Batch Operations ---

export async function batchCreateTasks(
  tasks: Array<{
    name: string;
    projects?: string[];
    assignee?: string;
    due_on?: string;
    notes?: string;
  }>
) {
  const results = [];
  for (const task of tasks) {
    const result = await createTask(task);
    results.push(result);
    // Small delay to respect rate limits
    await new Promise((r) => setTimeout(r, 100));
  }
  return results;
}

// --- Convenience / High-Level ---

export async function getMyTasks(workspaceGid?: string) {
  const me = await getMe();
  const ws = workspaceGid || getWorkspaceGid();
  if (!ws) throw new Error('Workspace GID required');
  return searchTasks(ws, {
    assignee: me.data.data.gid,
    completed: false,
    sort_by: 'due_date',
  });
}

export async function completeTask(taskGid: string) {
  return updateTask(taskGid, { completed: true });
}

// --- Exports for CLI usage ---

export {
  request,
  getApiKey,
  getWorkspaceGid,
  API_BASE,
};
