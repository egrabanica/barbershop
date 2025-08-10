# Docker-Free Setup Guide

## Alternative Architecture (No Docker Required)

This guide shows how to run the barbershop app without Docker using free/local alternatives.

### Option 1: Supabase Cloud (Recommended for Development)
- **Database**: Supabase Cloud (free tier: 2 free projects, 500MB database)
- **Analytics**: PostHog Cloud (free tier: 1M events/month) OR disable
- **Notifications**: Novu Cloud (free tier: 30k notifications/month) OR disable
- **Local PostgreSQL**: For production self-hosting later

### Option 2: Fully Local
- **Database**: Local PostgreSQL installation
- **Backend**: Node.js/Express API server
- **Analytics**: Disabled or self-built
- **Notifications**: Expo notifications only

## Setup Instructions

### Prerequisites
- **Node.js 18+** installed
- **PostgreSQL 15+** (for local option)
- **Git** installed
- **Expo CLI**: `npm install -g @expo/cli`

### Step 1: Choose Your Setup

#### Option A: Supabase Cloud Setup (Easier)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for free account
   - Create new project

2. **Get Project Credentials**
   - In Supabase dashboard, go to Settings > API
   - Copy your Project URL and anon key

3. **Update Environment Variables**
   ```bash
   # Copy and edit
   cp .env.example .env.local
   ```

   Update `.env.local`:
   ```bash
   # Supabase Cloud Configuration
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # Feature Flags (optional services)
   ENABLE_ANALYTICS=false    # Disable PostHog for now
   ENABLE_NOVU=false         # Disable Novu for now
   ENABLE_STRIPE=false       # Disable Stripe
   ```

#### Option B: Local PostgreSQL Setup

1. **Install PostgreSQL**
   
   **Windows:**
   ```powershell
   # Using Chocolatey
   choco install postgresql
   
   # OR download from postgresql.org
   # Default port: 5432
   # Default user: postgres
   ```

2. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres -h localhost
   
   # Create database
   CREATE DATABASE barbershop;
   
   # Create user (optional)
   CREATE USER barbershop_user WITH ENCRYPTED PASSWORD 'barbershop123';
   GRANT ALL PRIVILEGES ON DATABASE barbershop TO barbershop_user;
   ```

3. **Update Environment Variables**
   ```bash
   # Local PostgreSQL Configuration
   EXPO_PUBLIC_SUPABASE_URL=http://localhost:3000
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/barbershop
   
   # Disable cloud services
   ENABLE_ANALYTICS=false
   ENABLE_NOVU=false
   ENABLE_STRIPE=false
   ```

### Step 2: Install Dependencies

```bash
# Root dependencies
npm install

# Mobile app dependencies
cd apps/mobile
npm install
cd ..
```

### Step 3: Setup Database Schema

#### For Supabase Cloud:

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login and Link Project**
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

3. **Push Database Schema**
   ```bash
   supabase db push
   ```

4. **Seed with Sample Data**
   ```bash
   supabase db seed
   ```

#### For Local PostgreSQL:

1. **Run Migrations Manually**
   ```bash
   psql -U postgres -d barbershop -f supabase/migrations/001_initial_schema.sql
   psql -U postgres -d barbershop -f supabase/migrations/002_rls_policies.sql
   psql -U postgres -d barbershop -f supabase/seed.sql
   ```

### Step 4: Create Simple API Server (Local Option Only)

If using local PostgreSQL, you'll need a simple API server:

```bash
# Create server directory
mkdir server
cd server
npm init -y

# Install dependencies
npm install express cors pg dotenv @supabase/supabase-js
npm install -D nodemon typescript @types/node @types/express

# Create basic server
```

### Step 5: Start Development

#### For Supabase Cloud:
```bash
# Start mobile app only
cd apps/mobile
expo start
```

#### For Local Setup:
```bash
# Terminal 1: Start API server
cd server
npm run dev

# Terminal 2: Start mobile app
cd apps/mobile
expo start
```

## Environment Configuration Examples

### Supabase Cloud (.env.local)
```bash
# Supabase Cloud
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional Cloud Services (free tiers)
EXPO_PUBLIC_POSTHOG_API_KEY=phc_your_key_here
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com
EXPO_PUBLIC_NOVU_APP_ID=your_novu_app_id

# Features
ENABLE_ANALYTICS=true
ENABLE_NOVU=true
ENABLE_STRIPE=false
```

### Local PostgreSQL (.env.local)
```bash
# Local PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/barbershop
EXPO_PUBLIC_SUPABASE_URL=http://localhost:3000

# Local development
NODE_ENV=development
API_PORT=3000

# Features (disabled for local)
ENABLE_ANALYTICS=false
ENABLE_NOVU=false
ENABLE_STRIPE=false
```

## Migration Path to Self-Hosted

When you're ready to self-host everything:

1. **Export from Supabase Cloud**
   ```bash
   supabase db dump --data-only > backup.sql
   ```

2. **Set up your own PostgreSQL server**
   - AWS RDS, DigitalOcean, or your own VPS
   - Import your data

3. **Replace cloud services**
   - PostHog: Self-hosted instance
   - Novu: Self-hosted instance  
   - Supabase: Run your own instance

## Cost Comparison

### Free Tier Limits:
- **Supabase**: 2 projects, 500MB database, 50k monthly active users
- **PostHog**: 1M events/month, full feature set
- **Novu**: 30k notifications/month
- **Total**: $0/month for development

### Self-Hosted (later):
- **Server**: $5-20/month (VPS)
- **Database**: Included in VPS
- **Unlimited**: Everything unlimited on your hardware

## Advantages of This Approach

✅ **No Docker complexity**  
✅ **Free development environment**  
✅ **Easy to set up and maintain**  
✅ **Can migrate to self-hosted later**  
✅ **Uses standard tools**  
✅ **Windows-friendly**

## Next Steps

1. **Choose your option** (Supabase Cloud recommended for starting)
2. **Follow the setup steps** above
3. **Test the app** with `expo start`
4. **Continue with M1 development** (user registration, shop discovery)

Would you like me to help you set up either option?
