import React, { memo } from 'react';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';

/**
 * TaskList Component — Phase 2
 * Renders the responsive grid of TaskCards or a contextual EmptyState.
 */
function TaskList({
  tasks = [],
  totalTaskCount = 0,
  statusFilter = 'all',
  priorityFilter = 'all',
  searchQuery = '',
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenAddModal,
  onResetFilters,
}) {
  // If there are no tasks in the current filtered/sorted view, render appropriate empty state
  if (tasks.length === 0) {
    if (totalTaskCount === 0) {
      return (
        <EmptyState
          type="no-tasks"
          onAction={onOpenAddModal}
        />
      );
    }

    if (statusFilter === 'completed' && !searchQuery.trim() && priorityFilter === 'all') {
      return (
        <EmptyState
          type="no-completed"
          onAction={onResetFilters}
        />
      );
    }

    if (statusFilter === 'pending' && !searchQuery.trim() && priorityFilter === 'all') {
      return (
        <EmptyState
          type="no-pending"
          onAction={onOpenAddModal}
        />
      );
    }

    // Build active filter description for helpful empty state messaging
    const filterParts = [];
    if (statusFilter !== 'all') filterParts.push(`status: ${statusFilter}`);
    if (priorityFilter !== 'all') filterParts.push(`priority: ${priorityFilter}`);

    return (
      <EmptyState
        type="no-search"
        searchQuery={searchQuery}
        activeFiltersText={filterParts.join(', ')}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <section className="task-list-section" aria-label="Task list items">
      <div className="task-section-header">
        <h2 className="task-section-title">
          <span>Tasks</span>
          <span className="task-count-badge" aria-label={`${tasks.length} tasks visible`}>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            {totalTaskCount !== tasks.length && ` (of ${totalTaskCount} total)`}
          </span>
        </h2>
      </div>

      <div className="task-grid" role="list">
        {tasks.map((task) => (
          <div key={task.id} role="listitem">
            <TaskCard
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(TaskList);
