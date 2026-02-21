import { convertTemperature, formatTemperature } from '../src/utils/temperatureConverter';

// Tests unitarios para la lógica de conversión de temperatura

describe('temperatureConverter', () => {
  describe('convertTemperature', () => {
    // Celsius a Fahrenheit
    it('convierte correctamente Celsius a Fahrenheit', () => {
      expect(convertTemperature(0, 'celsius', 'fahrenheit')).toBeCloseTo(32);
      expect(convertTemperature(100, 'celsius', 'fahrenheit')).toBeCloseTo(212);
      expect(convertTemperature(-40, 'celsius', 'fahrenheit')).toBeCloseTo(-40);
    });

    // Fahrenheit a Celsius
    it('convierte correctamente Fahrenheit a Celsius', () => {
      expect(convertTemperature(32, 'fahrenheit', 'celsius')).toBeCloseTo(0);
      expect(convertTemperature(212, 'fahrenheit', 'celsius')).toBeCloseTo(100);
    });

    // Celsius a Kelvin
    it('convierte correctamente Celsius a Kelvin', () => {
      expect(convertTemperature(0, 'celsius', 'kelvin')).toBeCloseTo(273.15);
      expect(convertTemperature(-273.15, 'celsius', 'kelvin')).toBeCloseTo(0);
    });

    // Kelvin a Celsius
    it('convierte correctamente Kelvin a Celsius', () => {
      expect(convertTemperature(0, 'kelvin', 'celsius')).toBeCloseTo(-273.15);
      expect(convertTemperature(273.15, 'kelvin', 'celsius')).toBeCloseTo(0);
    });

    // Rankine
    it('convierte correctamente entre Celsius y Rankine', () => {
      // 0°C = 491.67°R
      expect(convertTemperature(0, 'celsius', 'rankine')).toBeCloseTo(491.67);
      expect(convertTemperature(491.67, 'rankine', 'celsius')).toBeCloseTo(0);
    });

    // Réaumur
    it('convierte correctamente entre Celsius y Réaumur', () => {
      // 100°C = 80°Ré
      expect(convertTemperature(100, 'celsius', 'reaumur')).toBeCloseTo(80);
      expect(convertTemperature(80, 'reaumur', 'celsius')).toBeCloseTo(100);
    });

    // Rømer
    it('convierte correctamente entre Celsius y Rømer', () => {
      // 100°C = 60°Rø
      expect(convertTemperature(100, 'celsius', 'romer')).toBeCloseTo(60);
      expect(convertTemperature(60, 'romer', 'celsius')).toBeCloseTo(100);
    });

    // Newton
    it('convierte correctamente entre Celsius y Newton', () => {
      // 100°C = 33°N
      expect(convertTemperature(100, 'celsius', 'newton')).toBeCloseTo(33);
      expect(convertTemperature(33, 'newton', 'celsius')).toBeCloseTo(100);
    });

    // Delisle
    it('convierte correctamente entre Celsius y Delisle', () => {
      // 100°C = 0°De (Delisle es invertida)
      expect(convertTemperature(100, 'celsius', 'delisle')).toBeCloseTo(0);
      expect(convertTemperature(0, 'delisle', 'celsius')).toBeCloseTo(100);
    });

    // Casos borde
    it('maneja la misma unidad de entrada y salida', () => {
      expect(convertTemperature(100, 'celsius', 'celsius')).toBe(100);
    });

    it('devuelve el mismo valor para escalas no soportadas (default case)', () => {
      // @ts-ignore: Probando robustez con escala inválida
      expect(convertTemperature(100, 'invalid', 'celsius')).toBe(100);
      // @ts-ignore: Probando robustez con escala inválida
      expect(convertTemperature(100, 'celsius', 'invalid')).toBe(100);
    });
  });

  describe('formatTemperature', () => {
    it('formatea correctamente el valor con el símbolo', () => {
      expect(formatTemperature(25, 'celsius')).toBe('25.00 °C');
      expect(formatTemperature(100, 'fahrenheit', 1)).toBe('100.0 °F');
      expect(formatTemperature(0, 'kelvin', 0)).toBe('0 K');
    });
  });
});