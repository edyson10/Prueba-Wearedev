const { Task } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Capa de servicio: contiene la lógica de negocio y es la única que habla
 * con el modelo de Sequelize. Los controllers no acceden a los modelos directamente.
 */

async function getAllTasks() {
  return Task.findAll({ order: [['createdAt', 'DESC']] });
}

async function getTaskById(id) {
  const task = await Task.findByPk(id);
  if (!task) {
    throw ApiError.notFound(`No existe una tarea con id ${id}`);
  }
  return task;
}

async function createTask({ title, description, status }) {
  return Task.create({ title, description, status });
}

async function updateTask(id, data) {
  const task = await getTaskById(id);
  await task.update(data);
  return task;
}

async function deleteTask(id) {
  const task = await getTaskById(id);
  await task.destroy();
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
