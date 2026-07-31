const { ValidationError, UniqueConstraintError } = require('sequelize');
const ApiError = require('../utils/ApiError');

/**
 * Middleware central de errores. Todo error (lanzado con next(err) o por
 * asyncHandler) termina aquí. Normaliza la respuesta y decide el status code.
 * Debe registrarse SIEMPRE al final de app.js, después de las rutas.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Errores de validación propios de Sequelize (por si se guarda sin pasar por express-validator)
  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details || undefined,
    });
  }

  // Error no controlado: se loguea completo en servidor pero no se expone al cliente
  console.error('[UNHANDLED ERROR]', err);
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
  });
}

module.exports = errorHandler;
