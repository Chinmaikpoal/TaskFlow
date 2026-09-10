import React from 'react';

/**
 * FilterBar Component
 * Provides filter pills for:
 * Status: All, Pending, Completed
 * Priority: High, Medium, Low
 */
export default function FilterBar({
  activeFilter,
  onFilterChange,
  counts = {},
  hasActiveFilters,
  onResetFilters,
}) {
  const statusFilters = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'completed', label: 'Completed', count: counts.completed },
  ];

  const priorityFilters = [
    { key: 'high', label: 'High Priority', count: counts.high },
    { key: 'medium', label: 'Medium', count: counts.medium },
    { key: 'low', label: 'Low', count: counts.low },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-label">Status:</span>
        {statusFilters.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`filter-pill ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => onFilterChange(f.key)}
            aria-pressed={activeFilter === f.key}
          >
            <span>{f.label}</span>
            {f.count !== undefined && (
              <span className="filter-pill-count">{f.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="filter-group">
        <span className="filter-label">Priority:</span>
        {priorityFilters.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`filter-pill ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => onFilterChange(f.key)}
            aria-pressed={activeFilter === f.key}
          >
            <span>{f.label}</span>
            {f.count !== undefined && (
              <span className="filter-pill-count">{f.count}</span>
            )}
          </button>
        ))}
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className="reset-filter-btn"
          onClick={onResetFilters}
          title="Reset active search and filters"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
}
