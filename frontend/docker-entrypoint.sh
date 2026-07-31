#!/bin/sh
set -e

# Genera public/env.js con la URL del backend en tiempo de arranque del contenedor,
# a partir de la variable de entorno API_URL. Esto permite usar la MISMA imagen Docker
# tanto en local como en AWS EC2: solo cambia la variable de entorno al hacer "docker run"
# o en el docker-compose.yml, sin tener que reconstruir el frontend.
: "${API_URL:=http://localhost:3000/api}"

cat > /usr/share/nginx/html/env.js <<EOF
window.__env = {
  apiUrl: "${API_URL}"
};
EOF

echo "Frontend configurado con API_URL=${API_URL}"

exec "$@"
