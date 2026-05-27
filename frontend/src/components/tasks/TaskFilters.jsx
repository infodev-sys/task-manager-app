import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import useDebounce from '../../hooks/useDebounce';
import './TaskFilters.css';

const FILTER_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

const PRIORITY_OPTIONS = [
  { label: 'All Priority', value: '' },
  { label: '🔴 High', value: 'high' },
  { label: '🟡 Medium', value: 'medium' },
  { label: '🟢 Low', value: 'low' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Oldest First', value: 'createdAt' },
  { label: 'Due Date', value: 'dueDate' },
  { label: 'Priority', value: '-priority' },
  { label: 'Title A–Z', value: 'title' },
];

const TaskFilters = ({ onAdd }) => {
  const { filters, setFilter, stats } = useTasks();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilter({ search: debouncedSearch });
    }
  }, [debouncedSearch]); // eslint-disable-line

  const tabCount = { all: stats.total, pending: stats.pending, completed: stats.completed };

  return (
    <div className="task-filters">
      <div className="task-filters-top">
        <div className="filter-tabs">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              className={`filter-tab ${filters.status === tab.value ? 'active' : ''}`}
              onClick={() => setFilter({ status: tab.value })}
            >
              {tab.label}
              <span className="filter-tab-count">{tabCount[tab.value]}</span>
            </button>
          ))}
        </div>

        <button className="btn btn-primary" onClick={onAdd}>
          <span>+</span> New Task
        </button>
      </div>

      <div className="task-filters-bottom">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="form-input search-input"
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button className="search-clear" onClick={() => { setSearchInput(''); setFilter({ search: '' }); }}>✕</button>
          )}
        </div>

        <select
          className="form-input filter-select"
          value={filters.priority}
          onChange={e => setFilter({ priority: e.target.value })}
        >
          {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          className="form-input filter-select"
          value={filters.sort}
          onChange={e => setFilter({ sort: e.target.value })}
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
