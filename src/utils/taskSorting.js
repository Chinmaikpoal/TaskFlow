/**
 * Task Sorting Utilities
 * Sorts tasks by Newest, Oldest, Due Date, or Priority without mutating original data.
 */

const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Parses timestamp from task object (createdAt or fallback).
 *
 * @param {Object} task
 * @returns {number}
 */
function getCreationTime(task) {
  if (task.createdAt) {
    const time = new Date(task.createdAt).getTime();
    if (!isNaN(time)) return time;
  }
  // Fallback if task id contains timestamp e.g. task-1725...
  if (typeof task.id === 'string') {
    const match = task.id.match(/\d{10,}/);
    if (match) return parseInt(match[0], 10);
  }
  return 0;
}

/**
 * Sorts an array of tasks by the chosen criterion.
 * Pure function: returns a new sorted array.
 *
 * @param {Array<Object>} tasks - List of tasks to sort
 * @param {string} sortBy - 'newest' | 'oldest' | 'dueDate' | 'priority'
 * @returns {Array<Object>} Sorted tasks
 */
export function sortTasks(tasks = [], sortBy = 'newest') {
  const shallowCopy = [...tasks];

  switch (sortBy) {
    case 'newest':
      // Newest created date first
      return shallowCopy.sort((a, b) => getCreationTime(b) - getCreationTime(a));

    case 'oldest':
      // Oldest created date first
      return shallowCopy.sort((a, b) => getCreationTime(a) - getCreationTime(b));

    case 'dueDate':
      // Earliest due date first
      return shallowCopy.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1; // Tasks without due date go to the end
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });

    case 'priority':
      // High -> Medium -> Low
      return shallowCopy.sort((a, b) => {
        const weightA = PRIORITY_WEIGHTS[(a.priority || 'medium').toLowerCase()] || 0;
        const weightB = PRIORITY_WEIGHTS[(b.priority || 'medium').toLowerCase()] || 0;
        return weightB - weightA;
      });

    default:
      return shallowCopy;
  }
}
