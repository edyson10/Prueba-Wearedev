const { body, param } = require('express-validator');
const { TASK_STATUSES } = require('../models/task.model');

const idParamValidator = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'),
];

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ min: 1, max: 100 })
    .withMessage('El título debe tener entre 1 y 100 caracteres'),
  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 500 })
    .withMessage('La descripción no puede superar los 500 caracteres'),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`El status debe ser uno de: ${TASK_STATUSES.join(', ')}`),
];

const updateTaskValidator = [
  ...idParamValidator,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El título debe tener entre 1 y 100 caracteres'),
  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 500 })
    .withMessage('La descripción no puede superar los 500 caracteres'),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`El status debe ser uno de: ${TASK_STATUSES.join(', ')}`),
];

module.exports = {
  idParamValidator,
  createTaskValidator,
  updateTaskValidator,
};
