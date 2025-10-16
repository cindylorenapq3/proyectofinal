# 📝 TaskApp - Sistema de Gestión de Tareas Full Stack

Aplicación web completa para gestionar tareas con autenticación de usuarios, construida con Angular (Frontend) y Node.js/Express/MongoDB (Backend).

![Estado del Proyecto](https://img.shields.io/badge/Estado-Completo-success)
![Angular](https://img.shields.io/badge/Angular-17%2B-red)
![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-brightgreen)

---

## 🚀 Inicio Rápido

### 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v14 o superior ([Descargar](https://nodejs.org/))
- **MongoDB** v4.4 o superior ([Descargar](https://www.mongodb.com/try/download/community))
- **Angular CLI** v15 o superior
- **Git** (opcional)

Verifica las instalaciones:

```bash
node --version
npm --version
mongod --version
ng version
```

---

## 📦 Instalación

### 1️⃣ Clonar o Descargar el Proyecto

```bash
# Si usas Git
git clone https://github.com/tu-usuario/taskapp-proyecto-final.git
cd taskapp-proyecto-final

# O descomprime el ZIP descargado
```

### 2️⃣ Instalar Dependencias del Backend

```bash
cd backend
npm install
cd ..
```

### 3️⃣ Instalar Dependencias del Frontend

```bash
cd frontend
npm install
cd ..
```

---

## ⚙️ Configuración

### Backend - Variables de Entorno

Crea el archivo `backend/.env` con:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskapp
JWT_SECRET=tu_clave_secreta_super_segura_123
JWT_EXPIRES_IN=7d
```

> ⚠️ **Importante**: Cambia `JWT_SECRET` por una clave segura en producción.

### Frontend - Variables de Entorno

El archivo `frontend/src/environments/environment.ts` ya está configurado:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## 🎬 Ejecución

### Opción A: Ejecutar Manualmente (2 Terminales)

#### Terminal 1 - Backend:

```bash
# 1. Iniciar MongoDB
mongod

# O en Windows (en otra terminal):
net start MongoDB

# 2. Iniciar el backend
cd backend
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en puerto 3000
✅ Conectado a MongoDB
```

#### Terminal 2 - Frontend:

```bash
cd frontend
ng serve
```

Deberías ver:
```
✔ Browser application bundle generation complete.
✔ Compiled successfully.

  ➜  Local:   http://localhost:4200/
```


## 🌐 Acceso a la Aplicación

Una vez todo esté corriendo:

1. **Frontend**: Abre tu navegador en `http://localhost:4200/`
2. **Backend API**: `http://localhost:3000/`
3. **MongoDB**: Puerto 27017 (localhost)

---

## 👤 Primer Uso

### 1. Registrar un Usuario

1. Ve a `http://localhost:4200/`
2. Click en **"Registrarse"**
3. Completa el formulario:
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Contraseña: mínimo 6 caracteres
4. Click en **"Crear Cuenta"**

### 2. Explorar la Aplicación

- **Dashboard**: Ver, crear, editar y eliminar tareas
- **Perfil**: Actualizar tu información personal
- **Tareas**: Marcar como completadas, asignar prioridades, fechas límite

---

## 📁 Estructura del Proyecto

```
taskapp-proyecto-final/
│
├── backend/                    # Servidor Node.js/Express
│   ├── models/                # Modelos de MongoDB (User, Task)
│   ├── routes/                # Rutas de la API (auth, tasks, users)
│   ├── middleware/            # Middleware de autenticación
│   ├── server.js              # Punto de entrada del servidor
│   ├── .env                   # Variables de entorno (NO SUBIR A GIT)
│   ├── package.json
│   └── README.md
│
├── frontend/                   # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Componentes (navbar, login, dashboard, etc.)
│   │   │   ├── services/     # Servicios (auth, task, user)
│   │   │   ├── guards/       # Guards de autenticación
│   │   │   ├── interceptors/ # Interceptores HTTP
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── environments/     # Configuración de entornos
│   │   ├── styles.css        # Estilos globales
│   │   └── main.ts           # Punto de entrada
│   ├── angular.json
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md                   # Este archivo
```

---

## 🔑 Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/registro` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/perfil` | Obtener perfil (requiere token) |

### Tareas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks` | Listar todas las tareas del usuario |
| GET | `/api/tasks/:id` | Obtener una tarea específica |
| POST | `/api/tasks` | Crear nueva tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |
| PATCH | `/api/tasks/:id/toggle` | Cambiar estado completada |

### Usuario

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| PUT | `/api/users/perfil` | Actualizar perfil |
| PUT | `/api/users/password` | Cambiar contraseña |

> 🔒 Todas las rutas excepto registro y login requieren token JWT en el header `Authorization: Bearer {token}`

---

## 🧪 Probar la API con cURL

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test User","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Crear tarea (reemplaza {TOKEN} con el token obtenido del login)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{"titulo":"Mi primera tarea","descripcion":"Descripción","prioridad":"alta"}'
```

---

## 🛠️ Comandos Útiles

### Backend

```bash
cd backend

# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Ver logs en tiempo real
npm run dev | grep "error"
```

### Frontend

```bash
cd frontend

# Desarrollo
ng serve

# Puerto específico
ng serve --port 4200

# Abrir en navegador automáticamente
ng serve --open

# Build para producción
ng build --configuration production

# Ejecutar tests
ng test
```

### MongoDB

```bash
# Iniciar MongoDB
mongod

# Windows - Servicio
net start MongoDB
net stop MongoDB

# Linux/Mac - Servicio
sudo systemctl start mongod
sudo systemctl stop mongod
sudo systemctl status mongod

# Conectar con MongoDB Compass
mongodb://localhost:27017/taskapp
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"

```bash
# Verificar que MongoDB esté corriendo
mongod --version

# Iniciar MongoDB
mongod

# O como servicio (Windows)
net start MongoDB
```

### Error: "Port 3000 already in use"

```bash
# Cambiar puerto en backend/.env
PORT=3001

# O encontrar y matar el proceso en Windows
netstat -ano | findstr :3000
taskkill /PID {número_PID} /F
```

### Error: "Zone.js required"

```bash
cd frontend

# Limpiar cache
rm -rf .angular
rm -rf node_modules/.vite

# Reinstalar
npm install

# Ejecutar
ng serve
```

### Error: CORS

El backend ya tiene CORS habilitado. Si tienes problemas, verifica `backend/server.js`:

```javascript
app.use(cors());
```

### Frontend en blanco

1. Abre DevTools (F12)
2. Ve a la consola
3. Busca errores
4. Verifica que `main.ts` tenga `import 'zone.js';`

---

## 📊 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas

### Frontend
- **Angular 17+** - Framework frontend
- **TypeScript** - Lenguaje tipado
- **RxJS** - Programación reactiva
- **Angular Router** - Navegación
- **Reactive Forms** - Formularios
- **HttpClient** - Peticiones HTTP

---

## ✨ Características

### Funcionalidades Principales

✅ **Autenticación Completa**
- Registro de usuarios
- Inicio de sesión
- JWT para sesiones seguras
- LocalStorage para persistencia

✅ **Gestión de Tareas**
- Crear, editar, eliminar tareas
- Marcar como completada
- Sistema de prioridades (baja, media, alta)
- Fechas de vencimiento
- Contador de tareas completadas/pendientes

✅ **Perfil de Usuario**
- Actualizar información personal
- Cambiar contraseña
- Avatar personalizable
- Biografía

✅ **Seguridad**
- Contraseñas encriptadas con bcrypt
- Tokens JWT con expiración
- Rutas protegidas con guards
- Validaciones en frontend y backend

✅ **UI/UX**
- Diseño responsive (mobile-first)
- Interfaz moderna y limpia
- Mensajes de feedback
- Validaciones en tiempo real

---

## 📝 Requisitos del Proyecto (Cumplidos)

### ✅ Estructura General
- ✅ Carpetas separadas `/backend` y `/frontend`
- ✅ Archivos de configuración propios
- ✅ README en cada carpeta

### ✅ Enrutamiento en Angular
- ✅ 5 vistas (Inicio, Login, Registro, Dashboard, Perfil)
- ✅ RouterModule configurado
- ✅ router-outlet implementado

### ✅ Componentes y Servicios
- ✅ 6 componentes personalizados
- ✅ 3 servicios con HttpClient
- ✅ Conexión a endpoints del backend

### ✅ Formularios
- ✅ Formularios reactivos
- ✅ Validaciones completas
- ✅ Mensajes de éxito/error

### ✅ Autenticación y LocalStorage
- ✅ Token en localStorage
- ✅ Recuperación de datos del usuario
- ✅ AuthGuard implementado

### ✅ Comunicación con Backend
- ✅ HTTP con endpoints RESTful
- ✅ CRUD completo
- ✅ Data binding y directivas

---

## 🚀 Despliegue (Opcional)

### Backend - Railway/Heroku

1. Crear cuenta en Railway.app
2. Conectar repositorio
3. Configurar variables de entorno
4. Desplegar automáticamente

### Frontend - Netlify/Vercel

```bash
# Build
cd frontend
ng build --configuration production

# Los archivos estarán en dist/
# Subir carpeta dist/ a Netlify/Vercel
```

### Base de Datos - MongoDB Atlas

1. Crear cluster gratuito en MongoDB Atlas
2. Obtener connection string
3. Actualizar MONGODB_URI en .env

---

## 👨‍💻 Autor

**Lorena**  
Proyecto Final - Diplomado Full Stack

---

## 📄 Licencia

Este proyecto fue desarrollado como proyecto final del Diplomado Full Stack.

---

## 🎓 Recursos Adicionales

- [Documentación Angular](https://angular.io/docs)
- [Documentación Express](https://expressjs.com/)
- [Documentación MongoDB](https://www.mongodb.com/docs/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [JWT.io](https://jwt.io/)

---

