const { Sequelize } = require('sequelize');
const env = require('./env');

/**
 * Instancia única de Sequelize compartida por toda la app.
 * logging: false para no ensuciar la consola en desarrollo; se puede activar
 * temporalmente para depurar las queries generadas.
 */
const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true, // columnas en snake_case en la base de datos (created_at, etc.)
  },
});

module.exports = sequelize;
