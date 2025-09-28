import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { twilioWhatsAppService } from '@/lib/twilio-whatsapp'

// Ensure data directory exists
const DATA_DIR = join(process.cwd(), 'data')
const SUBMISSIONS_FILE = join(DATA_DIR, 'submissions.json')

console.log('📁 Data directory:', DATA_DIR)
console.log('📄 Submissions file:', SUBMISSIONS_FILE)

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

async function getSubmissions() {
  try {
    const data = await readFile(SUBMISSIONS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveSubmission(submission: any) {
  const submissions = await getSubmissions()
  submissions.push(submission)
  await writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2))
  return submission
}

// WhatsApp notification function
async function sendWhatsAppNotification(submission: any) {
  try {
    console.log('📱 Starting WhatsApp notification for:', submission.mobileNumber)
    
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

    const result = await twilioWhatsAppService.sendFormSubmissionNotification(submission, submission.id)
    console.log('📱 WhatsApp notification result:', result)
    
    return { 
      success: true, 
      message: 'Thank you message sent successfully to your mobile number!',
      messageId: result.messageId
    }
  } catch (error) {
    console.error('❌ WhatsApp notification failed:', error)
    return { 
      success: false, 
      message: 'Thank you message could not be sent, but your registration is successful', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function GET() {
  try {
    console.log('📖 Fetching submissions...')
    const submissions = await getSubmissions()
    console.log('📊 Found submissions:', submissions.length)
    
    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('❌ Error fetching submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Form submission received')
    
    const formData = await request.formData()
    console.log('📋 Content-Type:', request.headers.get('content-type'))
    console.log('📋 Form data keys:', Array.from(formData.keys()))

    // Extract form fields
    const submission = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      
      // Personal Details
      surname: formData.get('surname'),
      firstName: formData.get('firstName'),
      fathersHusbandName: formData.get('fathersHusbandName'),
      sex: formData.get('sex'),
      qualification: formData.get('qualification'),
      occupation: formData.get('occupation'),
      dateOfBirth: formData.get('dateOfBirth'),
      ageYears: formData.get('ageYears'),
      ageMonths: formData.get('ageMonths'),

      // Address Details
      district: formData.get('district'),
      taluka: formData.get('taluka'),
      villageName: formData.get('villageName'),
      houseNo: formData.get('houseNo'),
      street: formData.get('street'),
      pinCode: formData.get('pinCode'),
      mobileNumber: formData.get('mobileNumber'),
      email: formData.get('email'),
      aadhaarNumber: formData.get('aadhaarNumber'),
      
      // Educational Details
      yearOfPassing: formData.get('yearOfPassing'),
      degreeDiploma: formData.get('degreeDiploma'),
      nameOfUniversity: formData.get('nameOfUniversity'),
      nameOfDiploma: formData.get('nameOfDiploma'),
      
      // Additional Information
      haveChangedName: formData.get('haveChangedName'),
      place: formData.get('place'),
      declarationDate: formData.get('declarationDate'),
      
      // Files will be handled separately
      files: {} as Record<string, any>
    }

    // Handle file uploads
    const uploadsDir = join(DATA_DIR, 'uploads')
    await mkdir(uploadsDir, { recursive: true })

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
        const filepath = join(uploadsDir, filename)
        
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)
        
        const filesObj = submission.files as Record<string, any>
        filesObj[field] = {
          originalName: file.name,
          filename: filename,
          size: file.size,
          path: filepath
        }
      }
    }

    console.log('💾 Saving submission:', {
      surname: submission.surname,
      firstName: submission.firstName,
      fathersHusbandName: submission.fathersHusbandName,
      sex: submission.sex,
      qualification: submission.qualification,
      occupation: submission.occupation,
      dateOfBirth: submission.dateOfBirth,
      ageYears: submission.ageYears,
      ageMonths: submission.ageMonths,
      district: submission.district,
      taluka: submission.taluka,
      villageName: submission.villageName,
      houseNo: submission.houseNo,
      street: submission.street,
      pinCode: submission.pinCode,
      mobileNumber: submission.mobileNumber,
      email: submission.email,
      aadhaarNumber: submission.aadhaarNumber,
      yearOfPassing: submission.yearOfPassing,
      degreeDiploma: submission.degreeDiploma,
      nameOfUniversity: submission.nameOfUniversity,
      nameOfDiploma: submission.nameOfDiploma,
      haveChangedName: submission.haveChangedName,
      place: submission.place,
      declarationDate: submission.declarationDate,
      files: submission.files
    })

    await ensureDataDir()
    const savedSubmission = await saveSubmission(submission)
    console.log('✅ Submission saved with ID:', savedSubmission.id)
    
    // Send WhatsApp notification
    const whatsappResult = await sendWhatsAppNotification(savedSubmission)
    
    return NextResponse.json({
      success: true,
      submissionId: savedSubmission.id,
      whatsappSent: whatsappResult.success,
      whatsappMessage: whatsappResult.message,
      message: 'Registration submitted successfully!'
    })

  } catch (error) {
    console.error('❌ Error processing submission:', error)
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 })
  }
}