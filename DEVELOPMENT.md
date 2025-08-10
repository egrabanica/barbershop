# Development Setup Guide

This guide helps you set up the barbershop app for development when the full Supabase backend isn't available.

## Current Setup

Your app is now configured to work in **development mode** with mock data when the Supabase backend isn't running. This eliminates the network errors you were seeing.

## Development Mode Features

The app automatically detects when it's running in development mode and:
- ✅ **Disables real network calls** to prevent "Network request failed" errors
- ✅ **Uses mock data** for authentication, shops, and appointments
- ✅ **Shows proper loading states** to simulate real API calls
- ✅ **Includes test data** for development and testing

## Quick Start

1. **Start the development server:**
   ```bash
   npm run mobile:start
   # or
   cd apps/mobile && npm start
   ```

2. **Use the demo login credentials:**
   - Email: `demo@barbershop.local`
   - Password: `demo123`

3. **The app will now work without any backend setup!**

## Environment Configuration

The `.env` file in `apps/mobile/` controls development behavior:

```bash
# Enables development mode
EXPO_PUBLIC_DEV_MODE=true
EXPO_PUBLIC_MOCK_DATA=true

# Demo Supabase URL (triggers mock mode)
EXPO_PUBLIC_SUPABASE_URL=https://demo.supabase.local
EXPO_PUBLIC_SUPABASE_ANON_KEY=demo-key-for-development-only
```

## What's Included in Mock Mode

### Demo User
- **Email:** demo@barbershop.local
- **Name:** John Doe
- **Role:** Client
- **Phone:** +1234567890

### Demo Shop
- **Name:** Classic Cuts
- **Services:** Classic Cut ($25), Beard Trim ($15), Hot Towel Shave ($35)
- **Barber:** Mike Johnson
- **Rating:** 4.8/5

### Demo Appointment
- **Service:** Classic Cut
- **Date:** Tomorrow
- **Status:** Confirmed
- **Price:** $25

## Warnings Explained

The warnings you see are **expected in development mode**:

### ✅ Expected Warnings (Safe to Ignore)
- `[Supabase] Running in development mode without backend`
- `[AuthProvider] Running in development mode - skipping network calls`
- `expo-notifications functionality is not fully supported in Expo Go`
- `Skipping push token fetch in this environment`

### ❌ Warnings That Need Attention
- Any actual JavaScript errors
- Build failures
- Navigation errors

## Setting Up Real Backend (Optional)

If you want to set up the real Supabase backend later:

1. **Install Docker Desktop** (required for local Supabase)

2. **Install Supabase CLI:**
   ```bash
   # Using npm (not supported globally, so use npx)
   npx supabase --version
   
   # Or download directly:
   # https://github.com/supabase/cli/releases
   ```

3. **Start Supabase locally:**
   ```bash
   npx supabase start
   ```

4. **Update environment variables:**
   ```bash
   # Replace demo values with real Supabase URLs
   EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-real-anon-key
   ```

## Development Tips

### Testing Authentication
- Use `demo@barbershop.local` / `demo123` for quick testing
- Sign up flow also works with any email/password in demo mode

### Adding Mock Data
- Edit `src/services/mockData.ts` to add more test data
- Mock API responses include realistic delays to simulate network calls

### Disabling Mock Mode
Set these in your `.env` file:
```bash
EXPO_PUBLIC_DEV_MODE=false
EXPO_PUBLIC_MOCK_DATA=false
```

## Next Steps

Your app should now run without network errors! You can:

1. **Test the UI and navigation**
2. **Develop new features** using mock data
3. **Set up the real backend** when ready
4. **Build and test** on devices without backend dependencies

## Support

If you still see errors after this setup:
1. Clear Metro cache: `npx expo start -c`
2. Restart the development server
3. Check that `.env` file is in the correct location: `apps/mobile/.env`

## Project Structure

```
barbershop-app/
├── apps/mobile/
│   ├── .env                    # Environment variables
│   ├── app.json               # Expo configuration
│   └── src/
│       ├── api/client.ts      # Supabase client
│       ├── providers/         # Auth provider with mock support
│       └── services/
│           └── mockData.ts    # Mock data service
└── DEVELOPMENT.md            # This file
```
