/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

import type { User } from '../types/auth';
import type { Shop } from '../types/shop';
import type { Appointment } from '../types/appointment';

// Mock user data
export const mockUser: User = {
  id: 'mock-user-id',
  email: 'demo@barbershop.local',
  role: 'client',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  avatarUrl: null,
  dateOfBirth: null,
  marketingConsent: false,
  smsConsent: false,
  pushToken: null,
  timezone: 'America/New_York',
  preferredLanguage: 'en',
  lastActive: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock shop data
export const mockShops: Shop[] = [
  {
    id: 'shop-1',
    name: 'Classic Cuts',
    description: 'Traditional barbershop with modern techniques',
    address: '123 Main St, City, State 12345',
    phone: '+1234567890',
    email: 'info@classiccuts.com',
    latitude: 40.7128,
    longitude: -74.0060,
    rating: 4.8,
    reviewCount: 124,
    images: [],
    hours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '20:00', isOpen: true },
      saturday: { open: '08:00', close: '17:00', isOpen: true },
      sunday: { open: '10:00', close: '16:00', isOpen: true },
    },
    services: [
      { id: 'service-1', name: 'Classic Cut', price: 25, duration: 30 },
      { id: 'service-2', name: 'Beard Trim', price: 15, duration: 15 },
      { id: 'service-3', name: 'Hot Towel Shave', price: 35, duration: 45 },
    ],
    barbers: [
      { 
        id: 'barber-1', 
        name: 'Mike Johnson', 
        bio: 'Master barber with 15 years experience',
        rating: 4.9,
        avatar: null
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'appointment-1',
    userId: mockUser.id,
    shopId: mockShops[0].id,
    barberId: mockShops[0].barbers[0].id,
    serviceIds: ['service-1'],
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    status: 'confirmed',
    totalPrice: 25,
    duration: 30,
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock API responses with delays to simulate network calls
export const mockApi = {
  // Auth methods
  signIn: async (email: string, password: string) => {
    await delay(1000);
    if (email === 'demo@barbershop.local' && password === 'demo123') {
      return { user: mockUser, error: null };
    }
    return { user: null, error: 'Invalid credentials' };
  },

  signUp: async (email: string, password: string) => {
    await delay(1000);
    return { user: { ...mockUser, email }, error: null };
  },

  // Shop methods
  getShops: async () => {
    await delay(800);
    return { data: mockShops, error: null };
  },

  getShop: async (id: string) => {
    await delay(500);
    const shop = mockShops.find(s => s.id === id);
    return { data: shop || null, error: shop ? null : 'Shop not found' };
  },

  // Appointment methods
  getAppointments: async (userId: string) => {
    await delay(600);
    const userAppointments = mockAppointments.filter(a => a.userId === userId);
    return { data: userAppointments, error: null };
  },

  createAppointment: async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(1000);
    const newAppointment: Appointment = {
      ...appointment,
      id: `appointment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockAppointments.push(newAppointment);
    return { data: newAppointment, error: null };
  },
};

// Helper function to simulate network delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if we should use mock data
export const shouldUseMockData = () => {
  const useMock = process.env.EXPO_PUBLIC_MOCK_DATA === 'true';
  const isDev = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
  const isDemo = process.env.EXPO_PUBLIC_SUPABASE_URL?.includes('demo.supabase.local');
  
  return useMock || (isDev && isDemo);
};
