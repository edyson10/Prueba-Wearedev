# Task Manager - Backend

API REST para la gestión de tareas (CRUD), construida con **Node.js + Express** y **PostgreSQL**,
como parte de la prueba técnica de Desarrollador Full Stack.

## Descripción y objetivo

Expone endpoints para crear, listar, actualizar y eliminar tareas. Los endpoints de tareas están
protegidos con autenticación **JWT**: primero hay que autenticarse en `/api/auth/login` con un
usuario sembrado en la base de datos, y usar el token recibido en las siguientes peticiones.

## Tecnologías utilizadas

| Tecnología          | Versión  | Uso                                   |
|---------------------|----------|----------------------------------------|
| Node.js             | 20.x     | Runtime                                |
| Express              | 4.19     | Framework HTTP / enrutamiento          |
| Sequelize            | 6.37     | ORM contra PostgreSQL                  |
| PostgreSQL           | 16       | Base de datos relacional               |
| jsonwebtoken         | 9.x      | Generación y verificación de JWT       |
| bcryptjs             | 2.4      | Hash de contraseñas                    |
| express-validator    | 7.x      | Validación de datos de entrada         |
| swagger-jsdoc / swagger-ui-express | 6.x / 5.x | Documentación OpenAPI |
| Jest + Supertest     | 29 / 7   | Tests                                  |

## Instalación

### Requisitos previos
- Node.js 20+
- PostgreSQL 16 corriendo localmente, **o** Docker (recomendado)

### Pasos

```bash
cd backend
npm install
cp .env.example .env
```

Ajusta las variables de `.env` si tu PostgreSQL local usa otro usuario, password o puerto.

### Levantar PostgreSQL rápido con Docker (si no tienes uno local)

```bash
docker run --name tasks-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tasks_db -p 5432:5432 -d postgres:16-alpine
```

### Crear el usuario administrador (seed)

El servidor crea automáticamente el usuario administrador la primera vez que arranca
(ver `seedAdminUser()` en `src/server.js`), usando `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD`
de tu `.env` (por defecto `admin` / `Admin123!`). Es idempotente: en los arranques siguientes,
si el usuario ya existe, no hace nada. También puedes ejecutarlo manualmente:

```bash
npm run seed
```

## Ejecución en desarrollo

```bash
npm run dev
```

- API disponible en: `http://localhost:3000/api`
- Documentación Swagger: `http://localhost:3000/api-docs`
- Health check: `http://localhost:3000/health`

Las tablas se crean automáticamente al iniciar (`sequelize.sync()`), no hace falta correr
migraciones manuales para este alcance de prueba técnica.

## Ejecución con Docker (solo backend)

```bash
docker build -t task-manager-backend .
docker run -p 3000:3000 --env-file .env task-manager-backend
```

## Tests

```bash
npm test
```

Los tests de la capa de servicio corren contra **SQLite en memoria** (no requieren PostgreSQL),
para que sean rápidos y no dependan de infraestructura externa.

## Autenticación

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'
```

Respuesta:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": 1, "username": "admin" }
  }
}
```

Usa ese token en el header `Authorization: Bearer <token>` para llamar a `/api/tasks/*`.

## Endpoints

| Método | Ruta               | Descripción            | Requiere token |
|--------|--------------------|--------------------------|:--------------:|
| POST   | `/api/auth/login`  | Login, retorna JWT       | No             |
| GET    | `/api/tasks`       | Listar tareas             | Sí            |
| GET    | `/api/tasks/:id`   | Obtener tarea por id      | Sí            |
| POST   | `/api/tasks`       | Crear tarea                | Sí            |
| PUT    | `/api/tasks/:id`   | Actualizar tarea           | Sí            |
| DELETE | `/api/tasks/:id`   | Eliminar tarea             | Sí            |

### Ejemplo: crear tarea

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Comprar café","description":"Grano, para la oficina","status":"pending"}'
```

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Comprar café",
    "description": "Grano, para la oficina",
    "status": "pending",
    "createdAt": "2026-07-30T10:00:00.000Z",
    "updatedAt": "2026-07-30T10:00:00.000Z"
  }
}
```

### Formato de error de validación (400)

```json
{
  "success": false,
  "message": "Datos inválidos",
  "errors": [
    { "field": "title", "message": "El título es obligatorio" }
  ]
}
```

Ver más ejemplos y probar interactivamente en `/api-docs` (Swagger UI).

## Arquitectura y estructura de carpetas

Arquitectura en capas clásica: **routes → controllers → services → models**. Cada capa tiene una
única responsabilidad y solo conoce a la capa inmediatamente inferior:

- **routes**: define URLs, aplica middlewares (auth, validación) y delega al controller. También
  contiene las anotaciones `@openapi` que alimentan Swagger.
- **controllers**: traducen HTTP ↔ dominio. Reciben el `req`, llaman al service y arman el `res`.
  No tienen lógica de negocio.
- **services**: lógica de negocio pura. Son los únicos que hablan con los modelos de Sequelize.
  Lanzan `ApiError` cuando algo no cumple una regla de negocio (ej. tarea no encontrada).
- **models**: definición de las tablas (Sequelize).
- **middleware**: piezas transversales (autenticación JWT, validación, manejo de errores 404/500).
- **validators**: reglas de `express-validator` por endpoint, separadas de las rutas para que sean
  reutilizables y fáciles de testear.
- **utils**: `ApiError` (error tipado con status code) y `asyncHandler` (evita repetir try/catch
  en cada controller).

```
backend/
├── src/
│   ├── config/          # env, conexión a la base de datos, swagger
│   │   ├── env.js
│   │   ├── database.js
│   │   └── swagger.js
│   ├── models/           # definición de tablas (Sequelize)
│   │   ├── user.model.js
│   │   ├── task.model.js
│   │   └── index.js
│   ├── validators/       # reglas de validación de entrada (express-validator)
│   │   ├── auth.validator.js
│   │   └── task.validator.js
│   ├── middleware/        # piezas transversales
│   │   ├── auth.middleware.js       # verifica el JWT
│   │   ├── validate.middleware.js   # traduce errores de validación a 400
│   │   ├── notFound.middleware.js   # 404 para rutas inexistentes
│   │   └── error.middleware.js      # manejador central de errores
│   ├── services/          # lógica de negocio
│   │   ├── auth.service.js
│   │   └── task.service.js
│   ├── controllers/       # capa HTTP, delgada
│   │   ├── auth.controller.js
│   │   └── task.controller.js
│   ├── routes/             # definición de endpoints + documentación OpenAPI
│   │   ├── auth.routes.js
│   │   ├── task.routes.js
│   │   └── index.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   └── asyncHandler.js
│   ├── scripts/
│   │   └── seed.js         # crea el usuario admin inicial
│   ├── app.js               # configuración de Express (middlewares globales, rutas)
│   └── server.js             # punto de entrada: conecta a la BD y levanta el servidor
├── tests/
│   ├── task.service.test.js
│   └── auth.service.test.js
├── .env.example
├── Dockerfile
└── package.json
```
