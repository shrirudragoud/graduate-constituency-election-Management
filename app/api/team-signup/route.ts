import { NextRequest, NextResponse } from 'next/server'
import { UserManagement } from '@/lib/user-management'
import { testConnection } from '@/lib/database'
import { twilioWhatsAppService } from '@/lib/twilio-whatsapp'
import { generateTeamSignupPDF, TeamSignupPDFData } from '@/lib/team-signup-pdf-generator'
import { fileUploadService } from '@/lib/simple-file-upload-service'

export async function POST(request: NextRequest) {
  try {
    // Test database connection
    const dbConnected = await testConnection()
    if (!dbConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const body = await request.json()
    const { 
      name, 
      phone, 
      password, 
      padvidhar, 
      address, 
      district, 
      pin 
    } = body

    // Validate required fields
    if (!name || !phone || !password || !padvidhar || !address || !district || !pin) {
      return NextResponse.json({ 
        error: 'All fields are required' 
      }, { status: 400 })
    }

    // Validate phone format
    if (!/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json({ 
        error: 'Please enter a valid 10-digit phone number' 
      }, { status: 400 })
    }

    // Validate password strength (minimum 4 characters)
    if (password.length < 4) {
      return NextResponse.json({ 
        error: 'Password must be at least 4 characters long' 
      }, { status: 400 })
    }

    // Validate PIN format
    if (!/^[0-9]{6}$/.test(pin)) {
      return NextResponse.json({ 
        error: 'Please enter a valid 6-digit PIN code' 
      }, { status: 400 })
    }

    console.log('📝 Processing team signup:', {
      name,
      phone,
      district,
      pin
    })

    // Create user account with default role as volunteer
    const result = await UserManagement.createUser({
      email: `${phone}@bjp.local`, // Use phone as email for simplicity
      password,
      role: 'volunteer',
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || '',
      phone,
      district,
      taluka: padvidhar // Using padvidhar as taluka for now
    })

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to create account' 
      }, { status: 400 })
    }

    console.log('✅ Team member created successfully:', result.user?.phone)

    // Generate Team Signup Thank You PDF
    let pdfPath: string | null = null
    let pdfUrl: string | null = null
    
    try {
      console.log('📄 Generating Team Signup Thank You PDF for team member:', name)
      
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
      console.log('✅ Team Signup Thank You PDF generated successfully:', pdfPath)

      // Get public URL for the PDF
      const uploadResult = await fileUploadService.getBestPublicUrl(pdfPath, request)
      if (uploadResult.success && uploadResult.url) {
        pdfUrl = uploadResult.url
        console.log('✅ Thank You PDF uploaded successfully:', pdfUrl)
      } else {
        console.error('❌ Failed to upload Thank You PDF:', uploadResult.error)
      }
    } catch (pdfError) {
      console.error('❌ Thank You PDF generation failed:', pdfError)
      // Continue with regular notification without PDF
    }

    // Send WhatsApp message with or without PDF
    try {
      if (pdfUrl) {
        // Send with PDF attachment
        const caption = `प्रिय श्री ${name}

भारतीय जनता पार्टी संघटन पर्व अंतर्गत राज्यभरात सुरू असणाऱ्या प्राथमिक सदस्यता नोंदणी अभियानामध्ये आपण १००० वैयक्तिक सदस्य नोंदणीची उद्दिष्ट पूर्ण केले, त्याबद्दल आपले मनःपूर्वक अभिनंदन!

आपल्या या योगदानाबद्दल आपले पुन्हा एकदा सहर्ष अभिनंदन!

आपलाच,
रविंद्र चव्हाण
भाजपा महाराष्ट्र प्रदेश कार्यकरी अध्यक्ष आमदार, १४३ डोंबिवली विधानसभा`

        await twilioWhatsAppService.sendPDFFile(phone, pdfUrl, caption)
        console.log('📱 Thank You PDF sent via WhatsApp to:', phone)
      } else {
        // Send regular Marathi WhatsApp message
        const marathiMessage = `नमस्कार 
आपण मराठवाडा पदवीधर निवडणुकीमध्ये कार्यकर्ता म्हणून नोंद केल्याबद्दल आपले हार्दिक अभिनंदन.
ही पदवीधर निवडणूक ही युवकांचे भवितव्य घडवणारी निवडणूक असणार आहे. युवकाच्या पदवीस सन्मान मिळवून देण्यासाठी ही निवडणूक महत्वपूर्ण ठरणार आहे. पदवीधरांच्या प्रश्नांची जाणीव असणारा योग्य उमेदवार निवडून देणे ही काळाची गरज आहे. या निवडणुकीमध्ये आपण सर्व शक्तीनिशी पदवीधरांची नोंदणी करण्यासाठी मी मनःपूर्वक शुभेच्छा व्यक्त करतो.

आपला 

रवींद्र चव्हाण
प्रदेशाध्यक्ष, भारतीय जनता पार्टी.`

        await twilioWhatsAppService.sendMessage(phone, marathiMessage)
        console.log('📱 Marathi WhatsApp message sent to:', phone)
      }
    } catch (whatsappError) {
      console.error('❌ Failed to send WhatsApp message:', whatsappError)
      // Don't fail the signup if WhatsApp fails
    }

    // Generate JWT token for immediate login
    const { generateToken } = await import('@/lib/auth')
    const token = generateToken(result.user!)

    return NextResponse.json({
      success: true,
      user: result.user,
      token,
      message: pdfUrl ? 'Account created successfully! Thank you PDF sent to your phone.' : 'Account created successfully! Welcome message sent to your phone.',
      pdfGenerated: !!pdfPath,
      pdfSent: !!pdfUrl
    })

  } catch (error) {
    console.error('Team signup error:', error)
    return NextResponse.json({ 
      error: 'Failed to create account. Please try again.' 
    }, { status: 500 })
  }
}
