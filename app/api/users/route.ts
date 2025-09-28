import { NextRequest, NextResponse } from 'next/server'
import { UserManagement } from '@/lib/user-management'
import { withAuth } from '@/lib/auth-middleware'

// GET /api/users - Get all users with filtering
export const GET = withAuth(async (request: AuthenticatedRequest) => {
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
}, 'admin') // Only admins can manage users

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password, role, district, taluka } = body

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json({ 
        error: 'Email, password, and role are required' 
      }, { status: 400 })
    }

    // Validate role
    if (!['admin', 'volunteer', 'supervisor'].includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role' 
      }, { status: 400 })
    }

    const result = await UserManagement.createUser({
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
      district,
      taluka
    })

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to create user' 
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ 
      error: 'Failed to create user' 
    }, { status: 500 })
  }
}
