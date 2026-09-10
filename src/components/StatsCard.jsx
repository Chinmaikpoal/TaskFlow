import React from 'react';

/**
 * StatsCard Component
 * Displays a metric with icon, title, counter value, and subtle descriptive subtext.
 * Can be clicked to quickly switch filters.
 */
export default function StatsCard({ title, value, subtext, type = 'total', icon, onClick }) {
  return (
    <div
      className={`stats-card ${type}`}
      onClick={onClick}
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      aria-label={`${title}: ${value}`}
    >
      <div className="stats-card-top">
        <span className="stats-card-title">{title}</span>
        <div className="stats-card-icon" aria-hidden="true">
          {icon}
        </div>
      </div>
      <div className="stats-card-value">{value}</div>
      <div className="stats-card-sub">{subtext}</div>
    </div>
  );
}
