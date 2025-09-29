import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('id')
    
    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID required' }, { status: 400 })
    }

    // Check if PDF exists
    const pdfPath = join(process.cwd(), 'data', 'pdfs', `student-form-${submissionId}.pdf`)
    const htmlPath = join(process.cwd(), 'data', 'pdfs', `student-form-${submissionId}.html`)
    
    let fileInfo = null
    try {
      const stats = await readFile(pdfPath)
      fileInfo = {
        type: 'PDF',
        path: pdfPath,
        size: stats.length,
        exists: true
      }
    } catch (error) {
      try {
        const stats = await readFile(htmlPath)
        fileInfo = {
          type: 'HTML',
          path: htmlPath,
          size: stats.length,
          exists: true
        }
      } catch (htmlError) {
        fileInfo = {
          type: 'None',
          path: 'Not found',
          size: 0,
          exists: false
        }
      }
    }

    // Test file accessibility
    const testUrls = [
      `http://localhost:3000/api/files/student-form-${submissionId}.pdf`,
      `http://localhost:3000/api/files/student-form-${submissionId}.html`
    ]

    const urlTests = []
    for (const url of testUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' })
        urlTests.push({
          url,
          accessible: response.ok,
          status: response.status,
          contentType: response.headers.get('content-type')
        })
      } catch (error) {
        urlTests.push({
          url,
          accessible: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      submissionId,
      fileInfo,
      urlTests,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ PDF debug error:', error)
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
