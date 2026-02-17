import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { t } from '../i18n';

// Importamos las pantallas
import HomeScreen from '../screens/HomeScreen';
import ConversionScreen from '../screens/ConversionScreen';
import ExplanationScreen from '../screens/ExplanationScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, // Muestra el título arriba
        tabBarActiveTintColor: 'blue', // Color del ícono/texto activo
        tabBarInactiveTintColor: 'gray', // Color inactivo
        tabBarStyle: { paddingBottom: 5, height: 60 }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: t('home'),
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../assets/images/home.png')} 
              style={styles.tabIcon}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Conversion" 
        component={ConversionScreen} 
        options={{ 
          tabBarLabel: t('conversion'),
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../assets/images/temperature.png')} 
              style={styles.tabIcon}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Explanation"
        component={ExplanationScreen} 
        options={{ 
          tabBarLabel: t('explanation'),
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../assets/images/info.png')} 
              style={styles.tabIcon}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});
