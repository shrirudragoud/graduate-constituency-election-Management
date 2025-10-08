import { NextRequest, NextResponse } from 'next/server'
import { UserManagement } from '@/lib/user-management'

// GET /api/admin/users - Get all users for admin dashboard (no auth required)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      role: searchParams.get('role') as 'admin' | 'volunteer' | 'supervisor' | undefined,
      district: searchParams.get('district') || undefined,
      taluka: searchParams.get('taluka') || undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      search: searchParams.get('search') || undefined
    }

    const result = await UserManagement.getUsers(filters)
    
    return NextResponse.json({
      success: true,
      users: result.users,
      pagination: {
        total: result.total,
        limit: filters.limit,
        offset: filters.offset,
        totalPages: Math.ceil(result.total / filters.limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch users' 
    }, { status: 500 })
  }
}
