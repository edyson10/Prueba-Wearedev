/**
 * Tests de la capa de servicio de tareas.
 * Usamos SQLite en memoria en vez de PostgreSQL para que los tests
 * corran rápido y sin depender de una base de datos externa.
 */
jest.mock('../src/config/database', () => {
  const { Sequelize } = require('sequelize');
  return new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
});

const { sequelize, Task } = require('../src/models');
const taskService = require('../src/services/task.service');

beforeAll(async () => {
  await sequelize.sync();
});

afterEach(async () => {
  await Task.destroy({ where: {}, truncate: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('task.service', () => {
  it('createTask crea una tarea con status "pending" por defecto', async () => {
    const task = await taskService.createTask({ title: 'Comprar café' });

    expect(task.id).toBeDefined();
    expect(task.title).toBe('Comprar café');
    expect(task.status).toBe('pending');
  });

  it('getTaskById lanza un ApiError 404 si la tarea no existe', async () => {
    await expect(taskService.getTaskById(9999)).rejects.toMatchObject({ statusCode: 404 });
  });

  it('getAllTasks retorna todas las tareas creadas', async () => {
    await taskService.createTask({ title: 'Tarea 1' });
    await taskService.createTask({ title: 'Tarea 2' });

    const tasks = await taskService.getAllTasks();
    expect(tasks).toHaveLength(2);
  });

  it('updateTask actualiza el status de una tarea existente', async () => {
    const task = await taskService.createTask({ title: 'Tarea a completar' });

    const updated = await taskService.updateTask(task.id, { status: 'done' });

    expect(updated.status).toBe('done');
  });

  it('deleteTask elimina la tarea de la base de datos', async () => {
    const task = await taskService.createTask({ title: 'Tarea a borrar' });

    await taskService.deleteTask(task.id);

    await expect(taskService.getTaskById(task.id)).rejects.toMatchObject({ statusCode: 404 });
  });
});
