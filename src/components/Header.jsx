import React from 'react';

/**
 * Header Component
 * Provides branding, sync status indicator, and primary "+ Add Task" action.
 */
export default function Header({ onOpenAddModal }) {
  return (
    <header className="header-wrapper">
      <div className="header-container">
        <div className="brand-section">
          <div className="brand-logo-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 11 3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div className="brand-info">
            <h1>TaskFlow</h1>
            <p>Task Management Application</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="sync-badge" title="Data is saved locally in browser storage">
            <span className="sync-dot"></span>
            <span>Local Storage Active</span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenAddModal}
            aria-label="Add new task"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
