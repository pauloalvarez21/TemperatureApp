// Mock para react-native-google-mobile-ads
// Esto previene el error "Invariant Violation: TurboModuleRegistry.getEnforcing(...): 'RNGoogleMobileAdsModule' could not be found."
// al ejecutar tests que indirectamente importan este módulo.
jest.mock('react-native-google-mobile-ads', () => ({
  BannerAd: 'BannerAd',
  BannerAdSize: { ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER' },
  TestIds: { ADAPTIVE_BANNER: 'ADAPTIVE_BANNER' },
  useForeground: (callback) => callback(), // Ejecuta el callback inmediatamente para cubrir esa línea
}));