/**
 * Entorno usado en el build de producción (Docker).
 *
 * A diferencia de environment.ts, la URL de la API NO queda fija en el build:
 * se lee en tiempo de ejecución desde "window.__env.apiUrl", un valor que
 * inyecta el contenedor Nginx a partir de la variable de entorno API_URL
 * (ver docker-entrypoint.sh y public/env.js). Así la MISMA imagen Docker
 * sirve tanto para apuntar a un backend local como a uno en AWS EC2,
 * sin tener que reconstruir el frontend por cada entorno.
 */
declare global {
  interface Window {
    __env?: { apiUrl?: string };
  }
}

export const environment = {
  production: true,
  apiUrl: window.__env?.apiUrl || 'http://localhost:3000/api',
};
