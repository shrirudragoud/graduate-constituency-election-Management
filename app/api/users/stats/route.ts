import { NextRequest, NextResponse } from 'next/server'
import { UserManagement } from '@/lib/user-management'
import { withAuth } from '@/lib/auth-middleware'

// GET /api/users/stats - Get user statistics
export const GET = withAuth(async (request: AuthenticatedRequest) => {
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
}, 'admin') // Only admins can view user statistics
