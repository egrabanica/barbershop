import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { Pool } from 'pg';

// Import routes
import authRoutes from './routes/auth';
import shopsRoutes from './routes/shops';
import appointmentsRoutes from './routes/appointments';

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

// Database connection
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection
db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Database connection error:', err));

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: ['http://localhost:8081', 'exp://localhost:8081', 'exp://192.168.*:8081'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0' 
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/shops', shopsRoutes);
app.use('/appointments', appointmentsRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`🚀 Barbershop API Server running on http://localhost:${port}`);
  console.log(`📱 Mobile app can connect to this server`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
});
