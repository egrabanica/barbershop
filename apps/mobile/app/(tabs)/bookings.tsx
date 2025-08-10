/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../../src/providers/ThemeProvider';
import { Colors } from '../../src/theme/Colors';

export default function BookingsScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>My Bookings</Text>
        <Text style={[styles.subtitle, { color: colors.gray500 }]}>
          Manage your appointments
        </Text>
        <Text style={[styles.placeholder, { color: colors.gray400 }]}>
          Coming in Milestone 2 - Booking Core
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
