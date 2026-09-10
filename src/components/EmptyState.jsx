import React, { memo } from 'react';

/**
 * EmptyState Component — Phase 2
 * Provides tailored contextual feedback for:
 * 1. 'no-tasks' -> When the user has zero tasks in the entire app.
 * 2. 'no-search' -> When active search or filter combination returns 0 items.
 * 3. 'no-completed' -> When the completed filter is chosen but no tasks are completed yet.
 * 4. 'no-pending' -> When the pending filter is chosen and all tasks are completed.
 */
function EmptyState({ type = 'no-tasks', onAction, searchQuery, activeFiltersText }) {
  if (type === 'no-search') {
    return (
      <div className="empty-state-wrapper" role="status" aria-live="polite">
        <div className="empty-state-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </div>
        <h3 className="empty-state-title">No Matching Tasks Found</h3>
        <p className="empty-state-text">
          {searchQuery ? (
            <>We couldn't find any tasks matching "<strong>{searchQuery}</strong>"{activeFiltersText ? ` with ${activeFiltersText}` : ''}. Try different keywords or reset your filters.</>
          ) : (
            <>No tasks match your current filter criteria{activeFiltersText ? ` (${activeFiltersText})` : ''}. Try adjusting or clearing your filters.</>
          )}
        </p>
        {onAction && (
          <button type="button" className="btn btn-outline" onClick={onAction}>
            Clear Search & Filters
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-completed') {
    return (
      <div className="empty-state-wrapper" role="status" aria-live="polite">
        <div className="empty-state-icon completed-empty-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 className="empty-state-title">No Completed Tasks Yet</h3>
        <p className="empty-state-text">
          You haven't marked any tasks as completed yet. Complete your pending items to track your accomplishments!
        </p>
        {onAction && (
          <button type="button" className="btn btn-outline" onClick={onAction}>
            View Pending Tasks
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-pending') {
    return (
      <div className="empty-state-wrapper" role="status" aria-live="polite">
        <div className="empty-state-icon celebration-empty-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <h3 className="empty-state-title">All Caught Up! 🎉</h3>
        <p className="empty-state-text">
          You have zero pending tasks remaining. Great job staying on top of your workflow!
        </p>
        {onAction && (
          <button type="button" className="btn btn-primary" onClick={onAction}>
            Add New Task
          </button>
        )}
      </div>
    );
  }

  // Default 'no-tasks'
  return (
    <div className="empty-state-wrapper" role="status" aria-live="polite">
      <div className="empty-state-icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      </div>
      <h3 className="empty-state-title">No Tasks in TaskFlow</h3>
      <p className="empty-state-text">
        Your task list is empty. Stay organized and boost your daily productivity by adding your first task.
      </p>
      {onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Create Your First Task</span>
        </button>
      )}
    </div>
  );
}

export default memo(EmptyState);
