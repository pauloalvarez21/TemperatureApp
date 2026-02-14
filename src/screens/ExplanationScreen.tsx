import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExplanationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Explanation Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ExplanationScreen;
