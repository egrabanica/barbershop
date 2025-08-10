# Barbershop App - Setup Guide

## Current Status: M0 Complete + M1 Started

✅ **Milestone 0 Complete:**
- [x] GitHub repo structure with workflows
- [x] Docker Compose configuration for all services
- [x] Supabase structure with migrations and RLS policies
- [x] Basic Expo app with navigation and authentication
- [x] Self-hosted stack configuration (zero SaaS lock-in)

🚧 **Milestone 1 In Progress:**
- [x] Auth provider with Supabase integration
- [x] Basic navigation with tabs
- [x] Theme provider (light/dark mode)
- [x] Login screen and user profile
- [ ] Database connection and user management
- [ ] Complete navigation screens

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+** installed
- **Docker & Docker Compose** installed
- **Expo CLI** installed globally: `npm install -g @expo/cli`
- **PostgreSQL** (if running without Docker)

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install mobile app dependencies
cd apps/mobile
npm install
cd ../..
```

### 2. Setup Environment

Copy the environment file:
```bash
cp .env.example .env.local
```

The `.env.local` is already configured for local development.

### 3. Start Services

**Option A: With Docker (Recommended)**
```bash
# Start all services (Supabase, PostHog, Novu)
docker compose up -d

# Check service status
docker compose ps
```

**Option B: Local PostgreSQL Only**
```bash
# Ensure PostgreSQL is running locally
# Database: barbershop
# User: postgres  
# Password: barbershop123
```

### 4. Setup Database

If using Docker Compose, the database will be automatically initialized with our migrations.

If using local PostgreSQL:
```bash
# Create database
createdb barbershop

# Run migrations (when Supabase CLI is set up)
supabase db reset
```

### 5. Start Mobile App

```bash
cd apps/mobile
expo start
```

This will open the Expo development server. You can:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator  
- Scan QR code with Expo Go app on your phone

## Project Structure

```
barbershop-app/
├── apps/mobile/                 # Expo React Native app
│   ├── app/                     # Expo Router screens
│   │   ├── (auth)/             # Authentication screens
│   │   ├── (tabs)/             # Main app tabs
│   │   └── _layout.tsx         # Root layout with providers
│   ├── src/                    # Source code
│   │   ├── api/                # API client & services
│   │   ├── providers/          # React contexts (Auth, Theme, etc.)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── theme/              # Colors and styling
│   │   └── types/              # TypeScript definitions
│   └── assets/                 # Images, fonts, icons
├── supabase/                   # Database & backend
│   ├── config.toml            # Supabase configuration
│   ├── migrations/            # Database migrations
│   └── seed.sql              # Sample data
├── docker/                    # Docker configurations
├── .github/                   # CI/CD workflows
└── docs/                     # Documentation
```

## Development Workflow

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feat/user-authentication
   ```

2. **Make your changes** following the established patterns

3. **Run checks:**
   ```bash
   # Type checking
   cd apps/mobile && npm run typecheck
   
   # Linting
   npm run lint
   
   # Tests
   npm run test
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat(auth): implement user login flow"
   git push origin feat/user-authentication
   ```

5. **Create Pull Request** with the provided template

### Database Changes

When you need to modify the database:

1. Create a new migration file in `supabase/migrations/`
2. Update the TypeScript types in `src/types/supabase.ts`
3. Test with seed data in `supabase/seed.sql`

## Next Development Tasks

### Immediate (M1 Completion)
1. **Set up Supabase CLI** for database management
2. **Test authentication flow** with real database
3. **Implement user registration** screen
4. **Add input validation** with Zod schemas
5. **Create shop discovery** screen with real data

### Short-term (M2)
1. **Availability engine** implementation
2. **Booking flow** screens
3. **Appointment management** 
4. **Calendar integration**
5. **Optimistic UI updates**

### Medium-term (M3-M4)
1. **Owner dashboard** implementation
2. **Staff management** screens
3. **Service configuration**
4. **Loyalty points system**
5. **Promo code validation**

## Service URLs (Development)

When running with Docker Compose:

- **Mobile App**: http://localhost:8081 (Expo)
- **Supabase API**: http://localhost:54321
- **Supabase Studio**: http://localhost:54323
- **PostHog**: http://localhost:8000
- **Novu Web**: http://localhost:4200
- **Database**: localhost:54322 (port 5432 inside container)

## Environment Variables

Key environment variables for development:

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Features (disabled for local dev)
ENABLE_STRIPE=false
ENABLE_ANALYTICS=false
USE_ONESIGNAL=false
```

## Troubleshooting

### Common Issues

1. **"Metro bundler error"**: Clear cache with `expo start -c`
2. **"Database connection failed"**: Check if PostgreSQL/Docker is running
3. **"Module not found"**: Run `npm install` in both root and `apps/mobile`
4. **"Auth context error"**: Ensure you're using hooks inside provider tree

### Database Issues

```bash
# Reset Supabase database
supabase db reset

# View logs
docker compose logs postgres

# Connect to database
docker compose exec postgres psql -U postgres -d barbershop
```

### Mobile Development

```bash
# Clear Expo cache
expo start -c

# Reset Metro bundler
npx react-native-clean-project

# View device logs
expo start --no-dev --minify
```

## Contributing

1. Follow the **AI Collaboration Protocol** in the project brief
2. Use **conventional commits**: `feat:`, `fix:`, `chore:`, etc.
3. Keep PRs **focused and small** (one feature per PR)
4. Include **tests** for new functionality
5. Update **documentation** for significant changes

## Security Notes

- Never commit real API keys or secrets
- Use environment variables for all configuration
- Review RLS policies before production deployment
- Regularly update dependencies for security patches

## Support

- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check `docs/` folder for detailed guides

---

**Next Step**: Set up Supabase CLI and test the authentication flow with the database.

Run this to continue development:
```bash
cd apps/mobile && expo start
```
