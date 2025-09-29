// Test script to verify if WhatsApp messages are actually being sent
const { twilioWhatsAppService } = require('./lib/twilio-whatsapp.ts')

async function testRealWhatsApp() {
  console.log('🧪 Testing REAL WhatsApp message sending...')
  console.log('📱 This will send an ACTUAL message to your phone')
  console.log('')
  
  const phoneNumber = '8700546080' // Your phone number
  const testMessage = `🧪 REAL WhatsApp Test Message

This is a REAL message sent via Twilio WhatsApp API.

Time: ${new Date().toLocaleString('en-GB')}
Test ID: ${Date.now()}

If you receive this message, the WhatsApp integration is working correctly!

This is NOT a mock message - it's real! 🎉`

  try {
    console.log('📱 Sending REAL message to:', phoneNumber)
    console.log('📱 Message:', testMessage)
    console.log('')
    
    const result = await twilioWhatsAppService.sendMessage(phoneNumber, testMessage)
    
    console.log('📱 Result:', result)
    console.log('')
    
    if (result.success) {
      console.log('✅ Message sent successfully!')
      console.log('📱 Message ID:', result.messageId)
      console.log('')
      console.log('📱 Check your WhatsApp now!')
      console.log('📱 If you don\'t see the message, check:')
      console.log('   1. You need to send a message to +1 415 523 8886 first')
      console.log('   2. Use the join code from your Twilio console')
      console.log('   3. Wait a few minutes for delivery')
    } else {
      console.log('❌ Message failed:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testRealWhatsApp().catch(console.error)
