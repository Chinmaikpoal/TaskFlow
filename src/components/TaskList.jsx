import React from 'react';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';

/**
 * TaskList Component
 * Renders the responsive grid of TaskCards or an appropriate EmptyState.
 */
export default function TaskList({
  tasks,
  totalTaskCount,
  activeFilter,
  searchQuery,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenAddModal,
  onResetFilters,
}) {
  // If there are no tasks in the filtered view, render appropriate empty state
  if (tasks.length === 0) {
    let emptyType = 'no-search';
    let actionHandler = onResetFilters;

    if (totalTaskCount === 0) {
      emptyType = 'no-tasks';
      actionHandler = onOpenAddModal;
    } else if (activeFilter === 'completed') {
      emptyType = 'no-completed';
      actionHandler = () => onResetFilters();
    }

    return (
      <EmptyState
        type={emptyType}
        searchQuery={searchQuery}
        onAction={actionHandler}
      />
    );
  }

  return (
    <section className="task-list-section" aria-label="Task list">
      <div className="task-section-header">
        <h2 className="task-section-title">
          <span>Tasks</span>
          <span className="task-count-badge">
            {tasks.length} {tasks.length === 1 ? 'item' : 'items'}
            {totalTaskCount !== tasks.length && ` (of ${totalTaskCount} total)`}
          </span>
        </h2>
      </div>

      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
