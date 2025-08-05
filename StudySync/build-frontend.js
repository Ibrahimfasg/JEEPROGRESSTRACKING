#!/usr/bin/env node

// Simple frontend-only build script for Netlify
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  console.log('Building frontend for static deployment...');
  
  // Set environment for frontend-only build
  process.env.NODE_ENV = 'production';
  process.env.VITE_BUILD_TARGET = 'static';
  
  // Run vite build
  execSync('npx vite build', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('Frontend build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}