import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename
    
    // Security check - only allow specific file types
    const allowedExtensions = ['.pdf', '.html']
    const hasValidExtension = allowedExtensions.some(ext => filename.toLowerCase().endsWith(ext))
    
    if (!hasValidExtension) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }
    
    // Security check - prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }
    
    // Construct file path
    const filePath = join(process.cwd(), 'data', 'pdfs', filename)
    
    try {
      // Read file
      const fileBuffer = await readFile(filePath)
      
      // Determine content type
      let contentType = 'application/octet-stream'
      if (filename.toLowerCase().endsWith('.pdf')) {
        contentType = 'application/pdf'
      } else if (filename.toLowerCase().endsWith('.html')) {
        contentType = 'text/html'
      }
      
      // Return file with appropriate headers
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
      
    } catch (fileError) {
      console.error('❌ File not found:', filePath)
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    
  } catch (error) {
    console.error('❌ Error serving file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}