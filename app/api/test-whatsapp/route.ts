import { NextRequest, NextResponse } from 'next/server'
import { whatsappDebugger } from '@/lib/whatsapp-debug'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, testType = 'message' } = await request.json()
    
    if (!phoneNumber) {
      return NextResponse.json({ 
        error: 'Phone number is required' 
      }, { status: 400 })
    }

    console.log('🧪 WhatsApp test request:', { phoneNumber, testType })

    let result
    if (testType === 'pdf') {
      // Test with a sample PDF URL
      const samplePdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      result = await whatsappDebugger.testPDFSending(phoneNumber, samplePdfUrl)
    } else {
      result = await whatsappDebugger.testWhatsAppMessage(phoneNumber)
    }

    // Check Twilio configuration
    const config = whatsappDebugger.checkTwilioConfig()
    
    return NextResponse.json({
      success: result.success,
      result,
      config,
      instructions: whatsappDebugger.getSandboxInstructions(),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ WhatsApp test API error:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const config = whatsappDebugger.checkTwilioConfig()
    
    return NextResponse.json({
      config,
      instructions: whatsappDebugger.getSandboxInstructions(),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ WhatsApp config check error:', error)
    return NextResponse.json({ 
      error: 'Config check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
