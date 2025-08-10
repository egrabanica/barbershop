/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    
    // Barbershop brand colors
    primary: '#8B4513',    // Saddle Brown
    primaryDark: '#654321', // Dark Brown
    primaryLight: '#D2B48C', // Tan
    
    secondary: '#DAA520',  // Goldenrod
    accent: '#B8860B',     // Dark Goldenrod
    
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Grays
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    
    // UI elements
    cardBackground: '#fff',
    cardBorder: '#E5E7EB',
    inputBackground: '#F9FAFB',
    inputBorder: '#D1D5DB',
    placeholderText: '#9CA3AF',
    
    // Status colors
    pending: '#F59E0B',
    confirmed: '#22C55E',
    completed: '#3B82F6',
    cancelled: '#EF4444',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    
    // Barbershop brand colors (adjusted for dark mode)
    primary: '#D2B48C',    // Tan (lighter for dark mode)
    primaryDark: '#8B4513', // Saddle Brown
    primaryLight: '#F5DEB3', // Wheat
    
    secondary: '#FFD700',  // Gold
    accent: '#FFA500',     // Orange
    
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Grays (inverted)
    gray50: '#111827',
    gray100: '#1F2937',
    gray200: '#374151',
    gray300: '#4B5563',
    gray400: '#6B7280',
    gray500: '#9CA3AF',
    gray600: '#D1D5DB',
    gray700: '#E5E7EB',
    gray800: '#F3F4F6',
    gray900: '#F9FAFB',
    
    // UI elements
    cardBackground: '#1F2937',
    cardBorder: '#374151',
    inputBackground: '#111827',
    inputBorder: '#4B5563',
    placeholderText: '#6B7280',
    
    // Status colors
    pending: '#F59E0B',
    confirmed: '#22C55E',
    completed: '#3B82F6',
    cancelled: '#EF4444',
  },
};
