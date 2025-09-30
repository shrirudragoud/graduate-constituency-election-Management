// WhatsApp debugging and testing utilities
import { twilioWhatsAppService } from './twilio-whatsapp'

export interface WhatsAppTestResult {
  success: boolean
  messageId?: string
  error?: string
  details: {
    phoneNumber: string
    formattedNumber: string
    message: string
    twilioResponse?: any
  }
}

export class WhatsAppDebugger {
  /**
   * Test WhatsApp message sending with detailed logging
   */
  static async testWhatsAppMessage(phoneNumber: string, testMessage?: string): Promise<WhatsAppTestResult> {
    console.log('🧪 Testing WhatsApp message sending...')
    console.log('📱 Original phone number:', phoneNumber)
    
    // Format phone number
    let formattedNumber = phoneNumber.replace(/\D/g, '')
    console.log('📱 Cleaned number:', formattedNumber)
    
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '91' + formattedNumber
      console.log('📱 Added country code (from 0):', formattedNumber)
    } else if (!formattedNumber.startsWith('91')) {
      formattedNumber = '91' + formattedNumber
      console.log('📱 Added country code (default):', formattedNumber)
    }
    
    const whatsappNumber = `whatsapp:+${formattedNumber}`
    console.log('📱 Final WhatsApp number:', whatsappNumber)
    
    const message = testMessage || `🧪 Test Message from  Management System

Hello! This is a test message to verify WhatsApp integration.

Time: ${new Date().toLocaleString('en-GB')}
Phone: ${phoneNumber}
Formatted: ${whatsappNumber}

If you receive this message, the WhatsApp integration is working correctly!

Thank you for testing! 🎉`

    try {
      console.log('📱 Sending test message...')
      const result = await twilioWhatsAppService.sendMessage(whatsappNumber, message)
      
      console.log('📱 Test result:', result)
      
      return {
        success: result.success,
        messageId: result.messageId,
        error: result.error,
        details: {
          phoneNumber,
          formattedNumber: whatsappNumber,
          message,
          twilioResponse: result
        }
      }
    } catch (error) {
      console.error('❌ WhatsApp test failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          phoneNumber,
          formattedNumber: whatsappNumber,
          message
        }
      }
    }
  }

  /**
   * Test PDF file sending
   */
  static async testPDFSending(phoneNumber: string, pdfUrl: string): Promise<WhatsAppTestResult> {
    console.log('🧪 Testing WhatsApp PDF sending...')
    console.log('📱 Phone number:', phoneNumber)
    console.log('📄 PDF URL:', pdfUrl)
    
    try {
      const result = await twilioWhatsAppService.sendPDFFile(phoneNumber, pdfUrl, '')
      
      console.log('📱 PDF test result:', result)
      
      return {
        success: result.success,
        messageId: result.messageId,
        error: result.error,
        details: {
          phoneNumber,
          formattedNumber: phoneNumber,
          message: 'PDF attachment test',
          twilioResponse: result
        }
      }
    } catch (error) {
      console.error('❌ WhatsApp PDF test failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          phoneNumber,
          formattedNumber: phoneNumber,
          message: 'PDF attachment test'
        }
      }
    }
  }

  /**
   * Check Twilio configuration
   */
  static checkTwilioConfig(): {
    isConfigured: boolean
    accountSid: string | undefined
    authToken: string | undefined
    whatsappNumber: string | undefined
    issues: string[]
  } {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER
    
    const issues: string[] = []
    
    if (!accountSid) issues.push('TWILIO_ACCOUNT_SID not set')
    if (!authToken) issues.push('TWILIO_AUTH_TOKEN not set')
    if (!whatsappNumber) issues.push('TWILIO_WHATSAPP_NUMBER not set')
    
    if (whatsappNumber && !whatsappNumber.startsWith('whatsapp:+')) {
      issues.push('TWILIO_WHATSAPP_NUMBER should start with "whatsapp:+"')
    }
    
    return {
      isConfigured: issues.length === 0,
      accountSid,
      authToken: authToken ? '***' + authToken.slice(-4) : undefined,
      whatsappNumber,
      issues
    }
  }

  /**
   * Get WhatsApp sandbox instructions
   */
  static getSandboxInstructions(): string {
    return `
📱 WhatsApp Sandbox Setup Instructions:

1. You're using Twilio WhatsApp Sandbox
2. The recipient (${process.env.TWILIO_WHATSAPP_NUMBER}) needs to:
   - Send a message to your WhatsApp sandbox number first
   - Use the join code: [check your Twilio console]
   - Only then can you send messages to them

3. To test:
   - Send "join [sandbox-code]" to ${process.env.TWILIO_WHATSAPP_NUMBER}
   - Then try the registration form again

4. For production:
   - Apply for WhatsApp Business API approval
   - Use your own WhatsApp Business number
   - No join code required

Current sandbox number: ${process.env.TWILIO_WHATSAPP_NUMBER}
    `
  }
}

export const whatsappDebugger = WhatsAppDebugger
