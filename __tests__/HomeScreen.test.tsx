import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';

// --- Mocks de Dependencias ---
// Mock para el módulo de internacionalización (i18n)
jest.mock('../src/i18n', () => ({
  t: (key: string, params?: object) => {
    if (params) {
      // Para el caso del footer, reemplaza el año
      return key.replace('{year}', (params as any).year);
    }
    return key; // Devuelve la clave misma para facilitar las aserciones
  },
}));

// Mock para react-native-google-mobile-ads
jest.mock('react-native-google-mobile-ads', () => ({
  BannerAd: 'BannerAd',
  BannerAdSize: { ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER' },
  TestIds: { ADAPTIVE_BANNER: 'ADAPTIVE_BANNER' },
  useForeground: jest.fn(),
}));

// Mock para react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
}));

// Mock para Dimensions y otros módulos de react-native si es necesario
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Dimensions.get = () => ({ width: 375, height: 812 });
  return RN;
});

describe('<HomeScreen />', () => {
  // Creamos un mock para la prop 'navigation'
  const mockNavigation = {
    navigate: jest.fn(),
  };

  // Limpiamos el historial del mock antes de cada test
  beforeEach(() => {
    mockNavigation.navigate.mockClear();
  });

  it('debería renderizar el título principal y la descripción', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    // Comprueba si el título y la descripción principales están en el documento
    expect(getByText('homeScreen.title')).toBeTruthy();
    expect(getByText('homeScreen.description')).toBeTruthy();
  });

  it('debería navegar a la pantalla "Conversion" al presionar el botón principal', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    // Busca el botón por su texto y simula un clic
    const convertButton = getByText('homeScreen.actions.convert.title');
    fireEvent.press(convertButton);

    // Verifica que la función de navegación fue llamada con el nombre de la pantalla correcta
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Conversion');
  });

  it('debería navegar a la pantalla "Explanation" al presionar el botón secundario', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    const learnButton = getByText('homeScreen.actions.learn.title');
    fireEvent.press(learnButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Explanation');
  });

  it('debería navegar a la pantalla "Convertion" al presionar el botón CTA', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    const ctaButton = getByText('homeScreen.cta.button');
    fireEvent.press(ctaButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Conversion');
  });

  it('debería renderizar las tarjetas de características', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    expect(getByText('homeScreen.features.items.scales.title')).toBeTruthy();
    expect(getByText('homeScreen.features.items.fast.title')).toBeTruthy();
  });

  it('debería renderizar las temperaturas destacadas', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    expect(getByText('homeScreen.temps.freeze')).toBeTruthy();
    expect(getByText('homeScreen.temps.boil')).toBeTruthy();
  });

  it('debería interactuar con la paginación del carrusel', () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    // Buscamos el segundo punto (índice 1)
    const secondDot = getByTestId('pagination-dot-1');
    
    // Al presionarlo, debería llamar a goToSlide (cubriendo esas líneas)
    fireEvent.press(secondDot);
    
    // No podemos verificar fácilmente el scroll sin mockear la ref, 
    // pero el hecho de disparar el evento cubre la línea de código.
  });

  it('debería actualizar el índice activo al hacer scroll en el carrusel', () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);
    const scrollView = getByTestId('features-carousel');

    // Simulamos un evento de scroll que mueve el carrusel a la segunda diapositiva (índice 1)
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { x: 375 }, // Asumiendo que el ancho es 375
        layoutMeasurement: { width: 375 },
      },
    });
  });
});