/**
 * @file Card.tsx
 * @description Componente reutilizable que renderiza un contenedor con estilo de "tarjeta".
 * Proporciona una base de estilos consistentes (sombra, bordes redondeados) que puede ser extendida.
 */

import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

// Extiende ViewProps para aceptar 'children' y 'style' de forma explícita y segura.
interface CardProps extends ViewProps {
  children: React.ReactNode;
}

const Card = ({ children, style, ...props }: CardProps) => {
  return <View style={[styles.card, style]} {...props}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default Card;