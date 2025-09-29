// Direct Twilio API test
const https = require('https');

// Your Twilio credentials
const accountSid = 'AC6425d40fad5531921a08f161fe7e87c3';
const authToken = process.env.TWILIO_AUTH_TOKEN; // Get from environment
const fromNumber = 'whatsapp:+14155238886';
const toNumber = 'whatsapp:+918700546080';

if (!authToken) {
  console.error('❌ TWILIO_AUTH_TOKEN not found in environment variables');
  console.log('Please set your Twilio auth token:');
  console.log('export TWILIO_AUTH_TOKEN="your_auth_token_here"');
  process.exit(1);
}

const message = `🧪 Direct Twilio API Test

This message is sent directly via Twilio API to test if WhatsApp is working.

Time: ${new Date().toLocaleString('en-GB')}
Test ID: ${Date.now()}

If you receive this, the direct API is working! 🎉`;

const postData = new URLSearchParams({
  'To': toNumber,
  'From': fromNumber,
  'Body': message
}).toString();

const options = {
  hostname: 'api.twilio.com',
  port: 443,
  path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing direct Twilio API...');
console.log('📱 From:', fromNumber);
console.log('📱 To:', toNumber);
console.log('📱 Message:', message);
console.log('');

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📱 Response Status:', res.statusCode);
    console.log('📱 Response Headers:', res.headers);
    console.log('📱 Response Body:', data);
    
    if (res.statusCode === 201) {
      const response = JSON.parse(data);
      console.log('');
      console.log('✅ Message sent successfully!');
      console.log('📱 Message SID:', response.sid);
      console.log('📱 Status:', response.status);
      console.log('');
      console.log('📱 Check your WhatsApp now!');
    } else {
      console.log('');
      console.log('❌ Message failed to send');
      console.log('📱 Status Code:', res.statusCode);
      console.log('📱 Error:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error);
});

req.write(postData);
req.end();
