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

    // Security: Only allow alphanumeric characters, dots, hyphens, and underscores in filename
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    // Construct the file path - VPS compatible
    const uploadsDir = join(process.cwd(), 'data', 'uploads')
    const filePath = join(uploadsDir, filename)
    
    // Security: Ensure the file path is within the uploads directory
    if (!filePath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    try {
      // Check if file exists first
      const { access } = await import('fs/promises')
      await access(filePath)
      
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
        case 'webp':
          contentType = 'image/webp'
          break
        default:
          contentType = 'application/octet-stream'
      }

      console.log(`👁️ Viewing file: ${filename} (${fileBuffer.length} bytes, ${contentType})`)

      // Return the file with appropriate headers for viewing (not downloading)
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': 'inline', // View in browser instead of download
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          'Content-Length': fileBuffer.length.toString(),
        },
      })

    } catch (fileError) {
      console.error(`❌ File not found: ${filePath}`, fileError)
      return NextResponse.json({ 
        error: 'File not found',
        details: process.env.NODE_ENV === 'development' ? `File path: ${filePath}` : undefined
      }, { status: 404 })
    }

  } catch (error) {
    console.error('❌ Error viewing file:', error)
    return NextResponse.json({ 
      error: 'Failed to view file',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}, 'volunteer') // Only authenticated volunteers and above can view files
