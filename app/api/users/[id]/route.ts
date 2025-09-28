import { NextRequest, NextResponse } from 'next/server'
import { UserManagement } from '@/lib/user-management'
import { withAuth } from '@/lib/auth-middleware'

// GET /api/users/[id] - Get user by ID
export const GET = withAuth(async (request: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const userId = parseInt(params.id)
    
    if (isNaN(userId)) {
      return NextResponse.json({ 
        error: 'Invalid user ID' 
      }, { status: 400 })
    }

    const user = await UserManagement.getUserById(userId)
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch user' 
    }, { status: 500 })
  }
}, 'admin') // Only admins can view user details

// PATCH /api/users/[id] - Update user
export const PATCH = withAuth(async (request: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const userId = parseInt(params.id)
    
    if (isNaN(userId)) {
      return NextResponse.json({ 
        error: 'Invalid user ID' 
      }, { status: 400 })
    }

    const body = await request.json()
    const updates = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      password: body.password,
      role: body.role,
      district: body.district,
      taluka: body.taluka,
      isActive: body.isActive
    }

    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key as keyof typeof updates] === undefined) {
        delete updates[key as keyof typeof updates]
      }
    })

    const result = await UserManagement.updateUser(userId, updates)

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to update user' 
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      message: 'User updated successfully'
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ 
      error: 'Failed to update user' 
    }, { status: 500 })
  }
}, 'admin') // Only admins can update users

// DELETE /api/users/[id] - Deactivate user
export const DELETE = withAuth(async (request: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const userId = parseInt(params.id)
    
    if (isNaN(userId)) {
      return NextResponse.json({ 
        error: 'Invalid user ID' 
      }, { status: 400 })
    }

    const result = await UserManagement.deactivateUser(userId)

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to deactivate user' 
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully'
    })
  } catch (error) {
    console.error('Error deactivating user:', error)
    return NextResponse.json({ 
      error: 'Failed to deactivate user' 
    }, { status: 500 })
  }
}, 'admin') // Only admins can deactivate users
