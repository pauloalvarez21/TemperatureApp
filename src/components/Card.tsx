/**
 * @file Card.tsx
 * @description Componente contenedor genérico con estilo de tarjeta.
 * Proporciona una base visual consistente con bordes redondeados y sombras.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

/**
 * Propiedades para el componente Card.
 * @interface CardProps
 * @property {React.ReactNode} children - Contenido a renderizar dentro de la tarjeta.
 * @property {ViewStyle} [style] - Estilos adicionales opcionales.
 * @property {() => void} [onPress] - Función opcional a ejecutar al presionar la tarjeta.
 */
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

/**
 * Componente de tarjeta reutilizable que puede actuar como contenedor estático o botón.
 *
 * @param {CardProps} props - Propiedades de la tarjeta.
 * @returns {React.JSX.Element} Componente View o TouchableOpacity según la presencia de onPress.
 */
const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Card;
