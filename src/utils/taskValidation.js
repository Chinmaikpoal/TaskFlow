/**
 * Task Validation Utilities
 * Validates task payload for both creation and updates.
 */

export const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High'];

/**
 * Validates a task object before saving.
 *
 * @param {Object} task - Task payload to validate
 * @param {string} task.title - Task title
 * @param {string} task.dueDate - Due date (YYYY-MM-DD)
 * @param {string} [task.priority] - Priority level ('Low' | 'Medium' | 'High')
 * @param {string} [task.description] - Optional description
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateTask(task = {}) {
  const errors = {};

  // 1. Title Validation
  const rawTitle = task.title !== undefined && task.title !== null ? String(task.title).trim() : '';
  if (!rawTitle) {
    errors.title = 'Task title is required.';
  } else if (rawTitle.length < 2) {
    errors.title = 'Task title must be at least 2 characters long.';
  } else if (rawTitle.length > 120) {
    errors.title = 'Task title cannot exceed 120 characters.';
  }

  // 2. Due Date Validation
  const rawDate = task.dueDate !== undefined && task.dueDate !== null ? String(task.dueDate).trim() : '';
  if (!rawDate) {
    errors.dueDate = 'Due date is required.';
  } else {
    // Validate format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(rawDate)) {
      errors.dueDate = 'Due date must be in YYYY-MM-DD format.';
    } else {
      const [yearStr, monthStr, dayStr] = rawDate.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);

      const parsedDate = new Date(year, month - 1, day);
      if (
        isNaN(parsedDate.getTime()) ||
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day
      ) {
        errors.dueDate = 'Please provide a valid calendar date.';
      }
    }
  }

  // 3. Priority Validation
  if (task.priority && !ALLOWED_PRIORITIES.includes(task.priority)) {
    errors.priority = `Priority must be one of: ${ALLOWED_PRIORITIES.join(', ')}.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
