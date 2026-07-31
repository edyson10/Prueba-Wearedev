const taskService = require('../services/task.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Los controllers son deliberadamente delgados: parsean la request,
 * llaman al service y arman la response. Nada de lógica de negocio aquí.
 */

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getAllTasks();
  res.status(200).json({ success: true, data: tasks });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);
  res.status(200).json({ success: true, data: task });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.status(201).json({ success: true, data: task });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body);
  res.status(200).json({ success: true, data: task });
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id);
  res.status(200).json({ success: true, message: 'Tarea eliminada correctamente' });
});

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
