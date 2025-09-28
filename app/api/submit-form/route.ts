import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { twilioWhatsAppService } from '@/lib/twilio-whatsapp'
import { SubmissionsDAL } from '@/lib/submissions-dal'
import { testConnection } from '@/lib/database'
import { withAuth } from '@/lib/auth-middleware'

// Ensure uploads directory exists
const UPLOADS_DIR = join(process.cwd(), 'data', 'uploads')

// File upload security configuration
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'application/pdf',
  'image/gif'
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES_PER_SUBMISSION = 5

console.log('📁 Uploads directory:', UPLOADS_DIR)

// File validation function
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File ${file.name} is too large. Maximum size is 5MB.` }
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed.` }
  }

  // Check file name for security
  const fileName = file.name.toLowerCase()
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com']
  if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
    return { valid: false, error: `File ${file.name} has a dangerous extension.` }
  }

  return { valid: true }
}

async function ensureUploadsDir() {
  try {
    await mkdir(UPLOADS_DIR, { recursive: true })
  } catch (error) {
    console.error('Error creating uploads directory:', error)
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

export const GET = withAuth(async (request: AuthenticatedRequest) => {
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
    const search = searchParams.get('search') || undefined
    const userId = searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : undefined

    const offset = (page - 1) * limit

    // Filter by user permissions
    let filteredUserId = userId
    if (request.user.role === 'volunteer') {
      // Volunteers can only see their own submissions
      filteredUserId = request.user.id
    } else if (request.user.role === 'supervisor') {
      // Supervisors can see their district/taluka submissions
      if (request.user.district) {
        // Filter by district if supervisor has district assigned
      }
    }

    const result = await SubmissionsDAL.getAll({
      limit,
      offset,
      status,
      district: request.user.role === 'supervisor' ? request.user.district : district,
      taluka: request.user.role === 'supervisor' ? request.user.taluka : taluka,
      search,
      userId: filteredUserId
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
}, 'volunteer') // Allow volunteers and above

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
      files: {} as Record<string, any>,
      
      // Additional metadata
      ipAddress: (() => {
        const forwarded = request.headers.get('x-forwarded-for')
        const realIp = request.headers.get('x-real-ip')
        const ip = forwarded || realIp || '127.0.0.1'
        // Extract first IP if comma-separated (load balancer case)
        return ip.split(',')[0].trim()
      })(),
      userAgent: request.headers.get('user-agent') || 'unknown',
      source: 'web'
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

    // Handle file uploads with security validation
    await ensureUploadsDir()

    const fileFields = [
      'degreeCertificate',
      'aadhaarCard', 
      'residentialProof',
      'marriageCertificate',
      'signaturePhoto'
    ]

    let fileCount = 0
    const fileErrors: string[] = []

    for (const field of fileFields) {
      const file = formData.get(field) as File
      if (file && file.size > 0) {
        // Validate file
        const validation = validateFile(file)
        if (!validation.valid) {
          fileErrors.push(validation.error!)
          continue
        }

        // Check file count limit
        if (fileCount >= MAX_FILES_PER_SUBMISSION) {
          fileErrors.push(`Maximum ${MAX_FILES_PER_SUBMISSION} files allowed per submission`)
          break
        }

        try {
          const timestamp = Date.now()
          const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
          const filename = `${timestamp}-${sanitizedFileName}`
          const filepath = join(UPLOADS_DIR, filename)
          
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
          
          fileCount++
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error)
          fileErrors.push(`Failed to upload ${file.name}`)
        }
      }
    }

    // Return file validation errors if any
    if (fileErrors.length > 0) {
      return NextResponse.json({ 
        error: 'File upload validation failed', 
        fileErrors 
      }, { status: 400 })
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