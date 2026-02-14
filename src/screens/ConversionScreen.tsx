import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConversionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Conversion Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ConversionScreen;
