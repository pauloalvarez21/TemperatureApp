#!/bin/bash
# Quick Start Script para Temperature App

echo "🚀 Temperature App - Quick Start"
echo "==============================="
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org"
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas"
echo ""

# Instalar Pods (solo iOS)
if [ "$1" == "ios" ] || [ -z "$1" ]; then
    echo "📱 iOS seleccionado. Instalando Pods..."
    cd ios
    pod install
    cd ..
    
    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar Pods"
        exit 1
    fi
    echo "✅ Pods instalados"
    echo ""
fi

# Ejecutar tests
echo "🧪 Ejecutando tests..."
if [ "$1" == "coverage" ]; then
    npm test -- --coverage
else
    npm test
fi

if [ $? -ne 0 ]; then
    echo "⚠️ ¡Algunos tests fallaron! Revisa los resultados."
else
    echo "✅ Todos los tests pasaron"
fi

echo ""
echo "✨ ¡Aplicación lista!"
echo ""
echo "Para ejecutar la aplicación:"
echo "  Android: npm run android"
echo "  iOS:     npm run ios"
echo ""
echo "Para más información, consulta README.md"
