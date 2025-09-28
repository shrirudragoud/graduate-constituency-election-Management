// Test Twilio WhatsApp integration
require('dotenv').config({ path: '.env.local' });

const twilio = require('twilio');

console.log('🔍 Testing Twilio WhatsApp Integration...');
console.log('=====================================');

// Check environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

console.log('Environment Variables:');
console.log('TWILIO_ACCOUNT_SID:', accountSid ? '✅ Set' : '❌ Missing');
console.log('TWILIO_AUTH_TOKEN:', authToken ? '✅ Set' : '❌ Missing');
console.log('TWILIO_WHATSAPP_NUMBER:', whatsappNumber ? '✅ Set' : '❌ Missing');
console.log('');

if (!accountSid || !authToken || !whatsappNumber) {
  console.log('❌ Missing Twilio credentials. Please check your .env.local file.');
  process.exit(1);
}

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Test message
const testMessage = `🧪 Test Message from Twilio WhatsApp Integration

This is a test message to verify that your Twilio WhatsApp setup is working correctly.

If you receive this message, your integration is working! 🎉

Time: ${new Date().toLocaleString()}`;

// Test phone number (replace with your actual number)
const testPhoneNumber = 'whatsapp:+918700546080'; // Replace with your WhatsApp number

console.log('📱 Test Configuration:');
console.log('From:', whatsappNumber);
console.log('To:', testPhoneNumber);
console.log('Message:', testMessage);
console.log('');

async function sendTestMessage() {
  try {
    console.log('📱 Sending test WhatsApp message...');
    
    const result = await client.messages.create({
      body: testMessage,
      from: whatsappNumber,
      to: testPhoneNumber
    });
    
    console.log('✅ Test message sent successfully!');
    console.log('Message SID:', result.sid);
    console.log('Status:', result.status);
    console.log('');
    console.log('📱 Check your WhatsApp for the test message!');
    
  } catch (error) {
    console.error('❌ Failed to send test message:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('More Info:', error.moreInfo);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure you sent "join <sandbox-code>" to the sandbox number');
    console.log('2. Check that your phone number is correct');
    console.log('3. Verify your Twilio credentials are correct');
  }
}

sendTestMessage();
