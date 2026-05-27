import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  pagination: null,
  stats: { pending: 0, completed: 0, total: 0 },
  loading: false,
  submitting: false,
  filters: { status: 'all', priority: '', search: '', page: 1, limit: 10, sort: '-createdAt' },
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_SUBMITTING': return { ...state, submitting: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload.tasks, pagination: action.payload.pagination, stats: action.payload.stats, loading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks], stats: { ...state.stats, pending: state.stats.pending + 1, total: state.stats.total + 1 } };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t._id === action.payload._id ? action.payload : t) };
    case 'TOGGLE_TASK': {
      const task = action.payload;
      const oldStatus = task.status === 'completed' ? 'pending' : 'completed';
      return {
        ...state,
        tasks: state.tasks.map(t => t._id === task._id ? task : t),
        stats: { ...state.stats, [task.status]: state.stats[task.status] + 1, [oldStatus]: state.stats[oldStatus] - 1 },
      };
    }
    case 'REMOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t._id !== action.payload.id),
        stats: { ...state.stats, [action.payload.status]: state.stats[action.payload.status] - 1, total: state.stats.total - 1 },
      };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload, page: 1 } };
    case 'SET_PAGE':
      return { ...state, filters: { ...state.filters, page: action.payload } };
    default: return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async (filters) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = filters || state.filters;
      const { data } = await tasksAPI.getAll(params);
      dispatch({ type: 'SET_TASKS', payload: data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.filters]);

  const createTask = useCallback(async (taskData) => {
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    try {
      const { data } = await tasksAPI.create(taskData);
      dispatch({ type: 'ADD_TASK', payload: data.task });
      toast.success('Task created!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      return false;
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    try {
      const { data } = await tasksAPI.update(id, taskData);
      dispatch({ type: 'UPDATE_TASK', payload: data.task });
      toast.success('Task updated!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      return false;
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }, []);

  const toggleTask = useCallback(async (id) => {
    try {
      const { data } = await tasksAPI.toggle(id);
      dispatch({ type: 'TOGGLE_TASK', payload: data.task });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  }, []);

  const deleteTask = useCallback(async (id, status) => {
    try {
      await tasksAPI.delete(id);
      dispatch({ type: 'REMOVE_TASK', payload: { id, status } });
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  }, []);

  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const setPage = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  return (
    <TaskContext.Provider value={{ ...state, fetchTasks, createTask, updateTask, toggleTask, deleteTask, setFilter, setPage }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
