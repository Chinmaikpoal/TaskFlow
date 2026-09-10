import React from 'react';

/**
 * SearchBar Component
 * Controlled search input allowing users to search tasks by title or description.
 */
export default function SearchBar({ searchQuery, onSearchChange, onClearSearch }) {
  return (
    <div className="search-container">
      <div className="search-icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Search tasks by title or description..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search tasks by title or description"
      />

      {searchQuery && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={onClearSearch}
          aria-label="Clear search input"
          title="Clear search"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  );
}
