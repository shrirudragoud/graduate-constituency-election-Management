import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { withAuth } from '@/lib/auth-middleware'

export const GET = withAuth(async (request: AuthenticatedRequest, context: { params: { filename: string } }) => {
  try {
    const { filename } = context.params
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    }

    // Security: Only allow alphanumeric characters, dots, and hyphens in filename
    if (!/^[a-zA-Z0-9.-]+$/.test(filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    // Construct the file path
    const uploadsDir = join(process.cwd(), 'data', 'uploads')
    const filePath = join(uploadsDir, filename)

    try {
      // Read the file
      const fileBuffer = await readFile(filePath)
      
      // Determine content type based on file extension
      const extension = filename.split('.').pop()?.toLowerCase()
      let contentType = 'application/octet-stream'
      
      switch (extension) {
        case 'jpg':
        case 'jpeg':
          contentType = 'image/jpeg'
          break
        case 'png':
          contentType = 'image/png'
          break
        case 'pdf':
          contentType = 'application/pdf'
          break
        case 'gif':
          contentType = 'image/gif'
          break
        default:
          contentType = 'application/octet-stream'
      }

      // Return the file with appropriate headers
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      })

    } catch (fileError) {
      console.error('File not found:', fileError)
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

  } catch (error) {
    console.error('❌ Error serving file:', error)
    return NextResponse.json({ 
      error: 'Failed to serve file',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}, 'volunteer') // Only authenticated volunteers and above can download files