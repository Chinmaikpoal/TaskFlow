import React, { memo } from 'react';

/**
 * TaskCard Component — Phase 2
 * Displays task details with distinct priority badges, due-date status indicators (Overdue, Due Today, Upcoming),
 * readable completed styling, and accessible quick action buttons.
 */
function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const { id, title, description, priority = 'Medium', dueDate, completed = false } = task;

  // Format the due date nicely (e.g. "Sep 15, 2026")
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
      const [year, month, day] = dateString.split('-');
      if (year && month && day) {
        const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        return date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Due date status evaluation (overdue, due today, upcoming)
  const dueDateStatus = React.useMemo(() => {
    if (!dueDate || completed) return null;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [year, month, day] = dueDate.split('-');
      const taskDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      taskDate.setHours(0, 0, 0, 0);

      const diffTime = taskDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return { type: 'overdue', label: 'Overdue' };
      }
      if (diffDays === 0) {
        return { type: 'due-today', label: 'Due Today' };
      }
      if (diffDays > 0 && diffDays <= 2) {
        return { type: 'upcoming', label: diffDays === 1 ? 'Due Tomorrow' : 'Due in 2 days' };
      }
      return null;
    } catch {
      return null;
    }
  }, [dueDate, completed]);

  const priorityLower = priority.toLowerCase();

  return (
    <article
      className={`task-card priority-${priorityLower} ${completed ? 'is-completed' : ''}`}
      aria-label={`Task: ${title}${completed ? ' (Completed)' : ''}`}
    >
      <div className="task-card-header">
        <div className="task-card-title-row">
          <button
            type="button"
            className={`task-checkbox-btn ${completed ? 'checked' : ''}`}
            onClick={() => onToggleComplete(id)}
            title={completed ? 'Restore task to Pending' : 'Mark task as Completed'}
            aria-label={completed ? `Mark "${title}" as incomplete` : `Mark "${title}" as complete`}
            aria-pressed={completed}
          >
            {completed && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>

          <h3 className="task-title" title={title}>
            {title}
          </h3>
        </div>

        <div className="task-card-badges">
          <span className={`badge badge-priority-${priorityLower}`} aria-label={`Priority: ${priority}`}>
            {priority}
          </span>
          {completed && (
            <span className="badge badge-completed" aria-label="Status: Completed">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Done
            </span>
          )}
        </div>
      </div>

      {description ? (
        <p className="task-description">{description}</p>
      ) : (
        <p className="task-description task-description-empty">No additional details provided.</p>
      )}

      <div className="task-card-footer">
        <div
          className={`task-due-date ${dueDateStatus ? dueDateStatus.type : ''}`}
          title={dueDateStatus ? `${dueDateStatus.label}: ${formatDate(dueDate)}` : `Due: ${formatDate(dueDate)}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{formatDate(dueDate)}</span>
          {dueDateStatus && (
            <span className={`due-tag tag-${dueDateStatus.type}`}>
              {dueDateStatus.label}
            </span>
          )}
        </div>

        <div className="task-actions" role="toolbar" aria-label={`Actions for ${title}`}>
          {/* Complete / Restore Action Button */}
          <button
            type="button"
            className={`action-btn ${completed ? 'restore-btn' : 'complete-btn'}`}
            onClick={() => onToggleComplete(id)}
            title={completed ? 'Restore task to Pending' : 'Mark task as Completed'}
            aria-label={completed ? `Restore "${title}" to pending` : `Mark "${title}" as completed`}
          >
            {completed ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                <span>Restore</span>
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Complete</span>
              </>
            )}
          </button>

          {/* Edit Button */}
          <button
            type="button"
            className="action-btn edit-btn"
            onClick={() => onEdit(task)}
            title="Edit task details"
            aria-label={`Edit task "${title}"`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            className="action-btn delete-btn"
            onClick={() => onDelete(task)}
            title="Delete task"
            aria-label={`Delete task "${title}"`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(TaskCard);
