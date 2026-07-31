# Task Manager - Prueba Técnica Full Stack

Aplicación full-stack de gestión de tareas (CRUD) con autenticación JWT, construida con
**Angular** (frontend) y **Node.js + Express + PostgreSQL** (backend), como parte de una prueba
técnica de Desarrollador Full Stack.

Cada parte tiene su propio README con el detalle técnico:

- [`backend/README.md`](./backend/README.md) — API REST, arquitectura en capas, endpoints, tests.
- [`frontend/README.md`](./frontend/README.md) — Angular, componentes, arquitectura, tests.

Este README cubre la vista general del proyecto y **cómo levantar todo junto con Docker**
(local y en una instancia EC2 de AWS).

## Funcionalidades implementadas

- CRUD completo de tareas (crear, listar, ver, editar, eliminar, cambiar estado).
- Autenticación con JWT (login contra un usuario sembrado en la base de datos).
- Validación de datos en backend (express-validator) y frontend (Reactive Forms).
- Manejo de errores robusto y diferenciado por tipo (400/401/404/500/timeout/sin conexión).
- Documentación de la API con Swagger/OpenAPI (`/api-docs`).
- Indicadores de carga, confirmación antes de eliminar y mensajes de éxito/error con SweetAlert2.
- Filtro por estado y búsqueda por texto en el listado de tareas.
- Persistencia en PostgreSQL.
- Tests unitarios en backend (Jest) y frontend (Karma/Jasmine).
- Todo dockerizado: imágenes independientes para backend y frontend, más un `docker-compose.yml`
  que levanta los 3 servicios (base de datos, backend, frontend) listos para producción.

## Arquitectura general

```
┌─────────────┐      HTTP/JSON (JWT)      ┌─────────────┐      SQL       ┌─────────────┐
│  Frontend   │ ────────────────────────▶ │   Backend   │ ─────────────▶ │ PostgreSQL  │
│  (Angular   │                            │ (Express +  │                │             │
│  + Nginx)   │ ◀──────────────────────── │  Sequelize) │ ◀───────────── │             │
└─────────────┘                            └─────────────┘                └─────────────┘
```

El frontend nunca habla directamente con la base de datos: todo pasa por la API REST del
backend, que valida, aplica las reglas de negocio y persiste en PostgreSQL vía Sequelize.

## Tecnologías (versiones)

| Capa      | Tecnología                                                        |
|-----------|---------------------------------------------------------------------|
| Frontend  | Angular 18, TypeScript 5.5, Bootstrap 5.3, SweetAlert2 11           |
| Backend   | Node.js 20, Express 4.19, Sequelize 6.37, JWT, express-validator    |
| Base de datos | PostgreSQL 16                                                    |
| Infraestructura | Docker, Docker Compose, Nginx (para servir el frontend)        |

## Opción 1: Levantar todo con Docker Compose (recomendado)

Requiere tener Docker y Docker Compose instalados. Este es el flujo pensado tanto para probar
en tu máquina local como para desplegar en una instancia EC2 de AWS.

```bash
git clone https://github.com/edyson10/Prueba-Wearedev.git
cd Prueba-Wearedev
cp .env.example .env
```

Edita `.env` si es necesario (ver comentarios dentro del archivo; los valores por defecto ya
funcionan para probar en local). Luego:

```bash
docker compose up -d --build
```

Esto levanta:

- **PostgreSQL** (`postgres`, puerto interno 5432, no expuesto al host)
- **Backend** (`backend`, puerto `3000`) — crea las tablas y el usuario admin automáticamente
  al arrancar (no hace falta correr ningún script manual).
- **Frontend** (`frontend`, puerto `80`) — servido por Nginx.

Verifica que todo esté arriba:

```bash
docker compose ps
curl http://localhost:3000/health      # {"status":"ok"}
```

Abre `http://localhost` en el navegador. Usuario de prueba (definido en `.env`):
`admin` / `Admin123!`.

Para bajar todo (y borrar los datos de PostgreSQL):

```bash
docker compose down -v
```

### Desplegar en una instancia EC2 de AWS

> Esta instancia ya está creada — IP pública **34.230.89.199**. El `.env.example` de este
> repositorio ya viene configurado con esa IP en `CORS_ORIGIN` y `API_URL`, así que en el paso 4
> solo hace falta copiar el archivo, sin editar nada (salvo que quieras cambiar los secretos).

1. Crea una instancia EC2 (Ubuntu 22.04+ recomendado) con un Security Group que permita entrada
   en los puertos **22** (SSH), **80** (frontend) y **3000** (API backend).
2. Conéctate por SSH e instala Docker y Docker Compose:
   ```bash
   sudo yum update -y 
   sudo yum install docker -y
   sudo systemctl enable docker
   sudo systemctl start docker
   sudo systemctl status docker
   ```
3. Clona el repositorio y configura el `.env`:
   ```bash
   git clone https://github.com/edyson10/Prueba-Wearedev.git
   cd Prueba-Wearedev
   cp .env.example .env
   ```
4. Revisa `.env`: `CORS_ORIGIN` y `API_URL` ya apuntan a `http://34.230.89.199` (la IP pública de
   esta instancia). Si en el futuro cambias de instancia o IP, estas son las **dos únicas
   variables** que hay que actualizar (son las que cambian entre local y AWS):
   ```env
   CORS_ORIGIN=http://34.230.89.199
   API_URL=http://34.230.89.199:3000/api
   ```
   También es recomendable cambiar `JWT_SECRET`, `DB_PASSWORD` y `SEED_ADMIN_PASSWORD` por
   valores propios antes de exponer la instancia a internet (los valores del `.env.example`
   son solo para desarrollo/pruebas).
5. Levanta todo:
   ```bash
   docker compose up -d --build
   ```
6. Abre `http://34.230.89.199` en el navegador. La documentación de la API queda en
   `http://34.230.89.199:3000/api-docs`, para validar que todo este ok `http://34.230.89.199:3000/health`,
  para ingresar al frontend,
  hacer pruebas `http://34.230.89.199/login`.