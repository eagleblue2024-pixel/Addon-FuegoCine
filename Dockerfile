FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package.json ./
RUN npm install --omit=dev

# Copiar archivos de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 7000

ENV NODE_ENV=production
ENV PORT=7000

CMD ["node", "index.js"]
