import { NextRequest, NextResponse } from 'next/server'
import { generateStudentFormPDF } from '@/lib/improved-student-pdf-generator'
import { withAuth } from '@/lib/auth-middleware'

export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const { submissions } = await request.json()
    
    if (!submissions || !Array.isArray(submissions)) {
      return NextResponse.json({ 
        error: 'Missing or invalid submissions array' 
      }, { status: 400 })
    }

    console.log('🔄 Generating Form-18 PDFs for', submissions.length, 'submissions')
    
    const results = []
    let successCount = 0
    let errorCount = 0
    
    // Generate PDFs for each submission
    for (const submission of submissions) {
      try {
        const pdfPath = await generateStudentFormPDF(submission)
        results.push({
          submissionId: submission.id,
          success: true,
          pdfPath: pdfPath,
          filename: `student-form-${submission.id}.pdf`
        })
        successCount++
        console.log(`✅ PDF generated for ${submission.firstName} ${submission.surname}`)
      } catch (error) {
        results.push({
          submissionId: submission.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        errorCount++
        console.error(`❌ Failed to generate PDF for ${submission.firstName} ${submission.surname}:`, error)
      }
    }
    
    console.log(`✅ PDF generation complete: ${successCount} success, ${errorCount} errors`)
    
    return NextResponse.json({
      success: true,
      generatedCount: successCount,
      errorCount: errorCount,
      results: results,
      message: `Generated ${successCount} PDFs successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`
    })

  } catch (error) {
    console.error('❌ Error in bulk PDF generation:', error)
    return NextResponse.json({ 
      error: 'Failed to generate PDFs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}, 'volunteer') // Allow volunteers and above

