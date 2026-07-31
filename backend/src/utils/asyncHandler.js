/**
 * Envuelve un controller async para que cualquier excepción caiga
 * automáticamente en next(err) sin tener que repetir try-catch en cada uno.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
