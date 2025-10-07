import { NextRequest, NextResponse } from 'next/server'
import { generateStudentFormPDF } from '@/lib/improved-student-pdf-generator'
import { withAuth } from '@/lib/auth-middleware'

export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const { submissionId, submissionData } = await request.json()
    
    if (!submissionId || !submissionData) {
      return NextResponse.json({ 
        error: 'Missing required fields: submissionId and submissionData' 
      }, { status: 400 })
    }

    console.log('🔄 Generating Form-18 PDF for submission:', submissionId)
    
    // Generate PDF using the Form-18 generator
    const pdfPath = await generateStudentFormPDF(submissionData)
    console.log('✅ Form-18 PDF generated:', pdfPath)
    
    return NextResponse.json({
      success: true,
      pdfPath: pdfPath,
      filename: `student-form-${submissionId}.pdf`,
      message: 'PDF generated successfully'
    })

  } catch (error) {
    console.error('❌ Error generating PDF:', error)
    return NextResponse.json({ 
      error: 'Failed to generate PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}, 'volunteer') // Allow volunteers and above

