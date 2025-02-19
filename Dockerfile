# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install --omit=dev

# Copia el código de la aplicación
COPY . .

# Genera el cliente de Prisma dentro del contenedor
RUN npx prisma generate

# Expone el puerto en el que corre la API
EXPOSE 3000

# Comando para iniciar la API
CMD ["node", "index.js"]
