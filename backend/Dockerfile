# Imagen liviana de Node basada en Alpine
FROM node:20-alpine

WORKDIR /app

# Copiamos primero package*.json para aprovechar la cache de Docker:
# si no cambian las dependencias, no se vuelve a correr "npm install" en cada build.
COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/server.js"]
