const Task = require('../models/Task');

// @route GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const query = { user: req.user._id };

    if (status && status !== 'all') query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
      Task.countDocuments(query),
    ]);

    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statsMap = { pending: 0, completed: 0 };
    stats.forEach((s) => { statsMap[s._id] = s.count; });

    res.json({
      success: true,
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
      stats: { ...statsMap, total: statsMap.pending + statsMap.completed },
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, tags } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate || null,
      tags: tags || [],
      user: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Task created.', task });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, status, priority, dueDate, tags },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, message: 'Task updated.', task });
  } catch (error) {
    next(error);
  }
};

// @route PATCH /api/tasks/:id/toggle
const toggleStatus = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();
    res.json({ success: true, message: `Task marked as ${task.status}.`, task });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, message: 'Task deleted.' });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/tasks (bulk delete completed)
const deleteCompleted = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({ user: req.user._id, status: 'completed' });
    res.json({ success: true, message: `${result.deletedCount} completed task(s) deleted.` });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, toggleStatus, deleteTask, deleteCompleted };
