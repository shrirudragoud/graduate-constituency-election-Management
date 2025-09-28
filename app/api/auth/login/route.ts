import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, createUser } from '@/lib/auth'
import { testConnection } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    // Test database connection
    const dbConnected = await testConnection()
    if (!dbConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const body = await request.json()
    const { loginField, password, loginType, action = 'login' } = body

    // Validate input
    if (!loginField || !password) {
      return NextResponse.json({ 
        error: 'Login field and password are required' 
      }, { status: 400 })
    }

    if (loginType !== 'email' && loginType !== 'phone') {
      return NextResponse.json({ 
        error: 'Invalid login type' 
      }, { status: 400 })
    }

    if (action === 'login') {
      // Authenticate user
      const result = await authenticateUser(loginField, password, loginType)
      
      if (!result.success) {
        return NextResponse.json({ 
          error: result.error || 'Authentication failed' 
        }, { status: 401 })
      }

      return NextResponse.json({
        success: true,
        user: result.user,
        token: result.token,
        message: 'Login successful'
      })
    } else if (action === 'register') {
      // Register new user (only for volunteers)
      const { email, firstName, lastName, phone, district, taluka } = body
      
      if (!email) {
        return NextResponse.json({ 
          error: 'Email is required for registration' 
        }, { status: 400 })
      }

      const result = await createUser({
        email,
        password,
        role: 'volunteer',
        firstName,
        lastName,
        phone,
        district,
        taluka
      })

      if (!result.success) {
        return NextResponse.json({ 
          error: result.error || 'Registration failed' 
        }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        user: result.user,
        token: result.token,
        message: 'Registration successful'
      })
    } else {
      return NextResponse.json({ 
        error: 'Invalid action' 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
