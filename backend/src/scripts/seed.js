/**
 * Wrapper de línea de comandos sobre seedAdmin.js. Uso: npm run seed
 * (Se ejecuta automáticamente también al arrancar el servidor, ver server.js)
 */
const { sequelize } = require('../models');
const seedAdminUser = require('./seedAdmin');

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const result = await seedAdminUser();
    if (result.created) {
      console.log(`Usuario creado -> username: "${result.username}"`);
    } else {
      console.log(`El usuario "${result.username}" ya existe, no se crea de nuevo.`);
    }
  } catch (error) {
    console.error('Error al ejecutar el seed:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
