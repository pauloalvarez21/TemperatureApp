/**
 * @file ConvertionScreen.tsx
 * @description Pantalla de conversión de temperaturas. Permite al usuario ingresar un valor,
 * seleccionar escalas de origen y destino, y visualizar el resultado con precisión ajustable.
 * Utiliza un hook personalizado para la lógica de conversión.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

import Card from '../components/Card';
import useTemperatureConverter from '../hooks/useTemperatureConverter';
import { TemperatureScale } from '../utils/temperatureConverter';
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

/**
 * Componente funcional que renderiza la pantalla de conversión.
 *
 * Gestiona la interacción del usuario para transformar valores entre diferentes escalas
 * termométricas. Incluye controles para intercambiar escalas, ajustar decimales y
 * reiniciar el formulario.
 *
 * @returns {React.JSX.Element} Elemento JSX que representa la pantalla.
 */
const ConvertionScreen = () => {

  const {
    inputValue,
    fromScale,
    toScale,
    error,
    setInputValue,
    setFromScale,
    setToScale,
    reset,
    formatResult,
    getScaleInfo,
    allScales,
  } = useTemperatureConverter();

  const [decimals, setDecimals] = useState<number>(2);

  /**
   * Renderiza el componente de selección de escala (Tarjeta con Picker).
   *
   * Muestra información visual de la escala seleccionada (símbolo, nombre) y
   * proporciona un menú desplegable para cambiarla.
   *
   * @param {TemperatureScale} selectedScale - Escala actualmente seleccionada.
   * @param {(scale: TemperatureScale) => void} onScaleChange - Callback ejecutado al cambiar la selección.
   * @param {string} label - Etiqueta descriptiva (ej: "De:", "A:").
   * @returns {React.JSX.Element} Elemento UI del selector.
   */
  const renderScaleSelector = (
    selectedScale: TemperatureScale,
    onScaleChange: (scale: TemperatureScale) => void,
    label: string,
  ) => {
    const scaleInfo = getScaleInfo(selectedScale);

    return (
      <Card style={styles.scaleSelectorCard}>
        <Text style={styles.selectorLabel}>{label}</Text>

        <View style={styles.scaleInfo}>
          <View style={styles.scaleIconContainer}>
            <Text style={styles.scaleIcon}>🌡️</Text>
          </View>
          <View style={styles.scaleTextContainer}>
            <Text style={styles.scaleName}>{scaleInfo.name}</Text>
            <Text style={styles.scaleSymbol}>{scaleInfo.symbol}</Text>
          </View>
        </View>

        <Text style={styles.scaleDescription}>{scaleInfo.description}</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedScale}
            onValueChange={itemValue =>
              onScaleChange(itemValue as TemperatureScale)
            }
            style={styles.picker}
            dropdownIconColor="#2196F3"
          >
            {allScales.map(scale => {
              const info = getScaleInfo(scale);
              return (
                <Picker.Item
                  key={scale}
                  label={`${info.name} (${info.symbol})`}
                  value={scale}
                />
              );
            })}
          </Picker>
        </View>
      </Card>
    );
  };

  const bannerRef = useRef<BannerAd>(null);

  useForeground(() => {
    if (Platform.OS === 'ios') {
      bannerRef.current?.load();
    }
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
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
          {/* Header con título */}

          <Card style={styles.heroCard}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logo}>🌡️</Text>
              </View>
              <Text style={styles.appName}>{t('conversionScreen.title')}</Text>
              <Text style={styles.appTagline}>{t('conversionScreen.subtitle')}</Text>
            </View>
          </Card>

          {/* Card principal de conversión */}
          <Card style={styles.mainCard}>
            {/* Input de temperatura */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>
                {t('conversionScreen.valueToConvert')}:
              </Text>

              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, error && styles.inputError]}
                    value={inputValue}
                    onChangeText={setInputValue}
                    keyboardType="numeric"
                    placeholder={t('conversionScreen.placeholder')}
                    placeholderTextColor="#999"
                  />
                  <View style={styles.inputUnitContainer}>
                    <Text style={styles.inputUnit}>
                      {getScaleInfo(fromScale).symbol}
                    </Text>
                  </View>
                </View>

                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorText}>
                      {t(`conversionScreen.errors.${error}`)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Selectores de escala */}
            <View style={styles.scalesSection}>
              <View style={styles.scalesGrid}>
                {renderScaleSelector(
                  fromScale,
                  setFromScale,
                  t('conversionScreen.from'),
                )}

                {renderScaleSelector(toScale, setToScale, t('conversionScreen.to'))}
              </View>
            </View>

            {/* Resultado */}
            <View style={styles.resultSection}>
              <Text style={styles.resultLabel}>{t('conversionScreen.result')}:</Text>

              <Card style={styles.resultCard}>
                <View style={styles.resultValueContainer}>
                  <Text style={styles.resultValue}>
                    {formatResult(decimals)}
                  </Text>
                </View>
              </Card>

              {/* Selector de decimales */}
              <View style={styles.decimalSection}>
                <Text style={styles.decimalLabel}>
                  {t('conversionScreen.decimals')}:
                </Text>

                <View style={styles.decimalButtons}>
                  {[0, 1, 2, 3, 4].map(num => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.decimalButton,
                        decimals === num && styles.decimalButtonActive,
                      ]}
                      onPress={() => setDecimals(num)}
                      activeOpacity={0.6}
                    >
                      <Text
                        style={[
                          styles.decimalButtonText,
                          decimals === num && styles.decimalButtonTextActive,
                        ]}
                      >
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Card>

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.resetButton]}
              onPress={reset}
              activeOpacity={0.7}
            >
              <Text style={styles.resetButtonIcon}>🔄</Text>
              <Text style={styles.resetButtonText}>
                {t('conversionScreen.reset')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('homeScreen.footer.rights')}</Text>
            <Text style={styles.footerSubtext}>{t('homeScreen.footer.tool')}</Text>
            <Text style={styles.footerVersion}>v1.0.0</Text>
            <Image
              source={require('../assets/images/gaelectronica.png')}
              style={styles.footerLogo}
            />
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logo: {
    fontSize: 30,
  },
  appName: {
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  appTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mainCard: {
    marginBottom: 25,
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputSection: {
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 18,
    // fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    backgroundColor: 'white',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 24,
    color: '#333',
    fontWeight: '600',
  },
  inputError: {
    color: '#F44336',
  },
  inputUnitContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F0F7FF',
    borderLeftWidth: 2,
    borderLeftColor: '#E0E0E0',
  },
  inputUnit: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    minWidth: 50,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '500',
  },
  scalesSection: {
    marginBottom: 25,
  },
  scalesGrid: {
    position: 'relative',
  },
  scaleSelectorCard: {
    marginBottom: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E8F0FE',
  },
  selectorLabel: {
    fontSize: 14,
    // fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Inter-SemiBold',
  },
  scaleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scaleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  scaleIcon: {
    fontSize: 24,
    color: '#2196F3',
  },
  scaleTextContainer: {
    flex: 1,
  },
  scaleName: {
    fontSize: 20,
    // fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  scaleSymbol: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: '#FF9800',
    fontFamily: 'Inter-Bold',
  },
  scaleDescription: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 15,
    lineHeight: 18,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  picker: {
    height: 70,
    backgroundColor: 'white',
  },
  resultSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    fontFamily: 'Inter-SemiBold',
  },
  resultCard: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  resultValueContainer: {
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  decimalSection: {
    alignItems: 'center',
  },
  decimalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontFamily: 'Inter-Regular',
  },
  decimalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  decimalButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1
  },
  decimalButtonActive: {
    backgroundColor: '#2196F3',
    elevation: 4,
    shadowOpacity: 0.3,
  },
  decimalButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  decimalButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionButtons: {
    marginBottom: 25,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resetButton: {
    backgroundColor: '#FFEBEE',
    borderWidth: 2,
    borderColor: '#FFCDD2',
  },
  resetButtonIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  resetButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 25,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  footerVersion: {
    fontSize: 11,
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
});

export default ConvertionScreen;
