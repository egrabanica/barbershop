#!/usr/bin/env node

/**
 * Health check script for local development
 * Verifies that all services are running and accessible
 */

const http = require('http');
const https = require('https');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Services to check
const services = [
  {
    name: 'Supabase API',
    url: 'http://localhost:54321/rest/v1/health',
    required: true
  },
  {
    name: 'Supabase Studio',
    url: 'http://localhost:54323',
    required: true
  },
  {
    name: 'PostgreSQL (via Supabase)',
    url: 'http://localhost:54321/rest/v1/',
    required: true,
    headers: {
      'apikey': process.env.SUPABASE_ANON_KEY || 'test'
    }
  },
  {
    name: 'PostHog (optional)',
    url: 'http://localhost:8000/api/health',
    required: false
  },
  {
    name: 'Novu (optional)',
    url: 'http://localhost:3000/health-check',
    required: false
  }
];

function makeRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const options = {
      timeout: 5000,
      headers: {
        'User-Agent': 'Barbershop-Health-Check/1.0',
        ...headers
      }
    };

    const req = protocol.get(url, options, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

async function checkService(service) {
  try {
    const response = await makeRequest(service.url, service.headers);
    
    if (response.statusCode >= 200 && response.statusCode < 400) {
      return { success: true, status: response.statusCode };
    } else {
      return { success: false, status: response.statusCode, error: `HTTP ${response.statusCode}` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runHealthCheck() {
  console.log(`${colors.bold}🏥 Barbershop App Health Check${colors.reset}\n`);
  
  const results = [];
  
  for (const service of services) {
    process.stdout.write(`Checking ${service.name}... `);
    
    const result = await checkService(service);
    result.service = service;
    results.push(result);
    
    if (result.success) {
      console.log(`${colors.green}✓ OK${colors.reset} ${result.status ? `(${result.status})` : ''}`);
    } else {
      const status = service.required ? `${colors.red}✗ FAIL${colors.reset}` : `${colors.yellow}⚠ SKIP${colors.reset}`;
      console.log(`${status} ${result.error || 'Unknown error'}`);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  
  const requiredServices = results.filter(r => r.service.required);
  const requiredPassing = requiredServices.filter(r => r.success);
  const optionalServices = results.filter(r => !r.service.required);
  const optionalPassing = optionalServices.filter(r => r.success);
  
  console.log(`${colors.bold}Summary:${colors.reset}`);
  console.log(`Required services: ${requiredPassing.length}/${requiredServices.length} passing`);
  console.log(`Optional services: ${optionalPassing.length}/${optionalServices.length} passing`);
  
  if (requiredPassing.length === requiredServices.length) {
    console.log(`\n${colors.green}${colors.bold}✓ All required services are healthy!${colors.reset}`);
    console.log(`${colors.blue}You can start developing with: npm run mobile:start${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}${colors.bold}✗ Some required services are not healthy${colors.reset}`);
    console.log(`${colors.yellow}Please check the failed services and try again.${colors.reset}`);
    
    const failedRequired = requiredServices.filter(r => !r.success);
    console.log('\nFailed required services:');
    failedRequired.forEach(r => {
      console.log(`  - ${r.service.name}: ${r.error}`);
    });
    
    console.log(`\n${colors.blue}To fix common issues:${colors.reset}`);
    console.log('  1. Start Supabase: supabase start');
    console.log('  2. Check services: supabase status');
    console.log('  3. Restart services: supabase stop && supabase start');
    
    process.exit(1);
  }
}

// Environment check
function checkEnvironment() {
  console.log(`${colors.bold}Environment Check:${colors.reset}`);
  
  const requiredEnvVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    console.log(`${colors.red}Missing environment variables:${colors.reset}`);
    missingEnvVars.forEach(envVar => {
      console.log(`  - ${envVar}`);
    });
    console.log(`\nPlease check your .env.local file.\n`);
  } else {
    console.log(`${colors.green}✓ Environment variables look good${colors.reset}\n`);
  }
}

// Run the health check
if (require.main === module) {
  checkEnvironment();
  runHealthCheck().catch(error => {
    console.error(`${colors.red}Health check failed:${colors.reset}`, error);
    process.exit(1);
  });
}

module.exports = { runHealthCheck, checkService };
