import React, { useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import useForm from '../../hooks/useForm';
import { validateTask } from '../../utils/validation';
import './TaskModal.css';

const emptyTask = { title: '', description: '', priority: 'medium', dueDate: '', tags: '' };

const TaskModal = ({ task, onClose }) => {
  const { createTask, updateTask, submitting } = useTasks();
  const isEditing = Boolean(task);

  const initialValues = isEditing
    ? {
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        tags: task.tags?.join(', ') || '',
        status: task.status,
      }
    : emptyTask;

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, reset } = useForm(
    initialValues,
    validateTask
  );

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      title: data.title.trim(),
      description: data.description.trim(),
      priority: data.priority,
      dueDate: data.dueDate || null,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      ...(isEditing && { status: data.status }),
    };
    const success = isEditing ? await updateTask(task._id, payload) : await createTask(payload);
    if (success) { reset(); onClose(); }
  });

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal task-modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              className={`form-input ${touched.title && errors.title ? 'error' : ''}`}
              name="title" value={values.title}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="What needs to be done?" autoFocus
            />
            {touched.title && errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              name="description" value={values.description}
              onChange={handleChange}
              placeholder="Add more details (optional)..."
              rows={3}
            />
          </div>

          <div className="task-modal-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-input" name="priority" value={values.priority} onChange={handleChange}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            {isEditing && (
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" name="status" value={values.status} onChange={handleChange}>
                  <option value="pending">⏳ Pending</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                className="form-input"
                type="date" name="dueDate" value={values.dueDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Tags <span style={{ color: 'var(--text-subtle)' }}>(comma separated)</span></label>
            <input
              className="form-input"
              name="tags" value={values.tags}
              onChange={handleChange}
              placeholder="work, design, urgent"
            />
          </div>

          <div className="task-modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Saving…</> : (isEditing ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
