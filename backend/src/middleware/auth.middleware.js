const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

/**
 * Protege rutas exigiendo un header "Authorization: Bearer <token>".
 * Si el token es válido, cuelga el payload decodificado en req.user
 * para que los controllers sepan quién hace la petición.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Token no proporcionado'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('El token expiró, vuelve a iniciar sesión'));
    }
    return next(ApiError.unauthorized('Token inválido'));
  }
}

module.exports = authenticate;
