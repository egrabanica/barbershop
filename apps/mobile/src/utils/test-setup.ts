/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
// Mock React Native modules that don't exist in Node.js test environment
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock MMKV storage
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

// Mock Expo StatusBar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};