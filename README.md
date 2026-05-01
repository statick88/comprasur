# 🩺 Comprasur — Insumos Médicos

Aplicación móvil para la gestión y compra de insumos médicos, construida con **Expo (React Native)** + **Node.js/Express** + **PostgreSQL** + **Supabase**.

---

## 📋 Requisitos previos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js | 20+ |
| Docker / Colima + Docker Compose | cualquier versión reciente |
| Expo Go (dispositivo) | última versión en App Store / Play Store |
| Git | cualquier versión |

---

## 🚀 Inicio rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/statick88/comprasur.git
cd Comprasur
```

### 2. Configurar variables de entorno

**Frontend** (raíz del proyecto):
```bash
cp .env.example .env
```

Edita `.env` y completa:
```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
EXPO_PUBLIC_API_HOST=localhost        # IP de tu máquina si usas dispositivo físico
```

> ⚠️ **Dispositivo físico**: cambia `EXPO_PUBLIC_API_HOST` a la IP local de tu máquina (ej. `192.168.1.100`). Puedes obtenerla con `ipconfig` (Windows) o `ifconfig` / `ip a` (Mac/Linux).

**Backend**:
```bash
cp backend/.env.example backend/.env
```

El archivo `backend/.env` ya tiene valores por defecto para desarrollo local. Solo necesitas cambiar las credenciales de PayPal si quieres probar pagos.

### 3. Levantar el backend

```bash
colima start                # Solo si usas Colima
docker compose up -d        # Levanta PostgreSQL + API desde la raíz
cd backend
npm install
npm run db:init             # Crea tablas y carga datos de prueba
```

> Si ya levantaste el servicio `api` con `docker compose up -d`, no necesitas ejecutar `npm start` localmente.

Verifica que el backend esté corriendo:
```bash
curl http://localhost:3000/health
# {"status":"ok","timestamp":"..."}
```

### 4. Instalar dependencias del frontend

```bash
# Desde la raíz del proyecto
npm install
```

### 5. Iniciar la app

```bash
npx expo start
```

Escanea el QR con **Expo Go** en tu dispositivo, o presiona:
- `a` → Android emulator
- `i` → iOS simulator (solo macOS)
- `w` → navegador web

---

## 🗂️ Estructura del proyecto

```
comprasur/
├── App.tsx                    # Entry point
├── src/
│   ├── screens/
│   │   ├── auth/LoginScreen.tsx        # Inicio de sesión (Google + email + invitado)
│   │   ├── catalog/CatalogScreen.tsx   # Catálogo de productos
│   │   ├── cart/CartScreen.tsx         # Carrito de compras
│   │   ├── chat/ChatScreen.tsx         # Chat en tiempo real (Supabase Realtime)
│   │   ├── account/AccountScreen.tsx   # Perfil de usuario
│   │   └── product/ProductInfoScreen.tsx # Detalle de producto
│   ├── store/                 # Estado global (Zustand)
│   ├── data/                  # API client y datos mock
│   ├── lib/                   # Supabase client, Cloudinary
│   ├── components/            # Componentes reutilizables
│   └── navigation/            # React Navigation
├── backend/
│   ├── src/
│   │   ├── index.js           # Servidor Express
│   │   ├── routes/            # Rutas de productos y órdenes
│   │   └── db/init.js         # Inicialización de base de datos
│   └── .env.example
├── docker-compose.yml       # PostgreSQL + API para desarrollo local
└── specs/
    ├── app.spec.ts            # Configuración de la app
    └── app.spec.test.ts       # Tests de configuración
```

---

## 🔑 Configurar Supabase (para auth y chat en tiempo real)

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **Settings → API** y copia:
   - `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
   - `anon public` key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Para Google OAuth: ve a **Authentication → Providers → Google** y actívalo
4. El chat usa **Realtime Broadcast** — no requiere configuración adicional en Supabase

---

## 🧪 Ejecutar tests

```bash
# Frontend
npm test

# Backend
cd backend && npm test
```

---

## 🐳 Docker Compose (API + base de datos)

El `docker-compose.yml` en la **raíz del proyecto** es compatible con Docker y Colima, y levanta PostgreSQL + API:

```yaml
# Si usas Colima
colima start

# Levanta PostgreSQL en localhost:5432 y la API en localhost:3000
docker compose up -d

# Detener
docker compose down

# Detener y eliminar datos
docker compose down -v
```

---

## 📱 Funcionalidades

| Sección | Descripción |
|---------|-------------|
| **Login** | Email/contraseña, Google OAuth, acceso como invitado |
| **Catálogo** | Grid 2 columnas, búsqueda, filtro por categoría |
| **Carrito** | Agregar/quitar productos, resumen de compra, checkout con PayPal |
| **Chat** | Mensajería en tiempo real con Supabase Realtime Broadcast |
| **Cuenta** | Editar nombre, ubicación, foto de perfil (Cloudinary) |
| **Producto** | Imagen, precio, descripción, selector de color, cantidad |

---

## ⚙️ Variables de entorno — referencia completa

### Frontend (`.env`)

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `EXPO_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | ✅ |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase | ✅ |
| `EXPO_PUBLIC_API_HOST` | IP/hostname del backend (sin http://) | ✅ |
| `EXPO_PUBLIC_API_URL` | URL completa para producción | ❌ |
| `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary | ❌ |
| `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload preset de Cloudinary | ❌ |

### Backend (`backend/.env`)

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL | ✅ |
| `PORT` | Puerto del servidor (default: 3000) | ❌ |
| `CORS_ORIGINS` | Orígenes permitidos separados por coma | ❌ |
| `PAYPAL_CLIENT_ID` | Client ID de PayPal | ❌ |
| `PAYPAL_CLIENT_SECRET` | Client Secret de PayPal | ❌ |
| `PAYPAL_ENVIRONMENT` | `sandbox` o `live` | ❌ |

---

## 🛠️ Tecnologías

**Frontend**: Expo SDK 55 · React Native 0.85 · React Navigation 7 · Zustand 5 · Supabase JS · TypeScript

**Backend**: Node.js 20 · Express 4 · PostgreSQL · Zod · PayPal SDK

**DevOps**: Docker Compose · GitHub Actions (CI)

---

## 🚀 Despliegue a producción

### Expo EAS (Frontend móvil)

1. Instalar EAS CLI:
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. Configurar el proyecto:
   ```bash
   eas build:configure
   ```

3. Crear build de producción:
   ```bash
   # Android (APK o AAB)
   eas build --platform android --profile production

   # iOS (IPA)
   eas build --platform ios --profile production
   ```

4. Publicar actualización OTA (Over-The-Air):
   ```bash
   eas update --branch production --message "Nueva versión"
   ```

5. Para enviar a las tiendas:
   ```bash
   eas submit --platform android
   eas submit --platform ios
   ```

### Vercel (Backend API)

1. Conectar repositorio en [vercel.com](https://vercel.com):
   - Importar proyecto desde GitHub
   - Configurar directorio raíz: `backend`

2. Configurar variables de entorno en Vercel Dashboard:
   - `DATABASE_URL` · `PAYPAL_CLIENT_ID` · `PAYPAL_CLIENT_SECRET` · `PAYPAL_ENVIRONMENT`

3. Desplegar:
   ```bash
   vercel --prod
   ```

> ⚠️ **Nota**: El backend usa Docker Compose localmente, pero en Vercel se despliega como serverless functions. Ajusta la configuración en `vercel.json` si es necesario.
