/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

export type UserRole = 'client' | 'staff' | 'owner' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  marketingConsent: boolean;
  smsConsent: boolean;
  pushToken?: string;
  timezone: string;
  preferredLanguage: string;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends LoginCredentials {
  firstName?: string;
  lastName?: string;
  phone?: string;
  marketingConsent?: boolean;
  smsConsent?: boolean;
}

export interface AuthError {
  message: string;
  code?: string;
}
