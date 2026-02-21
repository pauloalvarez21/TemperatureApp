import React from 'react';
import { render } from '@testing-library/react-native';
import SplashScreen from '../src/components/SplashScreen';

// Mock de i18n
jest.mock('../src/i18n', () => ({
  t: (key: string) => key,
}));

describe('<SplashScreen />', () => {
  beforeEach(() => {
    // Habilitamos los temporizadores falsos antes de cada test
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restauramos los temporizadores reales al finalizar
    jest.useRealTimers();
  });

  it('renderiza el título correctamente', () => {
    const { getByText } = render(<SplashScreen onFinish={jest.fn()} />);
    expect(getByText('app_title')).toBeTruthy();
  });

  it('ejecuta onFinish al finalizar la secuencia de animación', () => {
    const mockOnFinish = jest.fn();
    render(<SplashScreen onFinish={mockOnFinish} />);

    // La animación dura aprox: 1000ms (fade/scale) + 1500ms (delay) = 2500ms.
    // Avanzamos el tiempo 3000ms para asegurar que termine.
    jest.advanceTimersByTime(3000);

    expect(mockOnFinish).toHaveBeenCalled();
  });
});