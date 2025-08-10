/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useRouter, useSegments } from 'expo-router';

import { supabase, IS_LOCALHOST_MOBILE, IS_DEVELOPMENT_MODE } from '../api/client';
import { mockApi, mockUser, shouldUseMockData } from '../services/mockData';
import type { User, UserRole } from '../types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (IS_LOCALHOST_MOBILE || IS_DEVELOPMENT_MODE) {
      // In development mode, skip network calls and show auth screens
      console.log('[AuthProvider] Running in development mode - skipping network calls');
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      setSession(session);
      
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Navigation effect
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Redirect to sign in
      router.replace('/login');
    } else if (session && inAuthGroup) {
      // Redirect to main app
      router.replace('/home');
    }
  }, [session, segments, loading]);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        // If user profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          await createUserProfile(supabaseUser);
        }
      } else {
        setUser({
          id: data.id,
          email: data.email,
          role: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          avatarUrl: data.avatar_url,
          dateOfBirth: data.date_of_birth,
          marketingConsent: data.marketing_consent,
          smsConsent: data.sms_consent,
          pushToken: data.push_token,
          timezone: data.timezone,
          preferredLanguage: data.preferred_language,
          lastActive: data.last_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: 'client' as UserRole,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
      } else {
        setUser({
          id: data.id,
          email: data.email,
          role: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          avatarUrl: data.avatar_url,
          dateOfBirth: data.date_of_birth,
          marketingConsent: data.marketing_consent,
          smsConsent: data.sms_consent,
          pushToken: data.push_token,
          timezone: data.timezone,
          preferredLanguage: data.preferred_language,
          lastActive: data.last_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    // Use mock data in development mode
    if (shouldUseMockData()) {
      const result = await mockApi.signIn(email, password);
      if (result.user) {
        setUser(result.user);
        setSession({ user: { id: result.user.id, email: result.user.email } } as Session);
        return {};
      }
      return { error: result.error || 'Login failed' };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: Partial<User>
  ) => {
    // Use mock data in development mode
    if (shouldUseMockData()) {
      const result = await mockApi.signUp(email, password);
      if (result.user) {
        const newUser = { ...result.user, ...userData };
        setUser(newUser);
        setSession({ user: { id: newUser.id, email: newUser.email } } as Session);
        return {};
      }
      return { error: result.error || 'Sign up failed' };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    // In mock mode, just clear local state
    if (shouldUseMockData()) {
      setUser(null);
      setSession(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      return { error: 'No user logged in' };
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          phone: updates.phone,
          avatar_url: updates.avatarUrl,
          date_of_birth: updates.dateOfBirth,
          marketing_consent: updates.marketingConsent,
          sms_consent: updates.smsConsent,
          timezone: updates.timezone,
          preferred_language: updates.preferredLanguage,
        })
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Update local state
      setUser({ ...user, ...updates });
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
