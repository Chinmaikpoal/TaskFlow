/**
 * Task Filtering Utilities
 * Provides combined filtering for search, status, and priority.
 */

/**
 * Filter tasks based on search query, status, and priority.
 * Pure function: does not mutate original array.
 *
 * @param {Array<Object>} tasks - List of all tasks
 * @param {Object} options - Filter options
 * @param {string} [options.searchQuery=''] - Search term matching title or description
 * @param {string} [options.statusFilter='all'] - 'all' | 'pending' | 'completed'
 * @param {string} [options.priorityFilter='all'] - 'all' | 'high' | 'medium' | 'low'
 * @returns {Array<Object>} Filtered tasks
 */
export function filterTasks(tasks = [], { searchQuery = '', statusFilter = 'all', priorityFilter = 'all' } = {}) {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const normalizedStatus = statusFilter.toLowerCase();
  const normalizedPriority = priorityFilter.toLowerCase();

  return tasks.filter((task) => {
    // 1. Status Filter
    if (normalizedStatus === 'pending' && task.completed) return false;
    if (normalizedStatus === 'completed' && !task.completed) return false;

    // 2. Priority Filter
    if (normalizedPriority !== 'all') {
      const taskPriority = (task.priority || 'medium').toLowerCase();
      if (taskPriority !== normalizedPriority) return false;
    }

    // 3. Search Query (matches Title or Description)
    if (normalizedQuery) {
      const title = (task.title || '').toLowerCase();
      const description = (task.description || '').toLowerCase();
      const matchesTitle = title.includes(normalizedQuery);
      const matchesDesc = description.includes(normalizedQuery);
      if (!matchesTitle && !matchesDesc) return false;
    }

    return true;
  });
}

/**
 * Calculate dynamic item counts for all filters.
 *
 * @param {Array<Object>} tasks - List of tasks
 * @returns {Object} Counts for statuses and priorities
 */
export function calculateFilterCounts(tasks = []) {
  const counts = {
    all: tasks.length,
    pending: 0,
    completed: 0,
    priorityAll: tasks.length,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.completed) {
      counts.completed += 1;
    } else {
      counts.pending += 1;
    }

    const priority = (task.priority || 'Medium').toLowerCase();
    if (priority === 'high') counts.high += 1;
    else if (priority === 'medium') counts.medium += 1;
    else if (priority === 'low') counts.low += 1;
  }

  return counts;
}
