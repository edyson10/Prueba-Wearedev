const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Ejecuta después de los validadores de express-validator (ver validators/).
 * Si hay errores de validación, corta la petición con 400 y el detalle por campo.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const details = errors.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  next(ApiError.badRequest('Datos inválidos', details));
}

module.exports = validate;
