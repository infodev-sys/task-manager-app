import React from 'react';
import { useTasks } from '../../context/TaskContext';
import './StatsBar.css';

const StatsBar = () => {
  const { stats } = useTasks();
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-icon stat-icon-total">📋</div>
        <div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon stat-icon-pending">⏳</div>
        <div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon stat-icon-completed">✅</div>
        <div>
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>
      <div className="stat-card stat-card-progress">
        <div className="stat-progress-header">
          <span className="stat-label">Completion Rate</span>
          <span className="stat-value">{completionRate}%</span>
        </div>
        <div className="stat-progress-bar">
          <div className="stat-progress-fill" style={{ width: `${completionRate}%` }} />
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
