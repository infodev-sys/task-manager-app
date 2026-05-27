import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { useTasks } from '../../src/context/TaskContext';
import Navbar from '../../src/components/layout/Navbar';
import StatsBar from '../../src/components/tasks/StatsBar';
import TaskFilters from '../../src/components/tasks/TaskFilters';
import TaskCard from '../../src/components/tasks/TaskCard';
import TaskModal from '../../src/components/tasks/TaskModal';
import Pagination from '../../src/components/tasks/Pagination';
import './Dashboard.css';

const SkeletonCard = () => (
  <div className="task-card">
    <div className="task-card-main">
      <div className="skeleton" style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 18, width: '60%' }} />
        <div className="skeleton" style={{ height: 14, width: '80%' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 20 }} />
          <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 20 }} />
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, loading, filters, fetchTasks } = useTasks();
  const [modal, setModal] = useState({ open: false, task: null });

  // Fetch tasks whenever filters change
  useEffect(() => {
    fetchTasks(filters);
  }, [filters]); // eslint-disable-line

  const openCreate = () => setModal({ open: true, task: null });
  const openEdit = (task) => setModal({ open: true, task });
  const closeModal = () => setModal({ open: false, task: null });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-main container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              {greeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="dashboard-subtitle">Here's what's on your plate today.</p>
          </div>
          <div className="dashboard-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>

        <StatsBar />
        <TaskFilters onAdd={openCreate} />

        <div className="task-list">
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🗒️</div>
              <div className="empty-state-title">No tasks found</div>
              <div className="empty-state-desc">
                {filters.search || filters.status !== 'all' || filters.priority
                  ? 'Try adjusting your filters.'
                  : 'Create your first task to get started!'}
              </div>
              {!filters.search && filters.status === 'all' && !filters.priority && (
                <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={openCreate}>
                  + Create First Task
                </button>
              )}
            </div>
          ) : (
            tasks.map((task, i) => (
              <TaskCard key={task._id} task={task} onEdit={openEdit} index={i} />
            ))
          )}
        </div>

        <Pagination />
      </main>

      {modal.open && <TaskModal task={modal.task} onClose={closeModal} />}
    </div>
  );
};

export default Dashboard;
