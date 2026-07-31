# Task Manager - Frontend

Interfaz en **Angular** para gestionar tareas (crear, listar, editar, eliminar, cambiar estado),
como parte de la prueba técnica de Desarrollador Full Stack. Consume la API REST del backend
(Node.js + Express, ver `../backend`).

## Descripción y objetivo

Permite iniciar sesión (JWT contra el backend) y luego crear, ver, editar, filtrar/buscar y
eliminar tareas desde una interfaz responsive con Bootstrap. Usa SweetAlert2 para confirmaciones
(eliminar) y mensajes de éxito/error.

## Tecnologías utilizadas

| Tecnología    | Versión | Uso                                          |
|---------------|---------|-----------------------------------------------|
| Angular        | 18.2    | Framework (componentes standalone)            |
| TypeScript     | 5.5     | Tipado fuerte                                  |
| Bootstrap      | 5.3     | Estilos y componentes UI (modal, grid, forms)  |
| Bootstrap Icons| 1.x     | Iconografía                                    |
| SweetAlert2    | 11.x    | Alertas y confirmaciones                       |
| RxJS           | 7.8     | Observables para llamadas HTTP asíncronas      |
| Karma + Jasmine| -       | Tests unitarios                                |

## Instalación

### Requisitos previos
- Node.js 20+
- El backend corriendo (ver `../backend/README.md`)

### Pasos

```bash
cd frontend
npm install
```

## Ejecución en desarrollo

```bash
npm start
```

- Frontend disponible en: `http://localhost:4200`
- Asegúrate de que el backend esté corriendo en `http://localhost:3000` (o ajusta
  `environment.ts` si usas otro puerto/host) y que el usuario admin exista (el backend lo
  crea automáticamente al arrancar).

Usuario de prueba por defecto (definido en el `.env` del backend): `admin` / `Admin123!`.

## Build de producción

```bash
npm run build
```

Genera los archivos estáticos en `dist/frontend/browser/`.

## Tests

```bash
npm test
```

Corre los tests unitarios con Karma + Jasmine (usa `--browsers=ChromeHeadless` en un entorno
sin GUI, ej. CI).

## Ejecución con Docker (solo frontend)

```bash
docker build -t task-manager-frontend .
docker run -p 80:80 -e API_URL=http://localhost:3000/api task-manager-frontend
```

Abre `http://localhost`. La variable `API_URL` se inyecta **en tiempo de arranque del
contenedor** (no hay que reconstruir la imagen para apuntar a otro backend, ver
"Cómo se comunican backend y frontend" más abajo). Para levantar frontend + backend + base de
datos juntos, usa el `docker-compose.yml` de la raíz del repositorio.

## Arquitectura y estructura de carpetas

Componentes **standalone** (sin `NgModule`), organizados por feature, siguiendo el patrón
**smart/dumb**:

- **smart** (`pages/`): conocen los services, manejan estado y orquestan llamadas HTTP
  (ej. `TaskListPageComponent`).
- **dumb** (`components/`): reciben datos por `@Input()` y emiten eventos por `@Output()`, sin
  conocer los services (ej. `TaskTableComponent`, `TaskFormModalComponent`).

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                     # transversal a toda la app
│   │   │   ├── models/                 # interfaces TypeScript (Task, User, ApiResponse)
│   │   │   ├── services/               # AuthService, TaskService (únicos que usan HttpClient)
│   │   │   ├── interceptors/           # authInterceptor (agrega el JWT), errorInterceptor (errores HTTP)
│   │   │   └── guards/                 # authGuard (protege /tasks)
│   │   ├── layout/
│   │   │   └── navbar/                 # barra superior con usuario y logout
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   └── login/               # formulario reactivo de login (smart)
│   │   │   └── tasks/
│   │   │       ├── pages/
│   │   │       │   └── task-list-page/   # orquesta la feature de tareas (smart)
│   │   │       └── components/
│   │   │           ├── task-table/       # tabla de tareas (dumb)
│   │   │           └── task-form-modal/  # modal Bootstrap con formulario reactivo (dumb)
│   │   ├── app.component.ts             # shell raíz (navbar + router-outlet)
│   │   ├── app.config.ts                # providers globales (router, HttpClient + interceptores)
│   │   └── app.routes.ts                # rutas (login pública, /tasks protegida)
│   ├── environments/
│   │   ├── environment.ts               # desarrollo (ng serve): apiUrl fijo
│   │   └── environment.prod.ts          # producción (Docker): apiUrl vía window.__env (runtime)
│   ├── public/
│   │   └── env.js                       # valor por defecto de window.__env; se sobrescribe en Docker
│   └── styles.scss
├── Dockerfile                # build Angular -> imagen Nginx
├── nginx.conf
├── docker-entrypoint.sh       # genera env.js a partir de API_URL en cada arranque del contenedor
└── angular.json
```

