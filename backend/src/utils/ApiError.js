/**
 * Error de aplicación con código HTTP asociado.
 * Los services/controllers lanzan esto en vez de un Error genérico, así el
 * middleware de errores sabe qué status code responder.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details; // ej: lista de errores de validación por campo
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details = null) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'No autorizado') {
    return new ApiError(401, message);
  }

  static notFound(message = 'Recurso no encontrado') {
    return new ApiError(404, message);
  }

  static conflict(message) {
    return new ApiError(409, message);
  }

  static internal(message = 'Error interno del servidor') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
