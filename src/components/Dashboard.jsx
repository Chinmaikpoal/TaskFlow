import React, { memo } from 'react';
import StatsCard from './StatsCard';

/**
 * Dashboard Component — Phase 2
 * Displays live productivity counters for Total, Pending, Completed, and High Priority tasks.
 * Enables quick interactive filtering with active state indicators.
 */
function Dashboard({ stats = {}, statusFilter = 'all', priorityFilter = 'all', onSelectFilter }) {
  const { total = 0, pending = 0, completed = 0, highPriority = 0 } = stats;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleCardClick = (status, priority = 'all') => {
    if (onSelectFilter) {
      onSelectFilter(status, priority);
    }
  };

  const isTotalActive = statusFilter === 'all' && priorityFilter === 'all';
  const isPendingActive = statusFilter === 'pending' && priorityFilter === 'all';
  const isCompletedActive = statusFilter === 'completed' && priorityFilter === 'all';
  const isHighActive = priorityFilter === 'high';

  return (
    <section className="dashboard-section" aria-label="Task metrics dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Productivity Dashboard</h2>
          <p>Real-time overview of your task workload, priorities, and completion progress</p>
        </div>
        <div className="completion-rate-badge" title="Overall completion percentage">
          <span className="completion-rate-val">{completionRate}%</span>
          <span className="completion-rate-lbl">Done</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Total Tasks"
          value={total}
          subtext="All tracked items"
          type="total"
          isActive={isTotalActive}
          onClick={() => handleCardClick('all', 'all')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
          isActive={isPendingActive}
          onClick={() => handleCardClick('pending', 'all')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          }
        />

        <StatsCard
          title="Completed Tasks"
          value={completed}
          subtext={`${completionRate}% completion rate`}
          type="completed"
          isActive={isCompletedActive}
          onClick={() => handleCardClick('completed', 'all')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
          isActive={isHighActive}
          onClick={() => handleCardClick('all', 'high')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

export default memo(Dashboard);
