import twilio from 'twilio';

// Twilio configuration - load at runtime
let accountSid: string | undefined;
let authToken: string | undefined;
let whatsappNumber: string | undefined;
let client: any;

// Initialize Twilio client
function initializeTwilio() {
  accountSid = process.env.TWILIO_ACCOUNT_SID;
  authToken = process.env.TWILIO_AUTH_TOKEN;
  whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886
  
  console.log('🔍 Environment variables check:');
  console.log('TWILIO_ACCOUNT_SID:', accountSid ? '✅ Set' : '❌ Missing');
  console.log('TWILIO_AUTH_TOKEN:', authToken ? '✅ Set' : '❌ Missing');
  console.log('TWILIO_WHATSAPP_NUMBER:', whatsappNumber ? '✅ Set' : '❌ Missing');
  
  if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
    return true;
  }
  return false;
}

class TwilioWhatsAppService {
  private isInitialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const twilioReady = initializeTwilio();
      if (twilioReady) {
        console.log('📱 Twilio WhatsApp service initialized successfully');
        this.isInitialized = true;
      } else {
        console.log('⚠️ Twilio WhatsApp service not configured - missing environment variables');
        this.isInitialized = false;
      }
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

      // Reinitialize Twilio to ensure environment variables are loaded
      if (!this.isReady()) {
        console.log('🔄 Reinitializing Twilio service...');
        this.initialize();
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

      // Ensure client is initialized
      if (!client) {
        console.log('⚠️ Twilio client not initialized, reinitializing...');
        initializeTwilio();
        if (!client) {
          throw new Error('Failed to initialize Twilio client');
        }
      }

      // Send WhatsApp message
      console.log('📱 Sending REAL WhatsApp message via Twilio...');
      console.log('📱 From:', whatsappNumber);
      console.log('📱 To:', phoneNumber);
      
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

  async sendPDFFile(phoneNumber: string, pdfUrl: string, caption?: string) {
    try {
      console.log('📱 Starting WhatsApp PDF file send for:', phoneNumber);
      console.log('📱 PDF URL:', pdfUrl);
      
      // Validate mobile number
      if (!phoneNumber || phoneNumber.trim() === '') {
        console.log('⚠️ No mobile number provided, skipping WhatsApp PDF');
        return { success: false, message: 'No mobile number provided' };
      }

      // Reinitialize Twilio to ensure environment variables are loaded
      if (!this.isReady()) {
        console.log('🔄 Reinitializing Twilio service...');
        this.initialize();
      }

      // Check if service is ready
      if (!this.isReady()) {
        console.log('⚠️ Twilio not configured - using mock mode');
        console.log('📱 MOCK WhatsApp PDF would be sent to:', phoneNumber);
        console.log('📱 PDF URL:', pdfUrl);
        return { 
          success: true, 
          message: 'PDF ready! (WhatsApp not configured - check console for details)' 
        };
      }

      // Format phone number for WhatsApp
      let formattedNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digits
      if (formattedNumber.startsWith('0')) {
        formattedNumber = '91' + formattedNumber; // Add India country code if starts with 0
      } else if (!formattedNumber.startsWith('91')) {
        formattedNumber = '91' + formattedNumber; // Add India country code
      }
      formattedNumber = `whatsapp:+${formattedNumber}`;

      // Create message with PDF attachment
      const message = caption || `📄 Your ECI Form PDF is ready!

Form ID: ${pdfUrl.split('-').pop()?.split('.')[0] || 'Unknown'}
Generated on: ${new Date().toLocaleString('en-GB')}

This is your official ECI Form-18 for voter registration. 
Please keep this document safe.

Thank you for your registration!`;

      // Ensure client is initialized
      if (!client) {
        console.log('⚠️ Twilio client not initialized, reinitializing...');
        initializeTwilio();
        if (!client) {
          throw new Error('Failed to initialize Twilio client');
        }
      }

      // Check if it's a localhost URL (Twilio can't access these)
      if (pdfUrl.includes('localhost') || pdfUrl.includes('127.0.0.1')) {
        console.log('📱 Localhost URL detected - sending download instructions instead of attachment...');
        const downloadMessage = `📄 Your Thank You PDF has been generated!

Form ID: ${pdfUrl.split('-').pop()?.split('.')[0] || 'Unknown'}
Generated on: ${new Date().toLocaleString('en-GB')}

✅ Your registration is complete and successful!
📋 Please keep this confirmation for your records.

Thank you for joining our team!`;

        const result = await client.messages.create({
          body: downloadMessage,
          from: whatsappNumber,
          to: formattedNumber
        });

        console.log('📱 WhatsApp localhost message sent:', result.sid);
        return {
          success: true,
          messageId: result.sid,
          message: 'Registration confirmation sent (PDF not accessible from localhost)'
        };
      }

      // Check if it's an HTML file (fallback case)
      if (pdfUrl.endsWith('.html')) {
        console.log('📱 Sending HTML file as download link...');
        const downloadMessage = `📄 Your ECI Form PDF has been generated!

Form ID: ${pdfUrl.split('-').pop()?.split('.')[0] || 'Unknown'}
Generated on: ${new Date().toLocaleString('en-GB')}

🔗 Download your PDF:
${pdfUrl}

✅ Click the link above to download your PDF form directly.

Thank you for your registration!`;

        const result = await client.messages.create({
          body: downloadMessage,
          from: whatsappNumber,
          to: formattedNumber
        });

        console.log('📱 WhatsApp download link sent:', result.sid);
        return {
          success: true,
          messageId: result.sid,
          message: 'Download link sent successfully!'
        };
      }

      // Validate PDF URL accessibility and content type before sending
      console.log('🔍 Validating PDF URL accessibility and content type...');
      try {
        const urlResponse = await fetch(pdfUrl, { method: 'HEAD', timeout: 10000 });
        if (!urlResponse.ok) {
          console.log('⚠️ PDF URL not accessible, sending as download link instead');
          const downloadMessage = `📄 Your ECI Form PDF has been generated!

Form ID: ${pdfUrl.split('-').pop()?.split('.')[0] || 'Unknown'}
Generated on: ${new Date().toLocaleString('en-GB')}

🔗 Download your PDF:
${pdfUrl}

✅ Click the link above to download your PDF form directly.

Thank you for your registration!`;

          const result = await client.messages.create({
            body: downloadMessage,
            from: whatsappNumber,
            to: formattedNumber
          });

          console.log('📱 WhatsApp download link sent:', result.sid);
          return {
            success: true,
            messageId: result.sid,
            message: 'Download link sent successfully!'
          };
        }
        
        // Check content type
        const contentType = urlResponse.headers.get('content-type');
        console.log('📄 PDF URL content type:', contentType);
        
        if (!contentType || !contentType.includes('application/pdf')) {
          console.log('⚠️ PDF URL does not serve PDF content, sending as download link instead');
          const downloadMessage = `📄 Your ECI Form PDF has been generated!

Form ID: ${pdfUrl.split('-').pop()?.split('.')[0] || 'Unknown'}
Generated on: ${new Date().toLocaleString('en-GB')}

🔗 Download your PDF:
${pdfUrl}

✅ Click the link above to download your PDF form directly.

Thank you for your registration!`;

          const result = await client.messages.create({
            body: downloadMessage,
            from: whatsappNumber,
            to: formattedNumber
          });

          console.log('📱 WhatsApp download link sent:', result.sid);
          return {
            success: true,
            messageId: result.sid,
            message: 'Download link sent successfully!'
          };
        }
        
        console.log('✅ PDF URL is accessible and serves PDF content, proceeding with attachment');
      } catch (urlError) {
        console.log('⚠️ PDF URL validation failed, sending as download link instead');
        const downloadMessage = `📄 Your ECI Form PDF has been generated!

Form ID: ${pdfUrl.split('-').pop()?.split('.')[0] || 'Unknown'}
Generated on: ${new Date().toLocaleString('en-GB')}

🔗 Download your PDF:
${pdfUrl}

✅ Click the link above to download your PDF form directly.

Thank you for your registration!`;

        const result = await client.messages.create({
          body: downloadMessage,
          from: whatsappNumber,
          to: formattedNumber
        });

        console.log('📱 WhatsApp download link sent:', result.sid);
        return {
          success: true,
          messageId: result.sid,
          message: 'Download link sent successfully!'
        };
      }

      // Send PDF as media attachment
      console.log('📱 Sending REAL WhatsApp PDF file via Twilio...');
      console.log('📱 From:', whatsappNumber);
      console.log('📱 To:', formattedNumber);
      console.log('📱 PDF URL:', pdfUrl);
      
      const result = await client.messages.create({
        body: message,
        from: whatsappNumber,
        to: formattedNumber,
        mediaUrl: [pdfUrl] // Send PDF as attachment
      });

      console.log('📱 Twilio WhatsApp PDF file sent:', result.sid);
      
      return {
        success: true,
        messageId: result.sid,
        message: 'PDF file sent successfully!'
      };

    } catch (error) {
      console.error('❌ Twilio WhatsApp PDF file send failed:', error);
      return {
        success: false,
        message: 'PDF file send failed, but registration was successful',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const twilioWhatsAppService = new TwilioWhatsAppService();
