/**
 * @file ExplanationScreen.tsx
 * @description Pantalla educativa que muestra información detallada sobre las escalas de temperatura.
 * Incluye tarjetas informativas, curiosidades y una tabla comparativa interactiva.
 * Carga los datos desde un archivo JSON estático y utiliza utilidades de conversión para generar equivalencias.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../i18n';

import Card from '../components/Card';
import {
  loadTemperatureScalesData,
  convertToAllScales,
} from '../utils/dataLoader';
import { TemperatureScaleData, AppData } from '../types/temperatureScales';

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

/**
 * Componente funcional que renderiza la pantalla de explicación.
 *
 * Presenta contenido educativo cargado dinámicamente, incluyendo historia, fórmulas
 * y una tabla de equivalencias entre todas las escalas soportadas.
 *
 * @returns {React.JSX.Element} Elemento JSX que representa la pantalla.
 */
const ExplanationScreen = () => {
  const [showFullTable, setShowFullTable] = useState(false);

  const data = loadTemperatureScalesData() as AppData;
  const {
    temperatureScales,
    commonTemperatures,
    curiosities,
    introText,
    finalNote,
  } = data;

  /**
   * Renderiza una tarjeta con la información detallada de una escala específica.
   *
   * @param {TemperatureScaleData} scale - Objeto con los datos de la escala (nombre, fórmula, descripción, etc).
   * @returns {React.JSX.Element} Tarjeta UI estilizada.
   */
  const renderScaleCard = (scale: TemperatureScaleData) => (
    <Card key={scale.id} style={styles.scaleCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.symbolBadge, { backgroundColor: scale.color }]}>
          <Text style={styles.symbolText}>{scale.symbol}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.scaleName}>
            {scale.name} ({scale.symbol})
          </Text>
          <Text style={styles.inventor}>
            {scale.inventor} ({scale.year})
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{scale.description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📌 {t('explanationScreen.keyPoints')}</Text>
        {scale.keyPoints.map((point, index) => (
          <View key={index} style={styles.pointItem}>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
            </View>
            <Text style={styles.pointText}>{point}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧮 {t('explanationScreen.formula')}</Text>
        <Card style={styles.formulaCard}>
          <Text style={styles.formulaText}>{scale.formula}</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌍 {t('explanationScreen.usage')}</Text>
        <View style={styles.usageContainer}>
          <Text style={styles.usageText}>{scale.usage}</Text>
        </View>
      </View>
    </Card>
  );

  /**
   * Renderiza la tabla comparativa de temperaturas.
   *
   * Gestiona la lógica de visualización expandida/colapsada y el cálculo de dimensiones
   * para el scroll horizontal y vertical de la tabla.
   *
   * @returns {React.JSX.Element} Componente de tabla dentro de una tarjeta.
   */
  const renderComparisonTable = () => {
    const tableWidth = Math.max(width, temperatureScales.length * 100 + 200);
    const rowHeight = 65;
    const headerHeight = 70;
    const visibleRows = showFullTable ? commonTemperatures.length : 3;
    const tableHeight = headerHeight + visibleRows * rowHeight;

    return (
      <Card style={styles.comparisonCard}>
        <View style={styles.comparisonHeader}>
          <Text style={styles.comparisonIcon}>📊</Text>
          <View style={styles.comparisonTitleContainer}>
            <Text style={styles.comparisonSubtitle}>
              {t('explanationScreen.comparison.subtitle')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.toggleTableButton}
            onPress={() => setShowFullTable(!showFullTable)}
          >
            <Text style={styles.toggleTableIcon}>
              {showFullTable ? '⬆️' : '⬇️'}
            </Text>
            <Text style={styles.toggleTableText}>
              {showFullTable
                ? t('explanationScreen.table.showLess')
                : t('explanationScreen.table.showFull')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenedor de la tabla que se expande dinámicamente */}
        <View style={[styles.tableContainerWrapper, { height: tableHeight }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.tableScrollContent}
          >
            <View style={[styles.tableContainer, { width: tableWidth }]}>
              {/* Cabecera */}
              <View style={styles.tableHeader}>
                <View style={styles.firstColumnHeader}>
                  <Text style={styles.firstColumnHeaderText}>
                    {t('explanationScreen.comparison.temperature')}
                  </Text>
                </View>
                {temperatureScales.map(scale => (
                  <View key={scale.id} style={styles.headerScaleCell}>
                    <View
                      style={[
                        styles.smallSymbolBadge,
                        { backgroundColor: scale.color },
                      ]}
                    >
                      <Text style={styles.smallSymbolText}>{scale.symbol}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Filas de datos - mostrar solo algunas temperaturas por defecto */}
              {(showFullTable
                ? commonTemperatures
                : commonTemperatures.slice(0, 3)
              ).map((temp, index) => {
                const convertedValues = convertToAllScales(temp.celsius);
                return (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 && styles.tableRowEven,
                    ]}
                  >
                    <View style={styles.firstColumnCell}>
                      <Text style={styles.tempName}>{temp.name}</Text>
                      <Text style={styles.tempCelsius}>({temp.celsius}°C)</Text>
                    </View>

                    {temperatureScales.map(scale => {
                      // Crea la clave para buscar en convertedValues
                      const scaleKey = scale.name
                        .toLowerCase()
                        .replace('grado ', '')
                        .replace(/[^a-z0-9]/g, ''); // Remueve caracteres no alfanuméricos

                      const valueString = convertedValues[scaleKey];

                      return (
                        <View key={scale.id} style={styles.tableCell}>
                          <Text style={styles.tempValue}>
                            {valueString || 'N/A'}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Instrucción de scroll horizontal */}
        <View style={styles.scrollInstruction}>
          <Text style={styles.scrollInstructionIcon}>↔️</Text>
          <Text style={styles.scrollInstructionText}>
            {t('explanationScreen.table.scrollInstruction')}
          </Text>
        </View>

        {/* Indicador de más elementos (solo cuando NO está expandido) */}
        {!showFullTable && commonTemperatures.length > 3 && (
          <View style={styles.moreItemsIndicator}>
            <Text style={styles.moreItemsText}>
              {t('explanationScreen.table.moreItems', {
                count: commonTemperatures.length - 3,
              })}
            </Text>
          </View>
        )}
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
        {/* Título y subtítulo en Card azul */}
        <Card style={styles.titleCard}>
          <View style={styles.titleContent}>
            <Text style={styles.titleIcon}>🌡️</Text>
            <Text style={styles.titleText}>{t('explanationScreen.title')}</Text>
            <Text style={styles.subtitleText}>
              {t('explanationScreen.subtitle', {
                count: temperatureScales.length,
              })}
            </Text>
            <Text style={styles.introText}>{t('explanationScreen.intro')}</Text>
          </View>
        </Card>

        {/* Introducción */}
        <Card style={styles.introHeroCard}>
          <View style={styles.introContent}>
            <Text style={styles.introIcon}>📖</Text>
            <Text style={styles.introHeroTitle}>{introText.title}</Text>
            <Text style={styles.introHeroText}>{introText.description}</Text>
          </View>
        </Card>

        {/* Sección de escalas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderTitle}>
            📚{' '}
            {t('explanationScreen.sectionScales', {
              count: temperatureScales.length,
            })}
          </Text>
          <Text style={styles.sectionHeaderSubtitle}>
            {t('explanationScreen.intro')}
          </Text>
        </View>

        {temperatureScales.map(renderScaleCard)}

        {/* Tabla de comparación */}
        {renderComparisonTable()}

        {/* Curiosidades */}
        <Card style={styles.curiositiesCard}>
          <View style={styles.curiositiesHeader}>
            <Text style={styles.curiositiesIcon}>🔍</Text>
            <Text style={styles.curiositiesTitle}>
              {t('explanationScreen.curiosities')}
            </Text>
          </View>

          <View style={styles.curiositiesGrid}>
            {curiosities.map((curiosity, index) => (
              <View key={index} style={styles.curiosityCard}>
                <Text style={styles.curiosityCardIcon}>{curiosity.icon}</Text>
                <Text style={styles.curiosityCardText}>{curiosity.text}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Nota final */}
        <Card style={styles.finalNoteCard}>
          <View style={styles.finalNoteHeader}>
            <Text style={styles.finalNoteIcon}>✨</Text>
            <Text style={styles.finalNoteTitle}>{finalNote.title}</Text>
          </View>
          <Text style={styles.finalNoteText}>{finalNote.text}</Text>
        </Card>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  titleCard: {
    marginBottom: 25,
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 30,
    elevation: 5,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  titleContent: {
    alignItems: 'center',
  },
  titleIcon: {
    fontSize: 40,
    marginBottom: 15,
  },
  titleText: {
    fontSize: 32,
    color: 'rgba(255, 255, 255)',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  subtitleText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  introText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 22,
  },
  introHeroCard: {
    marginBottom: 25,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  introContent: {
    alignItems: 'center',
  },
  introIcon: {
    fontSize: 40,
    marginBottom: 15,
    color: 'white',
  },
  introHeroTitle: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  introHeroText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionHeader: {
    marginBottom: 25,
  },
  sectionHeaderTitle: {
    fontSize: 24,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Inter-Regular',
  },
  sectionHeaderSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  scaleCard: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 6,
    borderLeftColor: '#2196F3',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  symbolBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  symbolText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerContent: {
    flex: 1,
  },
  scaleName: {
    fontSize: 22,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  inventor: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'justify',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    // fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  pointItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bulletContainer: {
    width: 24,
    alignItems: 'center',
  },
  bullet: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  formulaCard: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formulaText: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: '#D32F2F',
    textAlign: 'center',
    fontWeight: '600',
  },
  usageContainer: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginTop: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  usageText: {
    fontSize: 15,
    color: '#2E7D32',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  comparisonCard: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  comparisonIcon: {
    fontSize: 28,
    marginRight: 15,
    marginTop: 4,
  },
  comparisonTitleContainer: {
    flex: 1,
  },
  comparisonSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  toggleTableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  toggleTableIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  toggleTableText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  tableContainerWrapper: {
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  tableScrollContent: {
    // La altura será controlada por el contenedor wrapper
  },
  tableContainer: {
    backgroundColor: 'white',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    minHeight: 70,
  },
  firstColumnHeader: {
    width: 160,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
  },
  firstColumnHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: 18,
  },
  headerScaleCell: {
    width: 90,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  smallSymbolBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  smallSymbolText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: 65,
  },
  tableRowEven: {
    backgroundColor: '#F8F9FA',
  },
  firstColumnCell: {
    width: 160,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F7FF',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  tableCell: {
    width: 90,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  tempName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  tempCelsius: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tempValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  moreItemsIndicator: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    marginTop: 5,
    borderRadius: 8,
  },
  moreItemsText: {
    fontSize: 12,
    color: '#FF9800',
    fontStyle: 'italic',
  },
  scrollInstruction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F7FF',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  scrollInstructionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  scrollInstructionText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  curiositiesCard: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  curiositiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  curiositiesIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  curiositiesTitle: {
    fontSize: 22,
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
  curiositiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  curiosityCard: {
    width: width > 400 ? '48%' : '100%',
    backgroundColor: '#F3E5F5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  curiosityCardIcon: {
    fontSize: 30,
    marginBottom: 12,
  },
  curiosityCardText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
    lineHeight: 18,
  },
  finalNoteCard: {
    marginBottom: 25,
    backgroundColor: '#E0F7FA',
    borderRadius: 20,
    padding: 25,
    borderLeftWidth: 6,
    borderLeftColor: '#00BCD4',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  finalNoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'center',
  },
  finalNoteIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  finalNoteTitle: {
    fontSize: 22,
    color: '#00838F',
    fontFamily: 'Inter-Regular',
  },
  finalNoteText: {
    fontSize: 15,
    color: '#006064',
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
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
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
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
});

export default ExplanationScreen;
