import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken, getUserById } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: any
}

export function withAuth(
  handler: (request: AuthenticatedRequest, context?: any) => Promise<NextResponse>,
  requiredRole?: 'admin' | 'volunteer' | 'supervisor'
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      const authHeader = request.headers.get('authorization')
      const tokenResult = verifyAuthToken(authHeader)

      if (!tokenResult.valid) {
        return NextResponse.json({ 
          error: 'Unauthorized', 
          details: tokenResult.error 
        }, { status: 401 })
      }

      // Get full user data from database
      const user = await getUserById(tokenResult.user.id)
      if (!user) {
        return NextResponse.json({ 
          error: 'User not found' 
        }, { status: 401 })
      }

      // Check role if required
      if (requiredRole && user.role !== requiredRole) {
        return NextResponse.json({ 
          error: 'Insufficient permissions' 
        }, { status: 403 })
      }

      // Add user to request object
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = user

      return await handler(authenticatedRequest, context)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json({ 
        error: 'Authentication failed' 
      }, { status: 500 })
    }
  }
}

// Helper function to check if user has required role
export function hasRole(user: any, requiredRole: 'admin' | 'volunteer' | 'supervisor'): boolean {
  if (!user || !user.role) return false
  
  const roleHierarchy = {
    'volunteer': 1,
    'supervisor': 2,
    'admin': 3
  }
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}

// Helper function to check if user can access resource
export function canAccessResource(user: any, resourceUserId?: number): boolean {
  if (!user) return false
  
  // Admin can access everything
  if (user.role === 'admin') return true
  
  // Users can access their own resources
  if (resourceUserId && user.id === resourceUserId) return true
  
  // Supervisor can access volunteer resources
  if (user.role === 'supervisor') return true
  
  return false
}
