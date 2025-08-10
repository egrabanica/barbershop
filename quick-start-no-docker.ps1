# Barbershop App - Docker-Free Quick Start Script
# This script helps you set up the app without Docker

Write-Host "🏪 Barbershop App - Docker-Free Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check prerequisites
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check if Expo CLI exists
if (Get-Command expo -ErrorAction SilentlyContinue) {
    Write-Host "✅ Expo CLI installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Expo CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @expo/cli
}

# Check PostgreSQL (optional)
if (Get-Command psql -ErrorAction SilentlyContinue) {
    Write-Host "✅ PostgreSQL found" -ForegroundColor Green
    $hasPostgres = $true
} else {
    Write-Host "⚠️  PostgreSQL not found (optional for local setup)" -ForegroundColor Yellow
    $hasPostgres = $false
}

Write-Host "`n🔧 Setup Options:" -ForegroundColor Yellow
Write-Host "1. Supabase Cloud (Recommended) - Free tier"
Write-Host "2. Local PostgreSQL - Self-hosted"

$choice = Read-Host "`nChoose setup option (1 or 2)"

if ($choice -eq "1") {
    Write-Host "`n☁️  Setting up with Supabase Cloud..." -ForegroundColor Cyan
    
    # Install Supabase CLI
    if (!(Get-Command supabase -ErrorAction SilentlyContinue)) {
        Write-Host "Installing Supabase CLI..." -ForegroundColor Yellow
        npm install -g supabase
    }
    
    Write-Host "`nNext steps:" -ForegroundColor Green
    Write-Host "1. Go to https://supabase.com and create a free account"
    Write-Host "2. Create a new project"
    Write-Host "3. Copy your Project URL and anon key"
    Write-Host "4. Update .env.local with your credentials"
    Write-Host "5. Run: supabase login && supabase link --project-ref YOUR_PROJECT_REF"
    Write-Host "6. Run: supabase db push"
    
} elseif ($choice -eq "2") {
    Write-Host "`n🏠 Setting up with Local PostgreSQL..." -ForegroundColor Cyan
    
    if (!$hasPostgres) {
        Write-Host "❌ PostgreSQL is required for local setup" -ForegroundColor Red
        Write-Host "Please install PostgreSQL from https://postgresql.org" -ForegroundColor Yellow
        exit 1
    }
    
    # Check if database exists
    $dbExists = psql -U postgres -lqt | Select-String "barbershop"
    
    if (!$dbExists) {
        Write-Host "Creating database..." -ForegroundColor Yellow
        $env:PGPASSWORD = Read-Host "Enter PostgreSQL password for user 'postgres'" -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD)
        $env:PGPASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        
        createdb -U postgres barbershop
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database created successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to create database" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ Database 'barbershop' already exists" -ForegroundColor Green
    }
    
    Write-Host "`nRunning migrations..." -ForegroundColor Yellow
    psql -U postgres -d barbershop -f supabase/migrations/001_initial_schema.sql
    psql -U postgres -d barbershop -f supabase/migrations/002_rls_policies.sql
    psql -U postgres -d barbershop -f supabase/migrations/003_local_auth.sql
    psql -U postgres -d barbershop -f supabase/seed.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database setup complete" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to run migrations" -ForegroundColor Red
        exit 1
    }
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow

Write-Host "Installing root dependencies..." -ForegroundColor Gray
npm install

Write-Host "Installing mobile app dependencies..." -ForegroundColor Gray
Set-Location "apps/mobile"
npm install
Set-Location "../.."

if ($choice -eq "2") {
    Write-Host "Installing server dependencies..." -ForegroundColor Gray
    Set-Location "server"
    npm install
    Set-Location ".."
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green

Write-Host "`n🚀 To start development:" -ForegroundColor Yellow
if ($choice -eq "1") {
    Write-Host "cd apps/mobile; expo start" -ForegroundColor White
} else {
    Write-Host "Terminal 1: cd server; npm run dev" -ForegroundColor White
    Write-Host "Terminal 2: cd apps/mobile; expo start" -ForegroundColor White
}

Write-Host "`n📖 For detailed instructions, see DOCKER_FREE_SETUP.md" -ForegroundColor Cyan
