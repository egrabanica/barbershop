/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Database } from '../types/supabase';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Development mode detection
const isDemoMode = supabaseUrl.includes('demo.supabase.local') || supabaseUrl.includes('placeholder');
const isLocalhost = supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1');
const shouldDisableAutoRefresh = (isLocalhost || isDemoMode) && Platform.OS !== 'web';

// Export development mode flag
export const IS_DEVELOPMENT_MODE = isDemoMode || __DEV__;

if (shouldDisableAutoRefresh || isDemoMode) {
  // eslint-disable-next-line no-console
  console.warn('[Supabase] Running in development mode without backend. Network requests will be mocked or disabled.');
}

// Create Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: !shouldDisableAutoRefresh,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'barbershop-app@1.0.0',
      },
    },
  }
);

// Helper so other modules can guard network calls in Expo Go + localhost
export const IS_LOCALHOST_MOBILE = shouldDisableAutoRefresh;

// Export types for easier importing
export type { Database } from '../types/supabase';
