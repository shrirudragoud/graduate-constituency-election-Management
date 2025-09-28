import { NextRequest, NextResponse } from 'next/server'
import { readFile, access } from 'fs/promises'
import { join } from 'path'
import { withAuth } from '@/lib/auth-middleware'
import { withRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

const UPLOADS_DIR = join(process.cwd(), 'data', 'uploads')

// Security: Only allow specific file extensions
const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'gif']

function isAllowedFile(filename: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? ALLOWED_EXTENSIONS.includes(extension) : false
}

function getContentType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'pdf':
      return 'application/pdf'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    default:
      return 'application/octet-stream'
  }
}

export const GET = withRateLimit(
  RATE_LIMITS.fileUpload,
  withAuth(async (request: AuthenticatedRequest, { params }: { params: { filename: string } }) => {
    try {
      const filename = params.filename
      
      // Security: Validate filename
      if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return new NextResponse('Invalid filename', { status: 400 })
      }
      
      // Security: Check file extension
      if (!isAllowedFile(filename)) {
        return new NextResponse('File type not allowed', { status: 403 })
      }
      
      const filePath = join(UPLOADS_DIR, filename)
      
      // Security: Check if file exists and is within uploads directory
      try {
        await access(filePath)
      } catch (error) {
        return new NextResponse('File not found', { status: 404 })
      }
      
      // Read the file
      const fileBuffer = await readFile(filePath)
      
      // Security: Check file size (additional check)
      if (fileBuffer.length > 10 * 1024 * 1024) { // 10MB max
        return new NextResponse('File too large', { status: 413 })
      }
      
      const contentType = getContentType(filename)
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'private, max-age=3600', // 1 hour cache for authenticated users
          'X-Content-Type-Options': 'nosniff',
        },
      })
      
    } catch (error) {
      console.error('Error serving file:', error)
      return new NextResponse('Internal server error', { status: 500 })
    }
  }, 'volunteer') // Require authentication
)
