/**
 * Validation utilities for Asana task/goal data before API submission.
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateTask(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Task name is required and must be a non-empty string.');
  }

  if (data.due_on && !/^\d{4}-\d{2}-\d{2}$/.test(data.due_on)) {
    errors.push('due_on must be in YYYY-MM-DD format.');
  }

  if (data.due_at && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(data.due_at)) {
    errors.push('due_at must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SS.sssZ).');
  }

  if (data.due_on && data.due_at) {
    warnings.push('Both due_on and due_at specified. due_at takes precedence in Asana.');
  }

  if (!data.projects && !data.workspace && !data.parent) {
    warnings.push('No project, workspace, or parent specified. Task will be created in default workspace.');
  }

  if (data.assignee && typeof data.assignee !== 'string') {
    errors.push('assignee must be a string (user GID or email).');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateGoal(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Goal name is required and must be a non-empty string.');
  }

  if (data.due_on && !/^\d{4}-\d{2}-\d{2}$/.test(data.due_on)) {
    errors.push('due_on must be in YYYY-MM-DD format.');
  }

  if (data.start_on && !/^\d{4}-\d{2}-\d{2}$/.test(data.start_on)) {
    errors.push('start_on must be in YYYY-MM-DD format.');
  }

  if (data.start_on && data.due_on && data.start_on > data.due_on) {
    errors.push('start_on cannot be after due_on.');
  }

  if (!data.workspace && !data.team) {
    warnings.push('No workspace or team specified. Goal will use default workspace.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateProject(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Project name is required and must be a non-empty string.');
  }

  const validColors = [
    'dark-pink', 'dark-green', 'dark-blue', 'dark-red', 'dark-teal',
    'dark-brown', 'dark-orange', 'dark-purple', 'dark-warm-gray',
    'light-pink', 'light-green', 'light-blue', 'light-red', 'light-teal',
    'light-brown', 'light-orange', 'light-purple', 'light-warm-gray',
    'none',
  ];

  if (data.color && !validColors.includes(data.color)) {
    warnings.push(`Color '${data.color}' may not be valid. Valid: ${validColors.join(', ')}`);
  }

  const validViews = ['list', 'board', 'calendar', 'timeline'];
  if (data.default_view && !validViews.includes(data.default_view)) {
    errors.push(`default_view must be one of: ${validViews.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
