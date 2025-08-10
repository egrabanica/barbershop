# Barbershop App - Local Development Setup Script
# Run this script as Administrator after installing PostgreSQL

Write-Host "Setting up Barbershop App for local development..." -ForegroundColor Green

# Check if PostgreSQL is installed
$pgVersion = & pg_config --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ PostgreSQL found: $pgVersion" -ForegroundColor Green
} else {
    Write-Host "✗ PostgreSQL not found. Please install it first." -ForegroundColor Red
    Write-Host "Run: choco install postgresql15 -y" -ForegroundColor Yellow
    exit 1
}

# Create database and user
Write-Host "Setting up database..." -ForegroundColor Blue
try {
    # Create database
    $env:PGPASSWORD = "postgres"
    & psql -U postgres -c "CREATE DATABASE barbershop;" 2>$null
    & psql -U postgres -d barbershop -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
    
    Write-Host "✓ Database 'barbershop' created" -ForegroundColor Green
} catch {
    Write-Host "Database might already exist or PostgreSQL service not running" -ForegroundColor Yellow
}

# Install Supabase CLI
Write-Host "Installing Supabase CLI..." -ForegroundColor Blue
npm install -g supabase@latest

# Install global dependencies
Write-Host "Installing global dependencies..." -ForegroundColor Blue
npm install -g @expo/cli concurrently

# Install project dependencies
Write-Host "Installing project dependencies..." -ForegroundColor Blue
Set-Location "apps/mobile"
npm install

Write-Host "✓ Local development setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start PostgreSQL service if not running"
Write-Host "2. Run 'npm run dev:local' to start the development environment"
Write-Host "3. Run 'expo start' in apps/mobile/ to start the mobile app"
