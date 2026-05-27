const express = require('express');
const router = express.Router();
const {
  getTasks, getTask, createTask, updateTask,
  toggleStatus, deleteTask, deleteCompleted,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskRules, validate } = require('../middleware/validate');

// All task routes are protected
router.use(protect);

/**
 * @route   GET    /api/tasks       - Get all tasks (with filters, pagination, search)
 * @route   POST   /api/tasks       - Create a new task
 */
router.route('/')
  .get(getTasks)
  .post(taskRules, validate, createTask)
  .delete(deleteCompleted);

/**
 * @route   GET    /api/tasks/:id   - Get single task
 * @route   PUT    /api/tasks/:id   - Update task
 * @route   DELETE /api/tasks/:id   - Delete task
 */
router.route('/:id')
  .get(getTask)
  .put(taskRules, validate, updateTask)
  .delete(deleteTask);

/**
 * @route   PATCH  /api/tasks/:id/toggle - Toggle task status
 */
router.patch('/:id/toggle', toggleStatus);

module.exports = router;
