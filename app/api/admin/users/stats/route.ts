import { NextRequest, NextResponse } from 'next/server'
import { UserManagement } from '@/lib/user-management'

// GET /api/admin/users/stats - Get user statistics for admin dashboard (no auth required)
export async function GET(request: NextRequest) {
  try {
    const stats = await UserManagement.getUserStats()
    
    return NextResponse.json({
      success: true,
      ...stats
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch user statistics' 
    }, { status: 500 })
  }
}
