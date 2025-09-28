// Check WhatsApp Sandbox Status
require('dotenv').config({ path: '.env.local' });

const twilio = require('twilio');

console.log('🔍 Checking WhatsApp Sandbox Status...');
console.log('=====================================');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

if (!accountSid || !authToken) {
  console.log('❌ Twilio credentials not found');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function checkSandboxStatus() {
  try {
    console.log('📱 Checking WhatsApp sandbox status...');
    
    // Get your WhatsApp sandbox info
    const incomingPhoneNumbers = await client.incomingPhoneNumbers.list({
      phoneNumber: whatsappNumber.replace('whatsapp:', '')
    });
    
    if (incomingPhoneNumbers.length > 0) {
      const number = incomingPhoneNumbers[0];
      console.log('✅ WhatsApp Sandbox Number:', number.phoneNumber);
      console.log('📱 Friendly Name:', number.friendlyName);
      console.log('📱 Capabilities:', JSON.stringify(number.capabilities, null, 2));
    } else {
      console.log('❌ WhatsApp sandbox number not found');
    }
    
    // Check recent messages
    console.log('\n📱 Recent Messages:');
    const messages = await client.messages.list({
      from: whatsappNumber,
      limit: 5
    });
    
    messages.forEach((msg, index) => {
      console.log(`${index + 1}. To: ${msg.to}`);
      console.log(`   Status: ${msg.status}`);
      console.log(`   SID: ${msg.sid}`);
      console.log(`   Date: ${msg.dateCreated}`);
      console.log(`   Error: ${msg.errorCode || 'None'}`);
      console.log('');
    });
    
    // Check if you need to join the sandbox
    console.log('🔧 WhatsApp Sandbox Setup:');
    console.log('1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn');
    console.log('2. Look for the sandbox number (usually +1 415 523 8886)');
    console.log('3. Send "join <sandbox-code>" to that number from your WhatsApp');
    console.log('4. You should receive a confirmation message');
    console.log('');
    console.log('📱 Your current sandbox number:', whatsappNumber);
    
  } catch (error) {
    console.error('❌ Error checking sandbox status:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your Twilio credentials are correct');
    console.log('2. Check if you have WhatsApp Business API access');
    console.log('3. Verify you sent the join message to the sandbox');
  }
}

checkSandboxStatus();
