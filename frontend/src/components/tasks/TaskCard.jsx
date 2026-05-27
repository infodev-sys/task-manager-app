import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { formatDate, isOverdue } from '../../utils/validation';
import './TaskCard.css';

const PRIORITY_ICONS = { high: '🔴', medium: '🟡', low: '🟢' };

const TaskCard = ({ task, onEdit, index }) => {
  const { toggleTask, deleteTask } = useTasks();
  const [deleting, setDeleting] = useState(false);
  const overdue = task.status === 'pending' && isOverdue(task.dueDate);

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    await deleteTask(task._id, task.status);
  };

  return (
    <div
      className={`task-card ${task.status === 'completed' ? 'task-card-completed' : ''} ${deleting ? 'task-card-deleting' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="task-card-main">
        <button
          className={`task-checkbox ${task.status === 'completed' ? 'checked' : ''}`}
          onClick={() => toggleTask(task._id)}
          aria-label={`Mark as ${task.status === 'pending' ? 'completed' : 'pending'}`}
        >
          {task.status === 'completed' && <span>✓</span>}
        </button>

        <div className="task-card-body">
          <div className="task-card-header">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-card-actions">
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(task)} title="Edit">✏️</button>
              <button className="btn btn-danger btn-icon btn-sm" onClick={handleDelete} title="Delete">🗑️</button>
            </div>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta">
            <span className={`badge badge-${task.priority}`}>
              {PRIORITY_ICONS[task.priority]} {task.priority}
            </span>
            <span className={`badge badge-${task.status}`}>
              {task.status === 'completed' ? '✅' : '⏳'} {task.status}
            </span>
            {task.dueDate && (
              <span className={`task-due ${overdue ? 'overdue' : ''}`}>
                📅 {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
              </span>
            )}
            {task.tags?.length > 0 && task.tags.slice(0, 2).map(tag => (
              <span key={tag} className="task-tag">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
