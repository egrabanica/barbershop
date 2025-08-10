/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

import React, { createContext, useContext, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface NotificationContextType {
  // Will be expanded with Novu integration
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register for push notifications (best-effort; avoid crashing in Expo Go)
    registerForPushNotificationsAsync().catch((err) => {
      console.warn('Push registration skipped:', err?.message || String(err));
    });

    // Listen for notifications
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response:', response);
      // Handle notification tap
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const value = {
    // Placeholder for Novu integration
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    } catch {}
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return;
  }

  // In Expo Go, projectId may be missing; guard to avoid crashing
  try {
    const tokenResp = await Notifications.getExpoPushTokenAsync().catch((e) => {
      console.warn('Skipping push token fetch in this environment:', e?.message || String(e));
      return null as any;
    });
    const token = tokenResp?.data;
    if (token) {
      console.log('Push token:', token);
      // TODO: Send token to backend for Novu integration
    }
  } catch (error) {
    console.warn('Error getting push token (non-fatal):', (error as any)?.message || String(error));
  }
}
