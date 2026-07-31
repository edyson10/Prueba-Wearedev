const { Router } = require('express');
const taskController = require('../controllers/task.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  idParamValidator,
  createTaskValidator,
  updateTaskValidator,
} = require('../validators/task.validator');

const router = Router();

// Todas las rutas de tareas requieren estar autenticado con JWT
router.use(authenticate);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Comprar café
 *         description:
 *           type: string
 *           example: Traer café en grano para la oficina
 *         status:
 *           type: string
 *           enum: [pending, in_progress, done]
 *           example: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TaskInput:
 *       type: object
 *       required: [title]
 *       properties:
 *         title:
 *           type: string
 *           example: Comprar café
 *         description:
 *           type: string
 *           example: Traer café en grano para la oficina
 *         status:
 *           type: string
 *           enum: [pending, in_progress, done]
 *           example: pending
 */

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Listar todas las tareas
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de tareas
 *       401:
 *         description: Token faltante o inválido
 *   post:
 *     tags: [Tasks]
 *     summary: Crear una nueva tarea
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Tarea creada
 *       400:
 *         description: Datos inválidos
 */
router.get('/', taskController.getAllTasks);
router.post('/', createTaskValidator, validate, taskController.createTask);

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Obtener una tarea por id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Tarea encontrada }
 *       404: { description: Tarea no encontrada }
 *   put:
 *     tags: [Tasks]
 *     summary: Actualizar una tarea existente
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200: { description: Tarea actualizada }
 *       400: { description: Datos inválidos }
 *       404: { description: Tarea no encontrada }
 *   delete:
 *     tags: [Tasks]
 *     summary: Eliminar una tarea
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Tarea eliminada }
 *       404: { description: Tarea no encontrada }
 */
router.get('/:id', idParamValidator, validate, taskController.getTaskById);
router.put('/:id', updateTaskValidator, validate, taskController.updateTask);
router.delete('/:id', idParamValidator, validate, taskController.deleteTask);

module.exports = router;
