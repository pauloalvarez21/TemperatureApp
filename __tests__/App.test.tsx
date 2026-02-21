import React from 'react';
import { render, act } from '@testing-library/react-native';
import App from '../App';

// Mock de i18n para que t('key') devuelva 'key' y las aserciones funcionen
jest.mock('../src/i18n', () => ({
  t: (key: string) => key,
}));

// Mocks necesarios para que NavigationContainer funcione en los tests
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock de dependencias que usa el AppNavigator indirectamente
jest.mock('react-native-google-mobile-ads', () => ({
  BannerAd: 'BannerAd',
  BannerAdSize: {},
  TestIds: {},
  useForeground: jest.fn(),
}));

// Mock de AppNavigator para evitar errores de renderizado de navegación compleja (BottomTabs)
// y aislar la prueba de App.tsx. Esto soluciona el error "Consumer" undefined.
jest.mock('../src/navigation/AppNavigator', () => ({
  AppNavigator: () => {
    const { View } = require('react-native');
    return <View />;
  },
}));

describe('<App />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renderiza el Splash y luego navega a la App principal', async () => {
    const { getByText, queryByText } = render(<App />);

    // 1. Al inicio debe estar el Splash (buscamos texto del splash)
    expect(getByText('app_title')).toBeTruthy();

    // 2. Avanzamos el tiempo para que termine la animación del Splash (3000ms es suficiente)
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // 3. Ahora el Splash NO debe estar, y debería intentar renderizar la navegación
    // Nota: Como AppNavigator carga HomeScreen, verificamos si el Splash desapareció
    // o si algo de la Home intenta aparecer.
    expect(queryByText('app_title')).toBeNull(); // El splash desmonta el texto
  });
});
