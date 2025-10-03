import { NextRequest, NextResponse } from 'next/server'
import { twilioWhatsAppService } from '@/lib/twilio-whatsapp'
import { generateTeamSignupPDF, TeamSignupPDFData } from '@/lib/team-signup-pdf-generator'
import { fileUploadService } from '@/lib/simple-file-upload-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      phone, 
      padvidhar, 
      address, 
      district, 
      pin 
    } = body

    // Validate required fields
    if (!name || !phone || !padvidhar || !address || !district || !pin) {
      return NextResponse.json({ 
        error: 'All fields are required: name, phone, padvidhar, address, district, pin' 
      }, { status: 400 })
    }

    // Validate phone format
    if (!/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json({ 
        error: 'Please enter a valid 10-digit phone number' 
      }, { status: 400 })
    }

    // Validate PIN format
    if (!/^[0-9]{6}$/.test(pin)) {
      return NextResponse.json({ 
        error: 'Please enter a valid 6-digit PIN code' 
      }, { status: 400 })
    }

    console.log('📄 Generating Marathi PDF for:', name, phone)

    // Generate the actual Marathi PDF (with fixed font rendering)
    let pdfPath: string | null = null
    let pdfUrl: string | null = null
    
    try {
      const teamSignupData: TeamSignupPDFData = {
        name: name,
        phone: phone,
        address: address,
        district: district,
        padvidhar: padvidhar,
        pin: pin,
        submittedAt: new Date()
      }

      pdfPath = await generateTeamSignupPDF(teamSignupData)
      console.log('✅ Marathi PDF generated successfully:', pdfPath)

      // Create a simple public URL for the PDF
      const fileName = pdfPath.split('/').pop() || 'pdf'
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      pdfUrl = `${baseUrl}/api/files/${fileName}`
      console.log('✅ Marathi PDF URL created:', pdfUrl)
    } catch (pdfError) {
      console.error('❌ Marathi PDF generation failed:', pdfError)
      return NextResponse.json({ 
        error: 'PDF generation failed',
        details: pdfError instanceof Error ? pdfError.message : 'Unknown error',
        stack: pdfError instanceof Error ? pdfError.stack : undefined
      }, { status: 500 })
    }

    // Send WhatsApp message with the actual Marathi PDF
    try {
      const caption = `प्रिय श्री ${name}

भारतीय जनता पार्टी संघटन पर्व अंतर्गत राज्यभरात सुरू असणाऱ्या प्राथमिक सदस्यता नोंदणी अभियानामध्ये आपण १००० वैयक्तिक सदस्य नोंदणीची उद्दिष्ट पूर्ण केले, त्याबद्दल आपले मनःपूर्वक अभिनंदन!

आपल्या या योगदानाबद्दल आपले पुन्हा एकदा सहर्ष अभिनंदन!

आपलाच,
रविंद्र चव्हाण
भाजपा महाराष्ट्र प्रदेश कार्यकरी अध्यक्ष आमदार, १४३ डोंबिवली विधानसभा`

      const result = await twilioWhatsAppService.sendPDFFile(phone, pdfUrl, caption)
      console.log('📱 Marathi PDF sent via WhatsApp to:', phone)

      return NextResponse.json({
        success: true,
        message: 'Marathi PDF sent successfully!',
        pdfGenerated: !!pdfPath,
        pdfSent: result.success,
        messageId: result.messageId,
        pdfUrl: pdfUrl
      })

    } catch (whatsappError) {
      console.error('❌ Failed to send WhatsApp message:', whatsappError)
      return NextResponse.json({ 
        error: 'WhatsApp sending failed' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Marathi PDF send error:', error)
    return NextResponse.json({ 
      error: 'Failed to send Marathi PDF. Please try again.' 
    }, { status: 500 })
  }
}
