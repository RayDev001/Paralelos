# Backend Distribuido con Docker y NGINX

Este proyecto implementa un backend de microservicios en Node.js, orquestado con Docker Compose, balanceo de carga con NGINX y notificaciones push simuladas.  

---

## 📋 Estructura del proyecto

```
backend-distribuido/
├─ api-gateway/
│   ├─ index.js
│   ├─ package.json
│   └─ Dockerfile
├─ processor/
│   ├─ index.js
│   ├─ worker.js
│   ├─ package.json
│   └─ Dockerfile
├─ notificador/
│   ├─ index.js
│   ├─ package.json
│   └─ Dockerfile
├─ nginx/
│   ├─ nginx.conf
│   └─ Dockerfile
├─ docker-compose.yml
└─ load-test.sh
```

---

## ⚙️ Pre-requisitos

- Docker (Desktop o Engine)  
- Docker Compose V2 (incluido en Docker Desktop)  
- **Opcional:** Cuenta AWS gratuita (para despliegue en nube, ver sección “AWS” más abajo)

---

## 🚀 Arranque local

1. Clona o copia este repositorio en tu máquina.  
2. Desde la raíz del proyecto:
   ```bash
   docker compose up --build
   ```
3. Verás los logs de cada servicio iniciando.  

**Puertos expuestos**  
- API Gateway → `localhost:3000`  
- Notificador → `localhost:3002`  
- NGINX → `localhost:80`  

---

## ✅ Pruebas básicas

- **Health check Gateway**  
  ```bash
  curl http://localhost:3000/health
  # → {"status":"API Gateway está vivo"}
  ```

- **Notificador**  
  ```bash
  curl -X POST http://localhost:3002/notify     -H "Content-Type: application/json"     -d '{"deviceId":"test123","message":"¡Hola!"}'
  # En consola del notificador verás: Notificando al dispositivo test123: "¡Hola!"
  ```

---

## 🔥 Prueba de carga / balanceo

1. Dale permisos y ejecuta el script:
   ```bash
   chmod +x load-test.sh
   ./load-test.sh
   ```
2. Esto enviará **10 peticiones concurrentes** a `POST http://localhost:3000/api/facturar`.  
3. Observa en las consolas de:
   - **nginx**: respuestas con código `200`  
   - **processor / processor2**: logs de tareas recibidas y completadas  
   - **notificador**: logs de notificaciones enviadas  

---

## ☁️ Despliegue en AWS (opcional)

Si aún no tienes cuenta AWS, puedes:

1. Crear una cuenta gratuita en https://aws.amazon.com/free/  
2. Instalar y configurar AWS CLI:
   ```bash
   aws configure
   ```
3. Empaquetar y subir tus imágenes Docker a Amazon ECR o a Docker Hub:  
   ```bash
   # Ejemplo para ECR
   aws ecr create-repository --repository-name notificador
   aws ecr get-login-password | docker login --username AWS --password-stdin <tu-cuenta>.dkr.ecr.<región>.amazonaws.com
   docker build -t notificador ./notificador
   docker tag notificador:latest <tu-cuenta>.dkr.ecr.<región>.amazonaws.com/notificador:latest
   docker push <tu-cuenta>.dkr.ecr.<región>.amazonaws.com/notificador:latest
   ```
4. Desplegar en ECS (Fargate) o EC2 usando ECS CLI o Docker Compose en una instancia EC2.  
5. Configurar un Application Load Balancer apuntando al servicio **api-gateway** en el puerto 3000.  
6. En AWS API Gateway, crea un recurso `/facturar` con integración HTTP hacia la URL pública de tu Load Balancer.

> **Si prefieres no usar AWS aún**, simplemente entrega tu solución local y explica en README que la sección de nube es opcional hasta que puedas crear tu cuenta.  

---

## 📑 Evidencias de funcionamiento

Adjunta en tu entrega capturas o logs de:

- NGINX mostrando `POST /process` con estado `200`  
- Processor recibiendo `Tarea recibida: task-X` y completando con `✅`  
- Notificador imprimiendo `Notificando al dispositivo device-X…`  

---

## ✉️ Autor

**Raynick Rosario**  
Proyecto para la Materia de Ingeniería de Software – UTESA  
