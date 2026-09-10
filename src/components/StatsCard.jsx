import React, { memo } from 'react';

/**
 * StatsCard Component — Phase 2
 * Displays a metric with icon, title, counter value, descriptive subtext, and active state indicator.
 */
function StatsCard({ title, value, subtext, type = 'total', icon, onClick, isActive = false }) {
  return (
    <div
      className={`stats-card ${type} ${isActive ? 'is-active' : ''}`}
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
      aria-label={`${title}: ${value}. ${subtext}`}
      aria-pressed={onClick ? isActive : undefined}
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

export default memo(StatsCard);
