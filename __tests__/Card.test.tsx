import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import Card from '../src/components/Card';

describe('<Card />', () => {
  it('renderiza correctamente los hijos (children)', () => {
    const { getByText } = render(
      <Card>
        <Text>Contenido de prueba</Text>
      </Card>
    );

    expect(getByText('Contenido de prueba')).toBeTruthy();
  });

  it('aplica estilos personalizados y los combina con los estilos base', () => {
    const customStyle = { backgroundColor: 'red', margin: 10 };
    // Usamos testID para poder seleccionar el componente View específico
    const { getByTestId } = render(
      <Card testID="card-component" style={customStyle}>
        <Text>Test</Text>
      </Card>
    );

    const card = getByTestId('card-component');
    
    // Verificamos que el estilo final contenga nuestro estilo personalizado
    // React Native suele aplanar o mantener los estilos en un array
    expect(card.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)])
    );
  });

  it('pasa otras props al componente View subyacente', () => {
    const { getByTestId } = render(
      <Card testID="card-with-props" accessibilityLabel="Tarjeta accesible">
        <Text>Test</Text>
      </Card>
    );

    const card = getByTestId('card-with-props');
    expect(card.props.accessibilityLabel).toBe('Tarjeta accesible');
  });
});