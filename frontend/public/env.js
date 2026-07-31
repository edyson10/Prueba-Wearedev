// Valor por defecto para desarrollo/build local sin Docker.
// En el contenedor Docker, docker-entrypoint.sh SOBRESCRIBE este archivo
// usando la variable de entorno API_URL antes de arrancar Nginx.
window.__env = {
  apiUrl: 'http://localhost:3000/api',
};
