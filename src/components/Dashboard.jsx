import React from 'react';
import StatsCard from './StatsCard';

/**
 * Dashboard Component
 * Renders the high-level statistics cards using reactive task metrics.
 */
export default function Dashboard({ stats, onSelectFilter }) {
  const { total = 0, pending = 0, completed = 0, highPriority = 0 } = stats;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="dashboard-section" aria-label="Task metrics dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Productivity Dashboard</h2>
          <p>Real-time overview of your task workload & progress</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Total Tasks"
          value={total}
          subtext="All tracked items"
          type="total"
          onClick={() => onSelectFilter && onSelectFilter('all')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"/>
              <path d="M7 8h10"/>
              <path d="M7 12h10"/>
              <path d="M7 16h10"/>
            </svg>
          }
        />

        <StatsCard
          title="Pending Tasks"
          value={pending}
          subtext={`${pending} item${pending === 1 ? '' : 's'} remaining`}
          type="pending"
          onClick={() => onSelectFilter && onSelectFilter('pending')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          }
        />

        <StatsCard
          title="Completed Tasks"
          value={completed}
          subtext={`${completionRate}% completed`}
          type="completed"
          onClick={() => onSelectFilter && onSelectFilter('completed')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          }
        />

        <StatsCard
          title="High Priority"
          value={highPriority}
          subtext="Urgent action required"
          type="high"
          onClick={() => onSelectFilter && onSelectFilter('high')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4"/>
              <path d="M12 17h.01"/>
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            </svg>
          }
        />
      </div>
    </section>
  );
}
