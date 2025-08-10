# Local Development Setup (No Docker)

This guide will help you set up the barbershop app locally on Windows without Docker.

## Prerequisites

### Required Software
1. **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
2. **PostgreSQL 15+** - [Download from postgresql.org](https://www.postgresql.org/download/windows/)
3. **Git** - [Download from git-scm.com](https://git-scm.com/downloads)
4. **Supabase CLI** - Install with: `npm install -g supabase`
5. **Expo CLI** - Install with: `npm install -g @expo/cli`

### Optional (for full stack)
6. **PostHog Community Edition** (self-hosted analytics)
7. **Novu** (self-hosted notifications)

## Quick Start

### 1. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd barbershop-app
npm install
cd apps/mobile
npm install
```

### 2. Setup PostgreSQL Database
1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE barbershop_dev;
CREATE USER barbershop_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE barbershop_dev TO barbershop_user;
```

2. Note your database connection details:
   - Host: `localhost`
   - Port: `5432` (default)
   - Database: `barbershop_dev`
   - Username: `barbershop_user`
   - Password: `your_password`

### 3. Setup Supabase (Local)
```bash
# Initialize Supabase project
supabase init

# Start Supabase locally (this will create a local Postgres instance)
supabase start

# This will show you the local URLs:
# - API URL: http://localhost:54321
# - GraphQL URL: http://localhost:54321/graphql/v1
# - DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# - Studio URL: http://localhost:54323
# - Inbucket URL: http://localhost:54324
# - JWT secret: your-super-secret-jwt-token-with-at-least-32-characters-long
# - anon key: your-anon-key
# - service_role key: your-service-role-key
```

### 4. Environment Configuration
Create `.env.local` file in the root:
```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Supabase Local
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-from-supabase-start"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-from-supabase-start"

# Expo
EXPO_PUBLIC_SUPABASE_URL="http://localhost:54321"
EXPO_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-from-supabase-start"

# Optional: PostHog (self-hosted)
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-key"
NEXT_PUBLIC_POSTHOG_HOST="http://localhost:8000"

# Optional: Novu (self-hosted)
NOVU_API_KEY="your-novu-api-key"
NOVU_APPLICATION_IDENTIFIER="your-app-identifier"

# Optional: Stripe (for payments)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
ENABLE_STRIPE=false
```

Create `apps/mobile/.env` file:
```bash
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase-start
EXPO_PUBLIC_POSTHOG_KEY=your-posthog-key
EXPO_PUBLIC_POSTHOG_HOST=http://localhost:8000
```

### 5. Database Migration
```bash
# Apply database migrations
supabase db push

# Seed the database (optional)
supabase db seed
```

### 6. Start Development Servers
```bash
# Option 1: Start all services with one command
npm run dev:local

# Option 2: Start services individually
# Terminal 1: Start Supabase (if not already running)
supabase start

# Terminal 2: Start mobile app
cd apps/mobile
expo start
```

## Service URLs (Local Development)
- **Mobile App**: Expo dev server (usually http://localhost:8081)
- **Supabase Studio**: http://localhost:54323
- **Supabase API**: http://localhost:54321
- **PostHog** (if setup): http://localhost:8000
- **Novu** (if setup): http://localhost:3000

## Troubleshooting

### PostgreSQL Connection Issues
1. Verify PostgreSQL service is running:
   ```bash
   # Windows
   services.msc
   # Look for "postgresql-x64-15" service
   ```

2. Test connection:
   ```bash
   psql -h localhost -p 5432 -U barbershop_user -d barbershop_dev
   ```

### Supabase Issues
1. Reset Supabase local instance:
   ```bash
   supabase stop
   supabase start
   ```

2. Check Supabase status:
   ```bash
   supabase status
   ```

### Expo/Metro Issues
1. Clear Metro cache:
   ```bash
   cd apps/mobile
   npx expo start --clear
   ```

2. Reset node_modules:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Health Checks

### Verify Setup is Working
1. **Database**: Visit http://localhost:54323 (Supabase Studio)
2. **API**: Test API endpoint:
   ```bash
   curl http://localhost:54321/rest/v1/health
   ```
3. **Mobile App**: Scan QR code with Expo Go app or run on simulator
4. **Auth**: Try creating a test user in Supabase Studio

### Quick Test Script
```bash
# Test all services
npm run health-check
```

## Optional: Self-Hosted Analytics (PostHog)

### Setup PostHog Community Edition
1. Download and extract PostHog:
   ```bash
   git clone https://github.com/PostHog/posthog.git
   cd posthog
   ```

2. Follow PostHog local development setup instructions

3. Add PostHog config to your `.env.local`

## Optional: Self-Hosted Notifications (Novu)

### Setup Novu
1. Clone Novu repository:
   ```bash
   git clone https://github.com/novuhq/novu.git
   cd novu
   ```

2. Follow Novu local development setup instructions

3. Add Novu config to your `.env.local`

## Production Deployment Notes

For production deployment, you can:

1. **Database**: Use managed PostgreSQL (Supabase Cloud, Railway, PlanetScale)
2. **Backend**: Deploy Supabase Edge Functions to Supabase Cloud or Vercel
3. **Analytics**: Self-host PostHog on VPS or use PostHog Cloud
4. **Notifications**: Self-host Novu on VPS or use managed service
5. **Mobile**: Build with `eas build` and deploy to App Store/Google Play

## Next Steps

Once your local environment is running:
1. Verify the mobile app boots to placeholder Home screen
2. Test database connectivity through Supabase Studio
3. Run the test suite: `npm test`
4. Start working on Milestone 1 features

## Need Help?

- Check the [main README.md](./README.md) for project overview
- Review [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for detailed setup
- Create an issue using our [issue templates](./.github/ISSUE_TEMPLATE/)
