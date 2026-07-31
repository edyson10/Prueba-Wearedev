const { User } = require('../models');
const env = require('../config/env');
const authService = require('../services/auth.service');

/**
 * Crea el usuario administrador si todavía no existe. Es idempotente a propósito:
 * tanto "npm run seed" (uso manual) como el arranque del servidor (docker-compose en EC2)
 * la llaman, y no debe fallar ni duplicar el usuario si ya fue creado antes.
 */
async function seedAdminUser() {
  const existing = await User.findOne({ where: { username: env.seedAdmin.username } });
  if (existing) {
    return { created: false, username: env.seedAdmin.username };
  }

  await authService.createUser(env.seedAdmin.username, env.seedAdmin.password);
  return { created: true, username: env.seedAdmin.username };
}

module.exports = seedAdminUser;
