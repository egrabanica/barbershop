/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

import { supabase } from './client';
import type { Database } from '../types/supabase';

type Appointment = Database['public']['Tables']['appointments']['Row'];
type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];

export const appointmentsApi = {
  // Get user's appointments
  async getUserAppointments(
    userId: string,
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  ) {
    let query = supabase
      .from('appointments')
      .select(`
        id,
        start_time,
        end_time,
        status,
        notes,
        total_price,
        created_at,
        shops (
          id,
          name,
          address,
          image_url
        ),
        services (
          id,
          name,
          duration_minutes,
          base_price
        ),
        staff (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('client_id', userId)
      .order('start_time', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get upcoming appointments for a user
  async getUpcomingAppointments(userId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        start_time,
        end_time,
        status,
        notes,
        total_price,
        shops (
          id,
          name,
          address,
          image_url
        ),
        services (
          id,
          name,
          duration_minutes,
          base_price
        ),
        staff (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('client_id', userId)
      .in('status', ['pending', 'confirmed'])
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(10);

    return { data, error };
  },

  // Get past appointments for a user
  async getPastAppointments(userId: string, limit: number = 20, offset: number = 0) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        start_time,
        end_time,
        status,
        notes,
        total_price,
        shops (
          id,
          name,
          address,
          image_url
        ),
        services (
          id,
          name,
          duration_minutes,
          base_price
        ),
        staff (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('client_id', userId)
      .in('status', ['completed', 'cancelled'])
      .lt('start_time', new Date().toISOString())
      .order('start_time', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data, error };
  },

  // Book a new appointment
  async bookAppointment(appointmentData: AppointmentInsert) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select(`
        id,
        start_time,
        end_time,
        status,
        total_price,
        shops (
          id,
          name,
          address
        ),
        services (
          id,
          name,
          duration_minutes,
          base_price
        ),
        staff (
          id,
          first_name,
          last_name
        )
      `)
      .single();

    return { data, error };
  },

  // Reschedule an appointment
  async rescheduleAppointment(
    appointmentId: string,
    newStartTime: string,
    newStaffId?: string
  ) {
    const updates: AppointmentUpdate = {
      start_time: newStartTime,
      status: 'pending', // Reset to pending for confirmation
      updated_at: new Date().toISOString()
    };

    if (newStaffId) {
      updates.staff_id = newStaffId;
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', appointmentId)
      .select(`
        id,
        start_time,
        end_time,
        status,
        shops (
          name
        ),
        services (
          name
        ),
        staff (
          first_name,
          last_name
        )
      `)
      .single();

    return { data, error };
  },

  // Cancel an appointment
  async cancelAppointment(appointmentId: string, reason?: string) {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled by client',
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single();

    return { data, error };
  },

  // Get appointment details by ID
  async getAppointmentById(appointmentId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        shops (
          id,
          name,
          address,
          phone,
          image_url
        ),
        services (
          id,
          name,
          description,
          duration_minutes,
          base_price
        ),
        staff (
          id,
          first_name,
          last_name,
          avatar_url
        ),
        clients:users!appointments_client_id_fkey (
          id,
          first_name,
          last_name,
          phone,
          email
        )
      `)
      .eq('id', appointmentId)
      .single();

    return { data, error };
  },

  // Get shop's appointments (for staff/owners)
  async getShopAppointments(
    shopId: string,
    startDate?: string,
    endDate?: string,
    status?: string
  ) {
    let query = supabase
      .from('appointments')
      .select(`
        id,
        start_time,
        end_time,
        status,
        notes,
        total_price,
        services (
          id,
          name,
          duration_minutes,
          base_price
        ),
        staff (
          id,
          first_name,
          last_name
        ),
        clients:users!appointments_client_id_fkey (
          id,
          first_name,
          last_name,
          phone
        )
      `)
      .eq('shop_id', shopId)
      .order('start_time', { ascending: true });

    if (startDate) {
      query = query.gte('start_time', startDate);
    }

    if (endDate) {
      query = query.lte('start_time', endDate);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Confirm an appointment (staff/owner only)
  async confirmAppointment(appointmentId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single();

    return { data, error };
  },

  // Mark appointment as completed (staff/owner only)
  async completeAppointment(appointmentId: string, notes?: string) {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        status: 'completed',
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single();

    return { data, error };
  },
};
