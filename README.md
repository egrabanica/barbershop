# Barbershop App

A production-ready React Native (Expo) barbershop booking app with self-hosted infrastructure.

## Architecture

- **Mobile**: Expo (TypeScript) + React Navigation + TanStack Query + Zustand
- **Backend**: Self-hosted Supabase (Postgres + Auth + Storage + Edge Functions)  
- **Analytics**: PostHog Community Edition (self-hosted)
- **Notifications**: Novu (open-source) + FCM/APNs
- **Maps**: MapLibre + OpenStreetMap
- **Payments**: Optional Stripe integration (feature-flagged)

## Features

### Client Features
- 🏪 Discover barbershops
- 📅 Book/reschedule/cancel appointments  
- 💳 Loyalty points & wallet
- 🎁 Promo codes & referrals
- ⭐ Reviews & ratings
- 📱 Push notifications
- 🎯 Targeted marketing campaigns

### Owner Features (Role-gated)
- 📊 Dashboard with KPIs
- 👥 Staff management & scheduling
- ⚡ Services & pricing
- 📈 Campaign management
- ⭐ Review moderation
- 📞 Waitlist management

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Expo CLI (`npm i -g @expo/cli`)

### Development Setup
```bash
# Clone and install
git clone <repo-url>
cd barbershop-app
npm install

# Start infrastructure
docker compose up -d

# Start mobile app
cd apps/mobile
expo start
```

## Project Structure
```
barbershop-app/
├── apps/
│   └── mobile/           # Expo app
├── supabase/             # Database, Auth, Edge Functions
├── docker/               # Self-hosted services
├── .github/              # CI/CD workflows
└── docs/                 # Documentation
```

## Milestones

- [x] **M0**: Repo & Infra (Aug 10-11)
- [ ] **M1**: Auth, Navigation, Data Model (Aug 12-16)  
- [ ] **M2**: Booking Core (Aug 17-22)
- [ ] **M3**: Owner Mode (Aug 23-28)
- [ ] **M4**: Loyalty, Promos, Referrals (Aug 29-Sep 2)
- [ ] **M5**: Marketing & Notifications (Sep 3-6)
- [ ] **M6**: Analytics, QA, Optional Stripe (Sep 7-12)
- [ ] **RC**: Docs & Hardening (Sep 13-15)

## Self-Hosted Stack (Zero SaaS Lock-in)

All services run on your infrastructure with unlimited capacity:

- **Database**: PostgreSQL with Row Level Security
- **Auth**: Supabase Auth (email/phone OTP)
- **Storage**: Supabase Storage (S3-compatible)
- **Analytics**: PostHog CE (self-hosted)
- **Notifications**: Novu + FCM/APNs
- **Email/SMS**: Listmonk + Postfix (optional)

Optional paid services (feature-flagged):
- Stripe (payments) - `ENABLE_STRIPE=false`
- OneSignal (push) - `USE_ONESIGNAL=false`

## License

MIT
