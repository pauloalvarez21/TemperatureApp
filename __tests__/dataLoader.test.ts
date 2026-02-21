import { convertToAllScales, loadTemperatureScalesData } from '../src/utils/dataLoader';

// Mock de i18n para loadTemperatureScalesData
jest.mock('../src/i18n', () => ({
  getCurrentTranslations: jest.fn(() => ({
    scales: {
      celsius: { name: 'Celsius', description: 'Escala centígrada' },
    },
  })),
}));

describe('dataLoader', () => {
  describe('convertToAllScales', () => {
    it('genera el formato correcto para 0°C (Punto de congelación)', () => {
      const result = convertToAllScales(0);

      // Verificamos algunas escalas clave y su formato (1 decimal)
      expect(result.celsius).toBe('0.0 °C');
      expect(result.fahrenheit).toBe('32.0 °F');
      expect(result.kelvin).toBe('273.1 K'); // 273.15 redondeado a 1 decimal (comportamiento de JS toFixed)
      expect(result.rankine).toBe('491.7 °R'); // 491.67 redondeado
    });

    it('genera el formato correcto para 100°C (Punto de ebullición)', () => {
      const result = convertToAllScales(100);

      expect(result.celsius).toBe('100.0 °C');
      expect(result.fahrenheit).toBe('212.0 °F');
      expect(result.delisle).toBe('0.0 °De');
    });

    it('devuelve un objeto con las 8 escalas', () => {
      const result = convertToAllScales(25);
      const keys = Object.keys(result);
      expect(keys).toHaveLength(8);
      expect(keys).toContain('newton');
      expect(keys).toContain('reaumur');
      expect(keys).toContain('romer');
    });
  });

  describe('loadTemperatureScalesData', () => {
    it('carga los datos de traducción simulados', () => {
      const data = loadTemperatureScalesData();
      expect(data).toBeDefined();
      expect(data.scales.celsius.name).toBe('Celsius');
    });
  });
});