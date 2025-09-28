import twilio from 'twilio';

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886

// Initialize Twilio client
const client = twilio(accountSid, authToken);

class TwilioWhatsAppService {
  private isInitialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (!accountSid || !authToken || !whatsappNumber) {
      console.log('⚠️ Twilio WhatsApp service not configured - missing environment variables');
      this.isInitialized = false;
      return;
    }

    try {
      // Test the client
      console.log('📱 Twilio WhatsApp service initialized');
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize Twilio WhatsApp service:', error);
      this.isInitialized = false;
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  async sendFormSubmissionNotification(submission: any, submissionId: string) {
    try {
      console.log('📱 Starting WhatsApp notification for:', submission.mobileNumber);
      
      // Validate mobile number
      if (!submission.mobileNumber || submission.mobileNumber.trim() === '') {
        console.log('⚠️ No mobile number provided, skipping WhatsApp notification');
        return { success: false, message: 'No mobile number provided' };
      }

      // Check if service is ready
      if (!this.isReady()) {
        console.log('⚠️ Twilio not configured - using mock mode');
        console.log('📱 MOCK WhatsApp message would be sent to:', submission.mobileNumber);
        console.log('📱 To enable real WhatsApp messages, configure Twilio credentials in .env.local');
        return { 
          success: true, 
          message: 'Registration successful! (WhatsApp not configured - check console for details)' 
        };
      }

      // Format phone number for WhatsApp
      let phoneNumber = submission.mobileNumber.replace(/\D/g, ''); // Remove non-digits
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '91' + phoneNumber; // Add India country code if starts with 0
      } else if (!phoneNumber.startsWith('91')) {
        phoneNumber = '91' + phoneNumber; // Add India country code
      }
      phoneNumber = `whatsapp:+${phoneNumber}`;

      // Create message
      const message = `🎉 Registration Successful!

Dear ${submission.firstName} ${submission.surname},

Your voter registration has been submitted successfully!

📋 Registration Details:
• Registration ID: ${submissionId}
• Name: ${submission.firstName} ${submission.surname}
• Mobile: ${submission.mobileNumber}
• Email: ${submission.email}
• District: ${submission.district}
• Taluka: ${submission.taluka}

✅ Your application is being processed.
📞 Contact us if you have any questions.

Thank you for registering with BJP!`;

      // Send WhatsApp message
      const result = await client.messages.create({
        body: message,
        from: whatsappNumber,
        to: phoneNumber
      });

      console.log('📱 Twilio WhatsApp message sent:', result.sid);
      
      return {
        success: true,
        messageId: result.sid,
        message: 'WhatsApp notification sent successfully!'
      };

    } catch (error) {
      console.error('❌ Twilio WhatsApp notification failed:', error);
      return {
        success: false,
        message: 'WhatsApp notification failed, but registration was successful',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async sendMessage(phoneNumber: string, message: string) {
    try {
      if (!this.isReady()) {
        return { success: false, message: 'WhatsApp service not configured' };
      }

      // Format phone number
      let formattedNumber = phoneNumber.replace(/\D/g, '');
      if (formattedNumber.startsWith('0')) {
        formattedNumber = '91' + formattedNumber;
      } else if (!formattedNumber.startsWith('91')) {
        formattedNumber = '91' + formattedNumber;
      }
      formattedNumber = `whatsapp:+${formattedNumber}`;

      const result = await client.messages.create({
        body: message,
        from: whatsappNumber,
        to: formattedNumber
      });

      return {
        success: true,
        messageId: result.sid,
        message: 'Message sent successfully!'
      };

    } catch (error) {
      console.error('❌ Failed to send WhatsApp message:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const twilioWhatsAppService = new TwilioWhatsAppService();
