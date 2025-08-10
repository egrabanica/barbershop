/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <Text style={styles.title}>🏠 Barbershop App</Text>
        <Text style={styles.subtitle}>Milestone 0: Infrastructure Ready</Text>
        <Text style={styles.description}>
          ✅ Self-hosted Supabase + PostHog + Novu{'\n'}
          ✅ Expo TypeScript scaffold{'\n'}
          ✅ GitHub Actions CI/CD{'\n'}
          ✅ Zero SaaS lock-in architecture
        </Text>
        <StatusBar style="auto" />
      </View>
    </QueryClientProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions:{
    queries :{
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
});
