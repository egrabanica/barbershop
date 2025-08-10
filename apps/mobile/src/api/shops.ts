/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

import { supabase } from './client';
import type { Database } from '../types/supabase';

type Shop = Database['public']['Tables']['shops']['Row'];
type ShopInsert = Database['public']['Tables']['shops']['Insert'];
type ShopUpdate = Database['public']['Tables']['shops']['Update'];

export const shopsApi = {
  // Get all shops with basic filters
  async getShops(params?: {
    search?: string;
    location?: { latitude: number; longitude: number; radius?: number };
    rating?: number;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('shops')
      .select(`
        id,
        name,
        description,
        address,
        phone,
        website,
        rating,
        review_count,
        image_url,
        latitude,
        longitude,
        opening_hours,
        is_active,
        created_at
      `)
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (params?.search) {
      query = query.or(
        `name.ilike.%${params.search}%,description.ilike.%${params.search}%,address.ilike.%${params.search}%`
      );
    }

    if (params?.rating) {
      query = query.gte('rating', params.rating);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params?.limit || 10) - 1);
    }

    const { data, error } = await query;

    return { data, error };
  },

  // Get shop by ID with detailed information
  async getShopById(shopId: string) {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        services (
          id,
          name,
          description,
          duration_minutes,
          base_price,
          is_active
        ),
        staff (
          id,
          first_name,
          last_name,
          role,
          specialties,
          avatar_url,
          is_active
        ),
        reviews (
          id,
          rating,
          comment,
          created_at,
          users (
            first_name,
            last_name,
            avatar_url
          )
        )
      `)
      .eq('id', shopId)
      .eq('is_active', true)
      .single();

    return { data, error };
  },

  // Get shops near a location (requires PostGIS extension)
  async getShopsNearby(latitude: number, longitude: number, radiusKm: number = 10) {
    const { data, error } = await supabase.rpc('shops_nearby', {
      lat: latitude,
      long: longitude,
      radius_km: radiusKm
    });

    return { data, error };
  },

  // Get featured shops
  async getFeaturedShops(limit: number = 5) {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        id,
        name,
        description,
        address,
        rating,
        review_count,
        image_url,
        latitude,
        longitude
      `)
      .eq('is_active', true)
      .gte('rating', 4.0)
      .order('review_count', { ascending: false })
      .limit(limit);

    return { data, error };
  },

  // Create a new shop (owner only)
  async createShop(shopData: ShopInsert) {
    const { data, error } = await supabase
      .from('shops')
      .insert(shopData)
      .select()
      .single();

    return { data, error };
  },

  // Update shop information (owner only)
  async updateShop(shopId: string, updates: ShopUpdate) {
    const { data, error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', shopId)
      .select()
      .single();

    return { data, error };
  },

  // Get shop reviews
  async getShopReviews(shopId: string, limit: number = 20, offset: number = 0) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        users (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data, error };
  },

  // Add review for a shop
  async addReview(shopId: string, appointmentId: string, rating: number, comment?: string) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        shop_id: shopId,
        appointment_id: appointmentId,
        rating,
        comment,
      })
      .select()
      .single();

    return { data, error };
  },
};
