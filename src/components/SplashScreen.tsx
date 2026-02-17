/**
 * @file SplashScreen.tsx
 * @description Pantalla de bienvenida animada de la aplicación.
 * Implementa animaciones de entrada (fade-in y escala) antes de transicionar a la app principal.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Image,
  Text,
  StatusBar,
} from 'react-native';
import { t } from '../i18n';

/**
 * Propiedades para el componente SplashScreen.
 * @interface SplashScreenProps
 * @property {() => void} onFinish - Callback llamado cuando la animación de bienvenida termina.
 */
interface SplashScreenProps {
  onFinish: () => void;
}

/**
 * Componente que muestra el logo y título de la app con una secuencia de animaciones.
 * Utiliza Animated para gestionar la opacidad y el tamaño del contenido.
 *
 * @param {SplashScreenProps} props - Propiedades del splash.
 * @returns {React.JSX.Element} Contenedor animado a pantalla completa.
 */
const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Entrada: Aparece y crece
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // 2. Espera: Se mantiene visible
      Animated.delay(1500),
    ]).start(() => {
      // Notificar que el splash está listo para ocultarse
      onFinish();
    });
  }, [fadeAnim, onFinish, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* IMPORTANTE: Asegúrate de que el nombre del archivo coincida (ej. logo.png) */}
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{t('app_title')}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
  },
});

export default SplashScreen;
