import { renderHook, act } from '@testing-library/react-native';
import useTemperatureConverter from '../src/hooks/useTemperatureConverter';
import * as temperatureConverterModule from '../src/utils/temperatureConverter';

// Mock de i18n para evitar errores de traducción y simplificar aserciones
jest.mock('../src/i18n', () => ({
  t: (key: string) => key,
}));

// Espiamos el módulo de conversión para poder forzar errores en tests específicos
jest.mock('../src/utils/temperatureConverter', () => ({
  ...jest.requireActual('../src/utils/temperatureConverter'),
  convertTemperature: jest.fn(),
}));

describe('useTemperatureConverter', () => {
  beforeEach(() => {
    // Restauramos la implementación real antes de cada test
    (temperatureConverterModule.convertTemperature as jest.Mock).mockImplementation(
      jest.requireActual('../src/utils/temperatureConverter').convertTemperature
    );
  });

  it('inicializa con valores por defecto', () => {
    const { result } = renderHook(() => useTemperatureConverter());

    expect(result.current.inputValue).toBe('0');
    expect(result.current.fromScale).toBe('celsius');
    expect(result.current.toScale).toBe('fahrenheit');
    // 0°C = 32°F
    expect(result.current.convertedValue).toBeCloseTo(32);
    expect(result.current.error).toBeNull();
  });

  it('actualiza el valor de entrada y recalcula la conversión', () => {
    const { result } = renderHook(() => useTemperatureConverter());

    // Simulamos que el usuario escribe "100"
    act(() => {
      result.current.setInputValue('100');
    });

    expect(result.current.inputValue).toBe('100');
    // 100°C = 212°F
    expect(result.current.convertedValue).toBeCloseTo(212);
  });

  it('recalcula cuando cambia la escala de origen', () => {
    const { result } = renderHook(() => useTemperatureConverter());

    // Establecemos 100
    act(() => {
      result.current.setInputValue('100');
    });

    // Cambiamos de Celsius a Fahrenheit (ahora la entrada es 100°F)
    act(() => {
      result.current.setFromScale('fahrenheit');
    });

    expect(result.current.fromScale).toBe('fahrenheit');
    // 100°F -> Fahrenheit (destino por defecto) = 100
    expect(result.current.convertedValue).toBeCloseTo(100);
  });

  it('recalcula cuando cambia la escala de destino', () => {
    const { result } = renderHook(() => useTemperatureConverter());

    act(() => {
      result.current.setInputValue('0');
    });

    // Cambiamos destino a Kelvin
    act(() => {
      result.current.setToScale('kelvin');
    });

    expect(result.current.toScale).toBe('kelvin');
    // 0°C = 273.15K
    expect(result.current.convertedValue).toBeCloseTo(273.15);
  });

  it('maneja input vacío o guión sin error', () => {
    const { result } = renderHook(() => useTemperatureConverter());

    act(() => {
      result.current.setInputValue('');
    });
    expect(result.current.convertedValue).toBe(0);
    expect(result.current.error).toBeNull();

    act(() => {
      result.current.setInputValue('-');
    });
    expect(result.current.error).toBeNull();
  });

  it('detecta input no numérico y muestra error', () => {
    const { result } = renderHook(() => useTemperatureConverter());

    act(() => {
      result.current.setInputValue('abc');
    });

    expect(result.current.error).toBe('errors.invalidNumber');
    expect(result.current.convertedValue).toBe(0);
  });

  it('resetea los valores al estado inicial', () => {
    const { result } = renderHook(() => useTemperatureConverter());

    // Cambiamos estados para ensuciar el hook
    act(() => {
      result.current.setInputValue('50');
      result.current.setFromScale('kelvin');
    });

    // Ejecutamos reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.inputValue).toBe('0');
    expect(result.current.fromScale).toBe('celsius');
    expect(result.current.toScale).toBe('fahrenheit');
    expect(result.current.convertedValue).toBeCloseTo(32);
  });

  it('obtiene información correcta de la escala (getScaleInfo)', () => {
    const { result } = renderHook(() => useTemperatureConverter());
    
    const info = result.current.getScaleInfo('celsius');
    
    expect(info.name).toBe('scales.celsius.name');
    expect(info.symbol).toBe('°C');
    expect(info.description).toBe('scales.celsius.description');
  });

  it('maneja errores inesperados durante la conversión', () => {
    // Forzamos que la función de conversión lance un error
    (temperatureConverterModule.convertTemperature as jest.Mock).mockImplementation(() => {
      throw new Error('Error simulado');
    });

    const { result } = renderHook(() => useTemperatureConverter());

    act(() => {
      result.current.setInputValue('100');
    });

    expect(result.current.error).toContain('errors.conversionError');
    expect(result.current.convertedValue).toBe(0);
  });

  it('maneja errores en useEffect cuando cambia la escala', () => {
    // Forzamos error en la conversión
    (temperatureConverterModule.convertTemperature as jest.Mock).mockImplementation(() => {
      throw new Error('Error en efecto');
    });

    const { result } = renderHook(() => useTemperatureConverter({ initialValue: 100 }));

    // Cambiamos la escala para disparar el useEffect (no validateAndConvert)
    act(() => {
      result.current.setFromScale('kelvin');
    });

    expect(result.current.error).toContain('errors.conversionError');
  });
});