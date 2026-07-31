const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');
const seedAdminUser = require('./scripts/seedAdmin');

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente.');

    // sync() crea las tablas si no existen todavía; en un proyecto con más
    // tiempo esto se reemplazaría por migraciones (sequelize-cli).
    await sequelize.sync();
    console.log('Modelos sincronizados con la base de datos.');

    // Idempotente: en el primer arranque crea el usuario admin; en los siguientes no hace nada.
    // Así "docker compose up" deja todo listo para usar sin pasos manuales adicionales.
    const seedResult = await seedAdminUser();
    if (seedResult.created) {
      console.log(`Usuario administrador creado: "${seedResult.username}"`);
    }

    app.listen(env.port, () => {
      console.log(`Servidor escuchando en http://localhost:${env.port}`);
      console.log(`Documentación Swagger en http://localhost:${env.port}/api-docs`);
    });
  } catch (error) {
    console.error('No fue posible iniciar el servidor:', error.message);
    process.exit(1);
  }
}

start();
