# 🩺 Comprasur - Insumos Médicos

Aplicación móvil industrial para la gestión y compra de insumos médicos, construida con un enfoque en resiliencia, seguridad y calidad de ingeniería.

## 🚀 Arquitectura del Proyecto

El proyecto sigue una estructura modular y escalable, dividida en **Mobile (Expo)** y **Backend (Express)**.

### Mobile Frontend (`/src`)
- **Navegación:** React Navigation 7 con flujo de autenticación y modales nativos.
- **Estado:** Zustand 5 con persistencia local (`AsyncStorage`) para el carrito y la sesión.
- **UI:** Atomic Design con componentes reutilizables y sistema de tokens de diseño.
- **Resiliencia:** Manejo global de errores, estados de carga y reintentos automáticos.
- **Seguridad:** Integración nativa con Supabase Auth y Google OAuth.

### Backend API (`/backend`)
- **Arquitectura:** Patrón Controller-Route modular.
- **Base de Datos:** PostgreSQL con soporte para Row Level Security (RLS).
- **Validación:** Esquemas estrictos con Zod para prevenir datos malformados.
- **Pagos:** Integración blindada con PayPal, incluyendo Webhooks para integridad de transacciones.
- **Docker:** Contenerización completa para base de datos y API.

---

## 🛠️ Guía de Inicio Rápido

### Requisitos Previos
- Node.js 20+
- Docker & Docker Compose
- Expo Go en tu dispositivo móvil

### 1. Configuración del Backend
```bash
cd backend
# Crear archivo .env basado en la configuración necesaria
docker-compose up -d
npm run db:init # Inicializa tablas y datos semilla
npm start
```

### 2. Configuración del Frontend
```bash
# En la raíz del proyecto
npm install
npx expo start
```

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz (para Expo) y en `/backend` con las siguientes claves:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `DATABASE_URL` (para el backend)

---

## 🧪 Estrategia de Calidad (QA)

El proyecto cuenta con una suite de pruebas automatizadas para garantizar que nada se rompa durante la evolución del producto.

- **Backend Tests:** `cd backend && npm test` (Vitest + Supertest).
- **Frontend Tests:** `npm test` (Jest + React Native Testing Library).
- **Type Checking:** `npx tsc --noEmit` para asegurar integridad de tipos.

---

## 🛡️ Seguridad por Diseño
- **Assume Breach:** Todas las rutas del backend están validadas.
- **Zero Trust:** Las políticas RLS en Supabase aseguran que cada usuario solo acceda a su propia información.
- **Integridad:** Los Webhooks de PayPal actúan como la fuente de verdad para los pagos, ignorando manipulaciones del lado del cliente.

---
**Desarrollado con ❤️ y RIGOR por Gemini Architect CLI.**
