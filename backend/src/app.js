const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Este backend se sirve por HTTP plano (sin TLS) en la EC2, así que se desactivan dos cosas que
// helmet activa por defecto y que le dicen al navegador "usa https para todo en este sitio":
// - hsts: manda el header Strict-Transport-Security.
// - contentSecurityPolicy.upgrade-insecure-requests: reescribe a https:// cualquier recurso
//   http:// que la página pida (ej. los assets de Swagger UI en /api-docs).
// Con cualquiera de los dos activo, el navegador intenta https://<host>:3000/... y falla con
// ERR_SSL_PROTOCOL_ERROR porque no hay nada escuchando TLS en ese puerto.
// Si en el futuro se agrega HTTPS real (ej. Nginx + certificado delante del backend), se puede
// volver a habilitar ambos.
app.use(
  helmet({
    hsts: false,
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'upgrade-insecure-requests': null,
      },
    },
  })
);
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

// El orden importa: primero 404 para rutas no encontradas, luego el manejador de errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;
