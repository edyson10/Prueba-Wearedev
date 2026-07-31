const { body } = require('express-validator');

const loginValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El usuario es obligatorio'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
];

module.exports = { loginValidator };
