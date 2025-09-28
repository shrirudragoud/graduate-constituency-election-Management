import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { twilioWhatsAppService } from '@/lib/twilio-whatsapp'
import { SubmissionsDAL } from '@/lib/submissions-dal'
import { testConnection } from '@/lib/database'

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data')
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')

console.log('📁 Data directory:', DATA_DIR)
console.log('📁 Uploads directory:', UPLOADS_DIR)

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true })
    await mkdir(UPLOADS_DIR, { recursive: true })
  } catch (error) {
    console.error('Error creating directories:', error)
  }
}

// WhatsApp notification function with retry logic
async function sendWhatsAppNotification(submission: any, submissionId: string) {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📱 WhatsApp notification attempt ${attempt}/${maxRetries} for:`, submission.mobileNumber)
      
      // Validate mobile number
      if (!submission.mobileNumber || submission.mobileNumber.trim() === '') {
        console.log('⚠️ No mobile number provided, skipping WhatsApp notification')
        return { success: false, message: 'No mobile number provided' }
      }

      // Check if Twilio service is ready
      if (!twilioWhatsAppService.isReady()) {
        console.log('⚠️ Twilio WhatsApp service not ready, skipping notification')
        return { success: false, message: 'WhatsApp service not configured' }
      }

      const result = await twilioWhatsAppService.sendFormSubmissionNotification(submission, submissionId)
      console.log('📱 WhatsApp notification result:', result)
      
      return { 
        success: true, 
        message: 'Thank you message sent successfully to your mobile number!',
        messageId: result.messageId
      }
    } catch (error) {
      lastError = error as Error
      console.error(`❌ WhatsApp notification attempt ${attempt} failed:`, error)
      
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000
        console.log(`⏳ Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  // All retries failed
  console.error('❌ All WhatsApp notification attempts failed')
  return { 
    success: false, 
    message: 'Thank you message could not be sent, but your registration is successful', 
    error: lastError?.message || 'Unknown error'
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📖 Fetching submissions...')
    
    // Test database connection first
    const dbConnected = await testConnection()
    if (!dbConnected) {
      console.error('❌ Database connection failed')
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100) // Max 100 per page
    const status = searchParams.get('status') || undefined
    const district = searchParams.get('district') || undefined
    const taluka = searchParams.get('taluka') || undefined

    const offset = (page - 1) * limit

    const result = await SubmissionsDAL.getAll({
      limit,
      offset,
      status,
      district,
      taluka
    })

    console.log(`📊 Found ${result.submissions.length} submissions (page ${page}, total: ${result.total})`)
    
    return NextResponse.json({ 
      submissions: result.submissions,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    })
  } catch (error) {
    console.error('❌ Error fetching submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Form submission received')
    
    // Test database connection first
    const dbConnected = await testConnection()
    if (!dbConnected) {
      console.error('❌ Database connection failed')
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
    
    const formData = await request.formData()
    console.log('📋 Content-Type:', request.headers.get('content-type'))
    console.log('📋 Form data keys:', Array.from(formData.keys()))

    // Extract form fields with proper validation
    const submission = {
      // Personal Details
      surname: (formData.get('surname') as string) || '',
      firstName: (formData.get('firstName') as string) || '',
      fathersHusbandName: (formData.get('fathersHusbandName') as string) || '',
      fathersHusbandFullName: (formData.get('fathersHusbandFullName') as string) || undefined,
      sex: (formData.get('sex') as 'M' | 'F') || 'M',
      qualification: (formData.get('qualification') as string) || undefined,
      occupation: (formData.get('occupation') as string) || undefined,
      dateOfBirth: (formData.get('dateOfBirth') as string) || '',
      ageYears: parseInt(formData.get('ageYears') as string) || 0,
      ageMonths: parseInt(formData.get('ageMonths') as string) || 0,

      // Address Details
      district: (formData.get('district') as string) || '',
      taluka: (formData.get('taluka') as string) || '',
      villageName: (formData.get('villageName') as string) || '',
      houseNo: (formData.get('houseNo') as string) || '',
      street: (formData.get('street') as string) || '',
      pinCode: (formData.get('pinCode') as string) || '',

      // Contact and Identification
      mobileNumber: (formData.get('mobileNumber') as string) || '',
      email: (formData.get('email') as string) || undefined,
      aadhaarNumber: (formData.get('aadhaarNumber') as string) || '',
      
      // Education Details
      yearOfPassing: (formData.get('yearOfPassing') as string) || undefined,
      degreeDiploma: (formData.get('degreeDiploma') as string) || undefined,
      nameOfUniversity: (formData.get('nameOfUniversity') as string) || undefined,
      nameOfDiploma: (formData.get('nameOfDiploma') as string) || undefined,
      
      // Additional Information
      haveChangedName: (formData.get('haveChangedName') as 'Yes' | 'No') || 'No',
      place: (formData.get('place') as string) || '',
      declarationDate: (formData.get('declarationDate') as string) || '',
      
      // Files will be handled separately
      files: {} as Record<string, any>
    }

    // Validate required fields
    const requiredFields = ['surname', 'firstName', 'mobileNumber', 'aadhaarNumber', 'district', 'taluka']
    const missingFields = requiredFields.filter(field => !submission[field as keyof typeof submission])
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        missingFields 
      }, { status: 400 })
    }

    // Check for duplicates before processing
    const duplicates = await SubmissionsDAL.checkDuplicates(submission.mobileNumber, submission.aadhaarNumber)
    if (duplicates.mobileExists || duplicates.aadhaarExists) {
      return NextResponse.json({ 
        error: 'Duplicate submission',
        details: {
          mobileExists: duplicates.mobileExists,
          aadhaarExists: duplicates.aadhaarExists
        }
      }, { status: 409 })
    }

    // Handle file uploads
    await ensureDataDir()

    const fileFields = [
      'degreeCertificate',
      'aadhaarCard', 
      'residentialProof',
      'marriageCertificate',
      'signaturePhoto'
    ]

    for (const field of fileFields) {
      const file = formData.get(field) as File
      if (file && file.size > 0) {
        const timestamp = Date.now()
        const filename = `${timestamp}-${file.name}`
        const filepath = path.join(UPLOADS_DIR, filename)
        
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)
        
        const filesObj = submission.files as Record<string, any>
        filesObj[field] = {
          originalName: file.name,
          filename: filename,
          size: file.size,
          path: filepath,
          uploadedAt: new Date().toISOString()
        }
      }
    }

    console.log('💾 Saving submission to database:', {
      surname: submission.surname,
      firstName: submission.firstName,
      mobileNumber: submission.mobileNumber,
      district: submission.district,
      taluka: submission.taluka,
      filesCount: Object.keys(submission.files).length
    })

    // Save to database with transaction safety
    const savedSubmission = await SubmissionsDAL.create(submission)
    console.log('✅ Submission saved with ID:', savedSubmission.id)
    
    // Send WhatsApp notification asynchronously (don't block response)
    const whatsappPromise = sendWhatsAppNotification(savedSubmission, savedSubmission.id)
    
    // Return response immediately
    return NextResponse.json({
      success: true,
      submissionId: savedSubmission.id,
      message: 'Registration submitted successfully!',
      whatsappStatus: 'processing' // WhatsApp is being sent in background
    })

  } catch (error) {
    console.error('❌ Error processing submission:', error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate')) {
        return NextResponse.json({ 
          error: 'A submission with this information already exists' 
        }, { status: 409 })
      }
      
      if (error.message.includes('constraint')) {
        return NextResponse.json({ 
          error: 'Invalid data provided. Please check your input.' 
        }, { status: 400 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to process submission',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}