/**
 * @file dataLoader.ts
 * @description Funciones para cargar y transformar datos estáticos de escalas de temperatura.
 * Gestiona la selección de archivos JSON basados en el idioma actual del sistema/app.
 */

import { getCurrentTranslations } from '../i18n';

/**
 * Carga el conjunto de datos de escalas de temperatura apropiado para el idioma actual.
 *
 * @returns {any} Datos completos de las escalas, incluyendo historia y curiosidades.
 */
export const loadTemperatureScalesData = () => {
  return getCurrentTranslations();
};

/**
 * Genera un objeto con la representación en texto de una temperatura en todas las escalas soportadas.
 * Útil para tablas comparativas.
 *
 * @param {number} celsius - Valor base en Celsius para realizar los cálculos.
 * @returns {Record<string, string>} Mapa donde la clave es el ID de la escala y el valor es el texto formateado.
 */
export const convertToAllScales = (celsius: number): Record<string, string> => {
  return {
    kelvin: `${(celsius + 273.15).toFixed(1)} K`,
    celsius: `${celsius.toFixed(1)} °C`,
    fahrenheit: `${((celsius * 9) / 5 + 32).toFixed(1)} °F`,
    rankine: `${((celsius * 9) / 5 + 32 + 459.67).toFixed(1)} °R`,
    reaumur: `${(celsius * 0.8).toFixed(1)} °Ré`,
    romer: `${((celsius * 21) / 40 + 7.5).toFixed(1)} °Rø`,
    newton: `${(celsius * 0.33).toFixed(1)} °N`,
    delisle: `${((100 - celsius) * 1.5).toFixed(1)} °De`,
  };
};

// Función para obtener escala por ID
export const getScaleById = (id: number) => {
  const data = loadTemperatureScalesData();
  return data.temperatureScales?.find((scale: any) => scale.id === id);
};

// Función para obtener escala por nombre
export const getScaleByName = (name: string) => {
  const data = loadTemperatureScalesData();
  return data.temperatureScales?.find((scale: any) =>
    scale.name.toLowerCase().includes(name.toLowerCase())
  );
};
