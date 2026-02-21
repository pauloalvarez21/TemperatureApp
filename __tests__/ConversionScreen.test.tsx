import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ConversionScreen from '../src/screens/ConversionScreen';
import useTemperatureConverter from '../src/hooks/useTemperatureConverter';

// --- Mocks ---

// 1. Mock del hook de lógica (aislamos la UI de la matemática)
jest.mock('../src/hooks/useTemperatureConverter');

// 2. Mock de i18n
jest.mock('../src/i18n', () => ({
  t: (key: string) => key,
}));

// 3. Mock de dependencias nativas (Picker)
jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  // Simulamos el Picker como una View simple que renderiza sus hijos
  // Agregamos testID y props para poder interactuar con él
  const Picker = ({ children, onValueChange, selectedValue }: any) => 
    React.createElement('Picker', { testID: 'scale-picker', onValueChange, selectedValue }, children);
    
  Picker.Item = ({ label, value }: any) => React.createElement('PickerItem', { label, value });
  return { Picker };
});

// 4. Mock de Safe Area
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

describe('<ConversionScreen />', () => {
  // Valores por defecto para nuestro mock del hook
  const mockHookValues = {
    inputValue: '',
    fromScale: 'celsius',
    toScale: 'fahrenheit',
    error: null,
    setInputValue: jest.fn(),
    setFromScale: jest.fn(),
    setToScale: jest.fn(),
    reset: jest.fn(),
    formatResult: jest.fn(() => '32.00 °F'), // Valor simulado de retorno
    getScaleInfo: jest.fn((scale) => ({
      name: scale,
      symbol: scale === 'celsius' ? '°C' : '°F',
      description: 'Descripción de prueba',
    })),
    allScales: ['celsius', 'fahrenheit'],
  };

  beforeEach(() => {
    // Reiniciamos los mocks antes de cada test
    (useTemperatureConverter as jest.Mock).mockReturnValue(mockHookValues);
    jest.clearAllMocks();
  });

  it('renderiza correctamente los elementos principales', () => {
    const { getByText, getByPlaceholderText } = render(<ConversionScreen />);

    // Verifica títulos y placeholders usando las claves de traducción
    expect(getByText('conversionScreen.title')).toBeTruthy();
    expect(getByPlaceholderText('conversionScreen.placeholder')).toBeTruthy();
    expect(getByText('conversionScreen.result:')).toBeTruthy();
  });

  it('llama a setInputValue cuando el usuario escribe', () => {
    const { getByPlaceholderText } = render(<ConversionScreen />);
    const input = getByPlaceholderText('conversionScreen.placeholder');

    // Simulamos escribir "100"
    fireEvent.changeText(input, '100');

    // Verificamos que la función del hook fue llamada
    expect(mockHookValues.setInputValue).toHaveBeenCalledWith('100');
  });

  it('llama a reset al presionar el botón de reiniciar', () => {
    const { getByText } = render(<ConversionScreen />);
    const resetButton = getByText('conversionScreen.reset');

    fireEvent.press(resetButton);

    expect(mockHookValues.reset).toHaveBeenCalled();
  });

  it('actualiza el formato del resultado al cambiar decimales', () => {
    const { getByText } = render(<ConversionScreen />);
    
    // Buscamos el botón para "4" decimales y lo presionamos
    const decimalButton = getByText('4');
    fireEvent.press(decimalButton);

    // Al cambiar el estado local, el componente se re-renderiza y llama a formatResult con 4
    expect(mockHookValues.formatResult).toHaveBeenCalledWith(4);
  });

  it('muestra mensaje de error si el hook devuelve un error', () => {
    // Sobrescribimos el mock solo para este test
    (useTemperatureConverter as jest.Mock).mockReturnValue({
      ...mockHookValues,
      error: 'invalid_input',
    });

    const { getByText } = render(<ConversionScreen />);
    expect(getByText('conversionScreen.errors.invalid_input')).toBeTruthy();
  });

  it('llama a setFromScale cuando se cambia el picker de origen', () => {
    const { getAllByTestId } = render(<ConversionScreen />);
    
    // Obtenemos todos los pickers (hay 2: origen y destino)
    const pickers = getAllByTestId('scale-picker');
    
    // Simulamos cambiar el valor del primer picker (Origen)
    fireEvent(pickers[0], 'onValueChange', 'kelvin');
    
    expect(mockHookValues.setFromScale).toHaveBeenCalledWith('kelvin');
  });
});