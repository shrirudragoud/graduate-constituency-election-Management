#!/usr/bin/env node

/**
 * Test script to verify PDF generation and WhatsApp fixes
 * Run with: node test-pdf-fix.js
 */

const { generateSimplePDF } = require('./lib/simple-pdf-generator.ts');

async function testPDFFix() {
  console.log('🧪 Testing PDF generation fixes...\n');

  // Test 1: Test simple PDF generation
  console.log('1. Testing Simple PDF generation...');
  try {
    const testData = {
      name: 'Test User',
      phone: '9876543210',
      address: 'Test Address, Test City',
      district: 'Test District',
      padvidhar: 'Graduate',
      pin: '123456',
      signupDate: new Date().toISOString()
    };
    
    const pdfPath = await generateSimplePDF(testData);
    console.log('✅ Simple PDF generated successfully:', pdfPath);
  } catch (error) {
    console.log('❌ Simple PDF generation failed:', error.message);
  }

  // Test 2: Test team signup API
  console.log('\n2. Testing team signup API...');
  try {
    const response = await fetch('http://localhost:3000/api/team-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        phone: '9876543210',
        address: 'Test Address',
        district: 'Test District',
        padvidhar: 'Graduate',
        pin: '123456'
      })
    });
    
    const data = await response.json();
    
    if (response.status === 200 && data.success) {
      console.log('✅ Team signup API working');
      console.log('📱 WhatsApp message should be sent to:', data.user?.phone);
    } else {
      console.log('⚠️ Team signup API issue:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Team signup API test failed:', error.message);
  }

  console.log('\n🎉 PDF fix tests completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Run: ./fix-puppeteer.sh (to install Chrome dependencies)');
  console.log('2. Restart: npm run dev');
  console.log('3. Test team signup form');
}

// Run tests if this file is executed directly
if (require.main === module) {
  testPDFFix().catch(console.error);
}

module.exports = { testPDFFix };
