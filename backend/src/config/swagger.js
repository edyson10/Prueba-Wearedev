const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description:
        'API REST para gestión de tareas (prueba técnica). Incluye autenticación JWT: ' +
        'primero llama a /api/auth/login para obtener un token y luego úsalo con el botón ' +
        '"Authorize" de esta página para probar los endpoints de /api/tasks.',
    },
    servers: [{ url: `http://localhost:${env.port}`, description: 'Servidor local' }],
  },
  // Swagger lee los comentarios @openapi directamente desde los archivos de rutas
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
