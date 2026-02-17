import { Platform, NativeModules } from 'react-native';
import en from './en.json';
import es from './es.json';

// Función para obtener el idioma del dispositivo de forma segura
const getSystemLanguage = (): string => {
  try {
    // 1. Intentar con Intl (Estándar moderno en React Native / Hermes)
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      return Intl.DateTimeFormat().resolvedOptions().locale;
    }

    // 2. Fallback para iOS (SettingsManager)
    if (Platform.OS === 'ios') {
      const settings = NativeModules.SettingsManager?.settings;
      return settings?.AppleLocale || settings?.AppleLanguages?.[0] || 'en';
    }

    // 3. Fallback para Android (I18nManager)
    if (Platform.OS === 'android') {
      return NativeModules.I18nManager?.localeIdentifier || 'en';
    }
  } catch (error) {
    console.warn('Error detectando idioma', error);
  }

  return 'en'; // Idioma por defecto si todo falla
};

const languageCode = getSystemLanguage();
// Verificamos si el código de idioma comienza con "es" (ej. "es-MX", "es-ES")
const isSpanish = languageCode.toLowerCase().startsWith('es');

// Seleccionamos el objeto de traducciones correcto
const translations: any = isSpanish ? es : en;

// Exportamos el objeto de traducciones actual para que dataLoader pueda acceder a los datos crudos
export const getCurrentTranslations = () => translations;

// Exportamos la función 't' para usar en la app
export const t = (key: string, params?: Record<string, string | number>) => {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  // Si hay parámetros para reemplazar (ej: {{count}})
  if (typeof value === 'string' && params) {
    return Object.keys(params).reduce((acc, paramKey) => {
      return acc.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(params[paramKey]));
    }, value);
  }
  
  return value;
};