/**
 * @file HomeScreen.tsx
 * @description Pantalla principal de la aplicación. Sirve como "Landing Page" dentro de la app,
 * ofreciendo navegación a las herramientas de conversión y documentación educativa.
 * Implementa un carrusel de características y muestra datos de interés.
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import { t } from '../i18n';

import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from 'react-native-google-mobile-ads';

/**
 * Identificador de la unidad de anuncios (Banner).
 * Utiliza IDs de prueba de Google en modo desarrollo (__DEV__) para evitar violaciones de política,
 * y el ID real de producción en builds de release.
 */
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-2899284558865652/8616461732';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

/**
 * Componente funcional que renderiza la pantalla de inicio (Home).
 *
 * Gestiona la navegación principal y presenta un resumen visual de las capacidades de la app.
 * Incluye integración con AdMob para monetización mediante banners adaptativos.
 *
 * @param {HomeScreenProps} props - Propiedades de navegación tipadas.
 * @returns {React.JSX.Element} Elemento JSX que representa la pantalla.
 */
const HomeScreen = ({ navigation }: HomeScreenProps) => {
  
  const featuresScrollRef = useRef<ScrollView>(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const bannerRef = useRef<BannerAd>(null);
  const currentYear = new Date().getFullYear();

  useForeground(() => {
    if (Platform.OS === 'ios') {
      bannerRef.current?.load();
    }
  });

  /**
   * Configuración de las tarjetas del carrusel de características.
   */
  const features = [
    {
      icon: '🌡️',
      title: t('homeScreen.features.items.scales.title'),
      description: t('homeScreen.features.items.scales.description'),
      bgColor: '#E3F2FD',
      textColor: '#1565C0',
    },
    {
      icon: '⚡',
      title: t('homeScreen.features.items.fast.title'),
      description: t('homeScreen.features.items.fast.description'),
      bgColor: '#FFF3E0',
      textColor: '#EF6C00',
    },
    {
      icon: '📊',
      title: t('homeScreen.features.items.compare.title'),
      description: t('homeScreen.features.items.compare.description'),
      bgColor: '#E8F5E9',
      textColor: '#2E7D32',
    },
    {
      icon: '🎯',
      title: t('homeScreen.features.items.precision.title'),
      description: t('homeScreen.features.items.precision.description'),
      bgColor: '#F3E5F5',
      textColor: '#7B1FA2',
    },
  ];

  /**
   * Datos estáticos de temperaturas de referencia para la sección informativa.
   */
  const highlightedTemps = [
    {
      temp: '0°C',
      label: t('homeScreen.temps.freeze'),
      color: '#2196F3',
      icon: '❄️',
    },
    {
      temp: '100°C',
      label: t('homeScreen.temps.boil'),
      color: '#FF5722',
      icon: '🔥',
    },
    { temp: '37°C', label: t('homeScreen.temps.body'), color: '#4CAF50', icon: '👤' },
    {
      temp: '-273.15°C',
      label: t('homeScreen.temps.absoluteZero'),
      color: '#9C27B0',
      icon: '⚛️',
    },
  ];

  /**
   * Manejador del evento de desplazamiento (scroll) para el carrusel de características.
   * Calcula el índice activo actual basándose en la posición X del scroll para actualizar la paginación.
   *
   * @param {NativeSyntheticEvent<NativeScrollEvent>} event - Evento nativo del scroll.
   */
  const handleFeaturesScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffset / slideSize);
    setActiveFeatureIndex(currentIndex);
  };

  /**
   * Desplaza programáticamente el ScrollView horizontal al índice especificado.
   *
   * @param {number} index - Índice de la diapositiva a visualizar (0 basado).
   */
  const goToSlide = (index: number) => {
    if (featuresScrollRef.current) {
      featuresScrollRef.current.scrollTo({
        x: index * (width - 64), // 64 = padding horizontal (32 + 32)
        animated: true,
      });
    }
    setActiveFeatureIndex(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
       <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          networkExtras: {
            collapsible: 'bottom',
          },
        }}
        ref={bannerRef}
      /> 
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Card style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.scaleIconContainer}>
              <Text style={styles.scaleIcon}>🌡️</Text>
            </View>
            <Text style={styles.heroTitle}>{t('homeScreen.title')}</Text>
            <Text style={styles.heroSubtitle}>{t('homeScreen.subtitle')}</Text>
            <Text style={styles.heroDescription}>{t('homeScreen.description')}</Text>
          </View>
        </Card>

        {/* Botones principales */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => navigation.navigate('Conversion')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🌡️</Text>
            <View style={styles.actionButtonTextContainer}>
              <Text style={styles.actionButtonTitle}>
                {t('homeScreen.actions.convert.title')}
              </Text>
              <Text style={styles.actionButtonSubtitle}>
                {t('homeScreen.actions.convert.subtitle')}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('Explanation')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>📚</Text>
            <View style={styles.actionButtonTextContainer}>
              <Text style={styles.actionButtonTitle}>
                {t('homeScreen.actions.learn.title')}
              </Text>
              <Text style={styles.actionButtonSubtitle}>
                {t('homeScreen.actions.learn.subtitle')}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Características con Carrusel */}
        <Card style={styles.featuresCard}>
          <Text style={styles.sectionTitle}>✨ {t('homeScreen.features.title')}</Text>

          <ScrollView
            ref={featuresScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleFeaturesScroll}
            scrollEventThrottle={16}
            snapToInterval={width - 32} // Ancho de la tarjeta (screen width - padding)
            decelerationRate="fast"
            style={styles.featuresScrollView}
            contentContainerStyle={styles.featuresScrollContent}
          >
            {features.map((feature, index) => (
              <View key={index} style={styles.featureSlide}>
                <View
                  style={[
                    styles.featureItem,
                    { backgroundColor: feature.bgColor },
                  ]}
                >
                  <View
                    style={[
                      styles.featureIconContainer,
                      { backgroundColor: `${feature.textColor}15` },
                    ]}
                  >
                    <Text
                      style={[styles.featureIcon, { color: feature.textColor }]}
                    >
                      {feature.icon}
                    </Text>
                  </View>
                  <Text
                    style={[styles.featureTitle, { color: feature.textColor }]}
                  >
                    {feature.title}
                  </Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Puntos indicadores del carrusel */}
          <View style={styles.paginationContainer}>
            {features.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  activeFeatureIndex === index
                    ? styles.paginationDotActive
                    : styles.paginationDotInactive,
                ]}
                onPress={() => goToSlide(index)}
                activeOpacity={0.7}
              />
            ))}
          </View>
        </Card>

        {/* Temperaturas destacadas */}
        <Card style={styles.tempsCard}>
          <Text style={styles.sectionTitle}>🔥 {t('homeScreen.temps.title')}</Text>

          <View style={styles.tempsGrid}>
            {highlightedTemps.map((temp, index) => (
              <View
                key={index}
                style={[
                  styles.tempItem,
                  {
                    backgroundColor: `${temp.color}15`,
                    borderLeftWidth: 4,
                    borderLeftColor: temp.color,
                  },
                ]}
              >
                <View style={styles.tempHeader}>
                  <Text style={styles.tempIcon}>{temp.icon}</Text>
                  <Text style={[styles.tempValue, { color: temp.color }]}>
                    {temp.temp}
                  </Text>
                </View>
                <Text style={styles.tempLabel}>{temp.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* CTA */}
        <Card style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>{t('homeScreen.cta.title')}</Text>
          <Text style={styles.ctaDescription}>{t('homeScreen.cta.description')}</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Convertion')}
            activeOpacity={0.7}
          >
            <Text style={styles.ctaButtonText}>{t('homeScreen.cta.button')}</Text>
          </TouchableOpacity>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('homeScreen.footer.rights', { year: currentYear })}</Text>
          <Text style={styles.footerSubtext}>{t('homeScreen.footer.tool')}</Text>
          <Text style={styles.footerVersion}>v1.0.0</Text>
          <Image
            source={require('../assets/images/gaelectronica.png')}
            style={styles.footerLogo}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    padding: 16,
  },
  heroCard: {
    marginBottom: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actionButtons: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  actionButtonTextContainer: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  chevron: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  featuresCard: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  featuresScrollView: {
    marginHorizontal: -16,
  },
  featuresScrollContent: {
    paddingHorizontal: 16,
  },
  featureSlide: {
    width: width - 32, // Ancho de pantalla menos padding
    paddingHorizontal: 8,
  },
  featureItem: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    minHeight: 220,
    justifyContent: 'center',
  },
  featureIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureTitle: {
    fontSize: 18,
    // fontWeight: 'bold', // using Inter-Bold instead
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  featureDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Estilos para la paginación (puntos)
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  paginationDotActive: {
    backgroundColor: '#2196F3',
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  paginationDotInactive: {
    backgroundColor: '#E0E0E0',
  },
  tempsCard: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tempsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tempItem: {
    width: width > 400 ? '48%' : '100%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tempHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  tempIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  tempValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  tempLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  ctaCard: {
    marginBottom: 20,
    backgroundColor: '#2196F3',
    padding: 24,
    alignItems: 'center',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ctaTitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  ctaDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ctaButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2196F3',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  footerSubtext: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  footerVersion: {
    fontSize: 10,
    color: '#BBB',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  footerLogo: {
    width: 150,
    height: 150,
    marginTop: 16,
    resizeMode: 'contain',
    borderRadius: 30,
  },
  bottomSpacer: {
    height: 20,
  },
  scaleIconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  scaleIcon: {
    fontSize: 24,
    color: '#2196F3',
  },
});

export default HomeScreen;
