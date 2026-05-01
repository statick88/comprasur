#!/bin/bash
# Comprasur - Script de inicio rápido

echo "🩺 Comprasur - Starting..."

# 1. Iniciar Docker backend
echo "→ Iniciando backend (Docker)..."
cd "$(dirname "$0")"
docker-compose up -d

# Esperar a que esté listo
sleep 5

# 2. Verificar API
echo "→ Verificando API..."
curl -s http://localhost:3000/health > /dev/null && echo "  ✅ API corriendo en localhost:3000" || echo "  ❌ API no responde"

# 3. Iniciar emulador
echo "→ Iniciando emulador Android..."
$ANDROID_HOME/emulator/emulator -avd Medium_Phone_API_36.1 -no-snapshot &

# Esperar emulador
echo "  ⏳ Esperando emulador (30s)..."
sleep 30

# 4. Instalar y ejecutar APK
echo "→ Iniciando app..."
# NOTA: Requiere construir APK primero con EAS o Android Studio

echo ""
echo "📋 Estado de servicios:"
echo "  Backend API:   http://localhost:3000"
echo "  PostgreSQL:    localhost:5432"
echo ""
echo "Commands útiles:"
echo "  docker-compose logs -f    # Ver logs del backend"
echo "  docker-compose down       # Detener todo"
echo "  curl localhost:3000/api/products  # Test API"