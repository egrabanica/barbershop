import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IS_DEVELOPMENT_MODE } from '../api/client';

export function DevelopmentBanner() {
  if (!IS_DEVELOPMENT_MODE || !__DEV__) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        🔧 Development Mode - No Backend Connected
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#ff9500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
