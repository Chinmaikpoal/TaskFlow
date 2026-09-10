import React from 'react';

/**
 * FilterBar Component — Phase 2
 * Provides controls for:
 * 1. Status Filter: All, Pending, Completed
 * 2. Priority Filter: All, High, Medium, Low
 * 3. Sorting: Newest First, Oldest First, Due Date, Priority
 * 4. Reset Filters: Clears search, active filters, and custom sort
 */
export default function FilterBar({
  statusFilter = 'all',
  onStatusFilterChange,
  priorityFilter = 'all',
  onPriorityFilterChange,
  sortBy = 'newest',
  onSortChange,
  counts = {},
  hasActiveFilters = false,
  onResetFilters,
}) {
  const statusOptions = [
    { key: 'all', label: 'All Status', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'completed', label: 'Completed', count: counts.completed },
  ];

  const priorityOptions = [
    { key: 'all', label: 'All Priorities', count: counts.priorityAll ?? counts.all },
    { key: 'high', label: 'High', count: counts.high },
    { key: 'medium', label: 'Medium', count: counts.medium },
    { key: 'low', label: 'Low', count: counts.low },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'dueDate', label: 'Due Date (Earliest)' },
    { value: 'priority', label: 'Priority (High → Low)' },
  ];

  return (
    <div className="filter-bar" aria-label="Task filters and sorting toolbar">
      <div className="filter-groups-wrapper">
        {/* Status Filter Group */}
        <div className="filter-group" role="group" aria-label="Filter by task completion status">
          <span className="filter-label" id="status-filter-label">Status:</span>
          <div className="filter-pills-row" role="radiogroup" aria-labelledby="status-filter-label">
            {statusOptions.map((opt) => {
              const isActive = statusFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  className={`filter-pill ${isActive ? 'active' : ''}`}
                  onClick={() => onStatusFilterChange(opt.key)}
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`${opt.label} (${opt.count ?? 0} tasks)`}
                >
                  <span>{opt.label}</span>
                  {opt.count !== undefined && (
                    <span className="filter-pill-count">{opt.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority Filter Group */}
        <div className="filter-group" role="group" aria-label="Filter by task priority">
          <span className="filter-label" id="priority-filter-label">Priority:</span>
          <div className="filter-pills-row" role="radiogroup" aria-labelledby="priority-filter-label">
            {priorityOptions.map((opt) => {
              const isActive = priorityFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  className={`filter-pill priority-pill-${opt.key} ${isActive ? 'active' : ''}`}
                  onClick={() => onPriorityFilterChange(opt.key)}
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`${opt.label} (${opt.count ?? 0} tasks)`}
                >
                  <span>{opt.label}</span>
                  {opt.count !== undefined && (
                    <span className="filter-pill-count">{opt.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sorting Control and Reset Button */}
      <div className="filter-controls-right">
        <div className="sort-control-group">
          <label htmlFor="task-sort-select" className="filter-label">
            Sort:
          </label>
          <div className="sort-select-wrapper">
            <select
              id="task-sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort tasks by"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="sort-select-arrow" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="reset-filter-btn"
            onClick={onResetFilters}
            title="Reset active search, filters, and sort to default"
            aria-label="Reset search, filters, and sorting to default"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            <span>Reset All</span>
          </button>
        )}
      </div>
    </div>
  );
}
