# 1. Seleccionamos una “imagen base” ligera de Node.js
FROM node:18-alpine

# 2. Creamos una carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiamos package.json y package-lock.json para luego instalar dependencias
COPY package.json ./

# 4. Instalamos las dependencias (solo las de production)
RUN npm install --production

# 5. Copiamos el resto del código fuente
COPY . .

# 6. Exponemos el puerto en el que corre el servidor
EXPOSE 3002

# 7. Comando para iniciar la aplicación
CMD ["npm", "start"]
