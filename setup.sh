#!/usr/bin/env bash
# setup.sh — Configura Comprasur en local en un solo comando
# Uso: bash setup.sh

set -e

echo "🩺 Comprasur — Setup"
echo "===================="

# 1. Frontend .env
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ .env creado desde .env.example"
else
  echo "ℹ️  .env ya existe"
fi

# 2. Backend .env
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "✅ backend/.env creado"
else
  echo "ℹ️  backend/.env ya existe"
fi

# 3. Dependencias frontend
echo "📦 Instalando dependencias frontend..."
npm install --silent

# 4. Backend
echo "📦 Instalando dependencias backend..."
(cd backend && npm install --silent)

# 5. Base de datos
echo "🐳 Levantando PostgreSQL..."
(cd backend && docker-compose up -d)
sleep 3
(cd backend && npm run db:init)

# 6. Supabase link (requiere token)
if command -v supabase &>/dev/null; then
  echo ""
  echo "🔗 Para vincular Supabase ejecuta:"
  echo "   supabase link --project-ref diucfhyirwecrnvyhdmj"
  echo "   supabase db push"
fi

echo ""
echo "✅ Setup completo. Inicia la app con:"
echo "   npx expo start          # frontend"
echo "   cd backend && npm start # backend (en otra terminal)"
