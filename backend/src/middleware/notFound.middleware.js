const ApiError = require('../utils/ApiError');

/**
 * Se ejecuta cuando ninguna ruta coincidió con la petición.
 * Debe registrarse después de todas las rutas y antes del errorHandler.
 */
function notFound(req, res, next) {
  next(ApiError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
