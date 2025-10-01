#!/usr/bin/env node

/**
 * Simple test script to verify the fixes work
 * Run with: node test-fixes.js
 */

const { fileUploadService } = require('./lib/file-upload-service.ts');

async function testFixes() {
  console.log('🧪 Testing fixes...\n');

  // Test 1: Check if public API route exists
  console.log('1. Testing public API route...');
  try {
    const response = await fetch('http://localhost:3000/api/public/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' })
    });
    
    if (response.status === 400) {
      console.log('✅ Public API route exists (400 is expected for missing data)');
    } else {
      console.log(`⚠️ Public API route returned: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Public API route test failed:', error.message);
  }

  // Test 2: Check if file upload service works
  console.log('\n2. Testing file upload service...');
  try {
    // Create a test file
    const fs = require('fs');
    const testFile = '/tmp/test-file.txt';
    fs.writeFileSync(testFile, 'Test content');
    
    const result = await fileUploadService.getBestPublicUrl(testFile);
    
    if (result.success) {
      console.log('✅ File upload service working:', result.service);
    } else {
      console.log('⚠️ File upload service fallback working:', result.error);
    }
    
    // Cleanup
    fs.unlinkSync(testFile);
  } catch (error) {
    console.log('❌ File upload service test failed:', error.message);
  }

  // Test 3: Check authentication endpoint
  console.log('\n3. Testing authentication endpoint...');
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        loginField: 'admin@election.com',
        password: 'admin123',
        loginType: 'email'
      })
    });
    
    const data = await response.json();
    
    if (response.status === 200 && data.success) {
      console.log('✅ Authentication working');
    } else {
      console.log('⚠️ Authentication issue:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Authentication test failed:', error.message);
  }

  console.log('\n🎉 Fix tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  testFixes().catch(console.error);
}

module.exports = { testFixes };
