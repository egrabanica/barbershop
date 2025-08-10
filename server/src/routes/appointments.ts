import express from 'express';
import { db } from '../index';
import { authenticateToken } from './auth';

const router = express.Router();

// Get user's appointments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const result = await db.query(`
      SELECT 
        a.*,
        s.name as service_name,
        s.duration_minutes,
        st.name as staff_name,
        sh.name as shop_name,
        l.address as shop_address
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      LEFT JOIN staff st ON a.staff_id = st.id
      JOIN shops sh ON a.shop_id = sh.id
      LEFT JOIN locations l ON sh.id = l.shop_id AND l.is_active = true
      WHERE a.client_id = $1
      ORDER BY a.start_time DESC
    `, [userId]);

    const appointments = result.rows.map(appointment => ({
      id: appointment.id,
      shopId: appointment.shop_id,
      shopName: appointment.shop_name,
      shopAddress: appointment.shop_address,
      serviceId: appointment.service_id,
      serviceName: appointment.service_name,
      duration: appointment.duration_minutes,
      staffId: appointment.staff_id,
      staffName: appointment.staff_name,
      startTime: appointment.start_time,
      endTime: appointment.end_time,
      status: appointment.status,
      totalPrice: appointment.total_price_cents,
      depositPaid: appointment.deposit_paid_cents,
      notes: appointment.notes,
      createdAt: appointment.created_at,
      confirmedAt: appointment.confirmed_at,
      completedAt: appointment.completed_at,
      cancelledAt: appointment.cancelled_at,
      cancellationReason: appointment.cancellation_reason,
    }));

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
});

// Create appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const {
      shopId,
      serviceId,
      staffId,
      startTime,
      notes,
    } = req.body;

    // Validation
    if (!shopId || !serviceId || !startTime) {
      return res.status(400).json({ error: 'Shop, service, and start time are required' });
    }

    // Get service details
    const serviceResult = await db.query(
      'SELECT * FROM services WHERE id = $1 AND shop_id = $2 AND is_active = true',
      [serviceId, shopId]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = serviceResult.rows[0];

    // Calculate end time
    const start = new Date(startTime);
    const end = new Date(start.getTime() + service.duration_minutes * 60000);

    // Check for conflicts (simplified)
    const conflictResult = await db.query(`
      SELECT id FROM appointments 
      WHERE staff_id = $1 
      AND status NOT IN ('cancelled', 'no_show')
      AND (
        (start_time <= $2 AND end_time > $2) OR
        (start_time < $3 AND end_time >= $3) OR
        (start_time >= $2 AND end_time <= $3)
      )
    `, [staffId, start.toISOString(), end.toISOString()]);

    if (conflictResult.rows.length > 0) {
      return res.status(409).json({ error: 'Time slot not available' });
    }

    // Get user details
    const userResult = await db.query(
      'SELECT first_name, last_name, phone, email FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];

    // Create appointment
    const appointmentResult = await db.query(`
      INSERT INTO appointments (
        shop_id, client_id, service_id, staff_id,
        start_time, end_time, total_price_cents,
        client_name, client_phone, client_email, notes,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')
      RETURNING *
    `, [
      shopId,
      userId,
      serviceId,
      staffId,
      start.toISOString(),
      end.toISOString(),
      service.base_price_cents,
      `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      user.phone,
      user.email,
      notes
    ]);

    const appointment = appointmentResult.rows[0];

    res.status(201).json({
      id: appointment.id,
      shopId: appointment.shop_id,
      serviceId: appointment.service_id,
      serviceName: service.name,
      staffId: appointment.staff_id,
      startTime: appointment.start_time,
      endTime: appointment.end_time,
      status: appointment.status,
      totalPrice: appointment.total_price_cents,
      notes: appointment.notes,
      createdAt: appointment.created_at,
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Cancel appointment
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { reason } = req.body;

    // Check if appointment belongs to user
    const result = await db.query(
      'SELECT * FROM appointments WHERE id = $1 AND client_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = result.rows[0];

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ error: 'Appointment already cancelled' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed appointment' });
    }

    // Update appointment
    const updateResult = await db.query(`
      UPDATE appointments 
      SET status = 'cancelled', 
          cancelled_at = NOW(),
          cancellation_reason = $2
      WHERE id = $1
      RETURNING *
    `, [id, reason]);

    const updatedAppointment = updateResult.rows[0];

    res.json({
      id: updatedAppointment.id,
      status: updatedAppointment.status,
      cancelledAt: updatedAppointment.cancelled_at,
      cancellationReason: updatedAppointment.cancellation_reason,
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

export default router;
