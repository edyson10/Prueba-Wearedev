require('dotenv').config();

/**
 * Punto único de lectura de variables de entorno.
 * Si falta una variable obligatoria en producción, el servidor no debe levantar
 * (evita bugs silenciosos por config incompleta en el despliegue).
 */
const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'tasks_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },

  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',

  seedAdmin: {
    username: process.env.SEED_ADMIN_USERNAME || 'admin',
    password: process.env.SEED_ADMIN_PASSWORD || 'Admin123!',
  },
};

const REQUIRED_IN_PRODUCTION = ['JWT_SECRET', 'DB_PASSWORD'];

if (env.nodeEnv === 'production') {
  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno obligatorias en producción: ${missing.join(', ')}`);
  }
}

module.exports = env;
