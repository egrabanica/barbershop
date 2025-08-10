import express from 'express';
import { db } from '../index';
import { authenticateToken } from './auth';

const router = express.Router();

// Get all active shops
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        s.*,
        l.address,
        l.city,
        l.latitude,
        l.longitude,
        AVG(r.rating) as average_rating,
        COUNT(r.id) as review_count
      FROM shops s
      LEFT JOIN locations l ON s.id = l.shop_id AND l.is_active = true
      LEFT JOIN reviews r ON s.id = r.shop_id AND r.status = 'published'
      WHERE s.is_active = true
      GROUP BY s.id, l.id
      ORDER BY s.created_at DESC
    `);

    const shops = result.rows.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description,
      phone: shop.phone,
      email: shop.email,
      website: shop.website,
      logoUrl: shop.logo_url,
      coverImageUrl: shop.cover_image_url,
      currency: shop.currency,
      timezone: shop.timezone,
      location: {
        address: shop.address,
        city: shop.city,
        latitude: shop.latitude,
        longitude: shop.longitude,
      },
      rating: shop.average_rating ? parseFloat(shop.average_rating).toFixed(1) : null,
      reviewCount: parseInt(shop.review_count) || 0,
      loyaltyEnabled: shop.loyalty_enabled,
      reviewsEnabled: shop.reviews_enabled,
      waitlistEnabled: shop.waitlist_enabled,
      createdAt: shop.created_at,
    }));

    res.json(shops);
  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({ error: 'Failed to get shops' });
  }
});

// Get shop by ID with services
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get shop details
    const shopResult = await db.query(`
      SELECT 
        s.*,
        l.address,
        l.city,
        l.latitude,
        l.longitude,
        AVG(r.rating) as average_rating,
        COUNT(r.id) as review_count
      FROM shops s
      LEFT JOIN locations l ON s.id = l.shop_id AND l.is_active = true
      LEFT JOIN reviews r ON s.id = r.shop_id AND r.status = 'published'
      WHERE s.id = $1 AND s.is_active = true
      GROUP BY s.id, l.id
    `, [id]);

    if (shopResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const shop = shopResult.rows[0];

    // Get services
    const servicesResult = await db.query(`
      SELECT * FROM services 
      WHERE shop_id = $1 AND is_active = true 
      ORDER BY display_order, name
    `, [id]);

    // Get staff
    const staffResult = await db.query(`
      SELECT * FROM staff 
      WHERE shop_id = $1 AND is_active = true 
      ORDER BY name
    `, [id]);

    res.json({
      id: shop.id,
      name: shop.name,
      description: shop.description,
      phone: shop.phone,
      email: shop.email,
      website: shop.website,
      logoUrl: shop.logo_url,
      coverImageUrl: shop.cover_image_url,
      currency: shop.currency,
      timezone: shop.timezone,
      bookingWindowDays: shop.booking_window_days,
      cancellationWindowHours: shop.cancellation_window_hours,
      autoConfirmBookings: shop.auto_confirm_bookings,
      location: {
        address: shop.address,
        city: shop.city,
        latitude: shop.latitude,
        longitude: shop.longitude,
      },
      rating: shop.average_rating ? parseFloat(shop.average_rating).toFixed(1) : null,
      reviewCount: parseInt(shop.review_count) || 0,
      loyaltyEnabled: shop.loyalty_enabled,
      reviewsEnabled: shop.reviews_enabled,
      waitlistEnabled: shop.waitlist_enabled,
      services: servicesResult.rows.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        category: service.category,
        imageUrl: service.image_url,
        price: service.base_price_cents,
        duration: service.duration_minutes,
        requiresDeposit: service.requires_deposit,
        depositPercentage: service.deposit_percentage,
      })),
      staff: staffResult.rows.map(member => ({
        id: member.id,
        name: member.name,
        bio: member.bio,
        avatarUrl: member.avatar_url,
        specialties: member.specialties,
        acceptsBookings: member.accepts_bookings,
      })),
      createdAt: shop.created_at,
    });
  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({ error: 'Failed to get shop' });
  }
});

export default router;
