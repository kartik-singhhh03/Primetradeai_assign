const taskService = require('../services/taskService');

const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'title is required' });
    }

    const task = await taskService.createTask(req.user.id, { title, description });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks(req.user.id, req.user.role);
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const task = await taskService.updateTask(req.params.id, req.user.id, req.user.role, {
      title,
      description,
      completed,
    });
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
