import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ExplanationScreen from '../src/screens/ExplanationScreen';

// --- Mocks ---

// 1. Mock de i18n
jest.mock('../src/i18n', () => ({
  t: (key: string, params?: any) => {
    // Si se pasan parámetros (como count), devolvemos una cadena simple para verificar
    if (key === 'explanationScreen.table.moreItems' && params) {
      return `Ver ${params.count} más`;
    }
    return key;
  },
}));

// 2. Mock de dataLoader (Simulamos los datos que vienen del JSON)
jest.mock('../src/utils/dataLoader', () => ({
  loadTemperatureScalesData: jest.fn(() => ({
    temperatureScales: [
      {
        id: 'celsius',
        name: 'Celsius',
        symbol: '°C',
        color: '#F44336',
        inventor: 'Anders Celsius',
        year: '1742',
        description: 'Descripción de prueba Celsius',
        formula: 'C = K - 273.15',
        usage: 'Uso mundial',
        keyPoints: ['Punto clave 1'],
      },
    ],
    commonTemperatures: [
      { name: 'Cero absoluto', celsius: -273.15 },
      { name: 'Congelación', celsius: 0 },
      { name: 'Cuerpo humano', celsius: 37 },
      { name: 'Ebullición', celsius: 100 },
    ],
    curiosities: [
      { icon: '🔍', text: 'Curiosidad de prueba' },
    ],
    introText: { title: 'Título Intro', description: 'Desc Intro' },
    finalNote: { title: 'Título Final', text: 'Texto Final' },
  })),
  // Simulamos la conversión para la tabla
  convertToAllScales: jest.fn((celsius) => ({
    celsius: `${celsius} °C`,
    // Agregamos claves genéricas para evitar errores al renderizar la tabla
    fahrenheit: '32 °F', 
    kelvin: '273.15 K',
  })),
}));

// 3. Mock de Safe Area
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

describe('<ExplanationScreen />', () => {
  it('renderiza correctamente el título y la introducción', () => {
    const { getByText } = render(<ExplanationScreen />);
    
    expect(getByText('explanationScreen.title')).toBeTruthy();
    expect(getByText('Título Intro')).toBeTruthy();
    expect(getByText('Desc Intro')).toBeTruthy();
  });

  it('renderiza la tarjeta de escala Celsius con sus detalles', () => {
    const { getByText } = render(<ExplanationScreen />);
    
    // Verificamos datos específicos del mock
    expect(getByText('Celsius (°C)')).toBeTruthy();
    expect(getByText('Anders Celsius (1742)')).toBeTruthy();
    expect(getByText('Descripción de prueba Celsius')).toBeTruthy();
    expect(getByText('C = K - 273.15')).toBeTruthy();
  });

  it('renderiza la tabla de comparación y permite expandirla', () => {
    const { getByText, queryByText } = render(<ExplanationScreen />);
    
    // Verificar encabezado de tabla
    expect(getByText('explanationScreen.comparison.subtitle')).toBeTruthy();
    
    // Verificar filas iniciales (se muestran 3 por defecto según la lógica del componente)
    expect(getByText('Cero absoluto')).toBeTruthy();
    expect(getByText('Congelación')).toBeTruthy();
    expect(getByText('Cuerpo humano')).toBeTruthy();
    
    // El cuarto elemento (Ebullición) NO debería estar visible inicialmente
    // queryByText retorna null si no encuentra el elemento
    expect(queryByText('Ebullición')).toBeNull();
    
    // Buscar botón de expandir y presionarlo
    const toggleButton = getByText('explanationScreen.table.showFull');
    fireEvent.press(toggleButton);
    
    // Ahora el cuarto elemento debería estar visible
    expect(getByText('Ebullición')).toBeTruthy();
  });

  it('renderiza las curiosidades', () => {
    const { getByText } = render(<ExplanationScreen />);
    expect(getByText('Curiosidad de prueba')).toBeTruthy();
  });
});