#!/bin/bash

# Detener el script si ocurre algún error
set -e

echo "🚀 Iniciando proceso de construcción segura y ofuscada..."

# Obtener la ruta absoluta del directorio donde está este script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Definir la raíz del proyecto (asumiendo que script/ está en la raíz)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ANDROID_DIR="$PROJECT_ROOT/android"
GRADLE_FILE="$ANDROID_DIR/app/build.gradle"

# --- ANDROID ---
if [ -d "$ANDROID_DIR" ]; then
    echo "🤖 Preparando Android..."
    
    # 1. Crear copia de seguridad del archivo de configuración
    echo "   ↳ Creando backup de build.gradle..."
    cp "$GRADLE_FILE" "$GRADLE_FILE.bak"
    
    # 2. Activar ProGuard (Ofuscación) temporalmente
    # Usamos sed para buscar la línea 'false' y cambiarla a 'true'
    # Detectamos si es MacOS para usar la sintaxis correcta de sed
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's/def enableProguardInReleaseBuilds = false/def enableProguardInReleaseBuilds = true/g' "$GRADLE_FILE"
    else
        sed -i 's/def enableProguardInReleaseBuilds = false/def enableProguardInReleaseBuilds = true/g' "$GRADLE_FILE"
    fi
    
    echo "   🔒 ProGuard (R8) activado temporalmente."
    
    # 3. Construir los binarios de Release
    echo "   📦 Generando Android App Bundle (AAB)..."
    cd "$ANDROID_DIR"
    ./gradlew bundleRelease
    
    echo "   📦 Generando APK universal..."
    ./gradlew assembleRelease

    # 4. Restaurar el archivo original
    cd "$PROJECT_ROOT"
    mv "$GRADLE_FILE.bak" "$GRADLE_FILE"
    
    echo "✅ Android: Binarios generados y código restaurado."
    echo "📂 Ubicación AAB: android/app/build/outputs/bundle/release/app-release.aab"
    echo "📂 Ubicación APK: android/app/build/outputs/apk/release/app-release.apk"
else
    echo "⚠️ No se encontró el directorio android/"
fi

# --- IOS ---
echo ""
echo "🍎 Para iOS:"
echo "   La ofuscación de símbolos y compilación de Bytecode se realiza automáticamente"
echo "   cuando generas un 'Archive' en modo Release."
echo "   👉 Abre Xcode (xed ios), ve a Product > Archive y sigue el flujo de distribución."
echo ""
echo "✨ Proceso finalizado exitosamente."