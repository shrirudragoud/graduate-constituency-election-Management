import { NextRequest, NextResponse } from 'next/server'
import { SubmissionsDAL } from '@/lib/submissions-dal'

// GET /api/admin/submissions - Get all submissions for admin dashboard (no auth required)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      status: searchParams.get('status') || undefined,
      district: searchParams.get('district') || undefined,
      taluka: searchParams.get('taluka') || undefined,
      userId: searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : undefined,
      filledByUserId: searchParams.get('filledByUserId') ? parseInt(searchParams.get('filledByUserId')!) : undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      search: searchParams.get('search') || undefined
    }

    const result = await SubmissionsDAL.getAll(filters)
    
    return NextResponse.json({
      success: true,
      submissions: result.submissions,
      pagination: {
        total: result.total,
        limit: filters.limit,
        offset: filters.offset,
        totalPages: Math.ceil(result.total / filters.limit)
      }
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch submissions' 
    }, { status: 500 })
  }
}
