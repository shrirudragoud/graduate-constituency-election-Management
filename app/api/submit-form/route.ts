import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'
import nodemailer from 'nodemailer'

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
  await ensureDataDir()
  const submissions = await getSubmissions()
  submissions.push({
    ...submission,
    id: Date.now().toString(),
    submittedAt: new Date().toISOString()
  })
  await writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2))
  return submissions[submissions.length - 1]
}

async function sendEmailNotification(submission: any) {
  try {
    console.log('📧 Email notification disabled - will be configured later')
    return // Skip email sending for now
    
    // Email functionality will be added later when environment variables are configured
    /*
    console.log('📧 Starting email notification for:', submission.email)
    
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    })
    
    console.log('📧 Transporter created successfully')
    */

    /*
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: submission.email,
      subject: 'Student Registration Confirmation - Voter ID Application',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; text-align: center;">Registration Confirmation</h2>
          
          <p>Dear ${submission.firstName} ${submission.surname},</p>
          
          <p>Thank you for submitting your voter registration form! We have successfully received your application and are currently processing it.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Application Details:</h3>
            <p><strong>Registration ID:</strong> ${submission.id}</p>
            <p><strong>Name:</strong> ${submission.firstName} ${submission.surname}</p>
            <p><strong>Mobile:</strong> ${submission.mobileNumber}</p>
            <p><strong>Email:</strong> ${submission.email}</p>
            <p><strong>Submitted on:</strong> ${new Date(submission.submittedAt).toLocaleDateString()}</p>
          </div>
          
          <p>We are working on your application and you will receive your voter ID soon. Please keep this registration ID for your records.</p>
          
          <p>If you have any questions, please contact us.</p>
          
          <p>Thank you for your patience!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log('📧 Email sent successfully:', info.messageId)
    
    return { success: true, message: 'Email sent successfully', messageId: info.messageId }
    */
    
    return { success: true, message: 'Email functionality disabled - will be configured later' }
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    return { success: false, message: 'Failed to send email', error: error.message }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Form submission received')
    
    // Check if it's JSON or FormData
    const contentType = request.headers.get('content-type')
    console.log('📋 Content-Type:', contentType)
    
    let submission
    let formData = null
    
    if (contentType?.includes('application/json')) {
      // Handle JSON data
      submission = await request.json()
      console.log('📋 JSON data received:', submission)
    } else {
      // Handle FormData (preferred for file uploads)
      formData = await request.formData()
      console.log('📋 Form data keys:', Array.from(formData.keys()))
      
      // Extract form fields
      submission = {
        // Personal Details
        surname: formData.get('surname'),
        firstName: formData.get('firstName'),
        fathersHusbandName: formData.get('fathersHusbandName'),
        fathersHusbandFullName: formData.get('fathersHusbandFullName'),
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
        
        // Name Change Details
        haveChangedName: formData.get('haveChangedName'),
        
        // Declaration
        place: formData.get('place'),
        declarationDate: formData.get('declarationDate'),
        
        // Files will be handled separately
        files: {}
      }
    }

    // Handle file uploads (only for FormData)
    if (formData) {
      const fileFields = [
        'degreeDiplomaCertificate',
        'aadhaarCard', 
        'residentialProof',
        'marriageCertificate',
        'gazetteNotification',
        'panCard',
        'signaturePhoto'
      ]

      for (const field of fileFields) {
        const file = formData.get(field) as File
        if (file && file.size > 0) {
          console.log(`📁 Processing file: ${field} = ${file.name} (${file.size} bytes)`)
          
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const fileName = `${Date.now()}-${file.name}`
          const filePath = join(DATA_DIR, 'uploads', fileName)
          
          // Ensure uploads directory exists
          await mkdir(join(DATA_DIR, 'uploads'), { recursive: true })
          await writeFile(filePath, buffer)
          
          console.log(`💾 File saved: ${filePath}`)
          
          submission.files[field] = {
            fileName: file.name,
            savedAs: fileName,
            size: file.size,
            type: file.type
          }
        }
      }
    }

    // Save submission to JSON file
    console.log('💾 Saving submission:', submission)
    const savedSubmission = await saveSubmission(submission)
    console.log('✅ Submission saved with ID:', savedSubmission.id)
    
    // Send email notification
    const emailResult = await sendEmailNotification(savedSubmission)
    
    return NextResponse.json({
      success: true,
      submissionId: savedSubmission.id,
      emailSent: emailResult.success,
      message: 'Registration submitted successfully!'
    })

  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit form' },
      { status: 500 }
    )
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
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
