import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { query } from './database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

export interface User {
  id: number
  email: string
  role: 'admin' | 'volunteer' | 'supervisor'
  firstName?: string
  lastName?: string
  phone?: string
  district?: string
  taluka?: string
  isActive: boolean
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Authenticate user with email/phone and password
export async function authenticateUser(
  loginField: string, 
  password: string, 
  loginType: 'email' | 'phone'
): Promise<AuthResult> {
  try {
    // Find user by email or phone
    const field = loginType === 'email' ? 'email' : 'phone'
    const result = await query(
      `SELECT id, email, password, role, first_name, last_name, phone, district, taluka, is_active
       FROM users 
       WHERE ${field} = $1 AND is_active = true`,
      [loginField]
    )

    if (result.rows.length === 0) {
      return { success: false, error: 'Invalid credentials' }
    }

    const user = result.rows[0]
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' }
    }

    const userData: User = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      district: user.district,
      taluka: user.taluka,
      isActive: user.is_active
    }

    const token = generateToken(userData)

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    )

    return { success: true, user: userData, token }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await query(
      `SELECT id, email, role, first_name, last_name, phone, district, taluka, is_active
       FROM users 
       WHERE id = $1 AND is_active = true`,
      [id]
    )

    if (result.rows.length === 0) {
      return null
    }

    const user = result.rows[0]
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      district: user.district,
      taluka: user.taluka,
      isActive: user.is_active
    }
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

// Create new user
export async function createUser(userData: {
  email: string
  password: string
  role: 'admin' | 'volunteer' | 'supervisor'
  firstName?: string
  lastName?: string
  phone?: string
  district?: string
  taluka?: string
}): Promise<AuthResult> {
  try {
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [userData.email]
    )

    if (existingUser.rows.length > 0) {
      return { success: false, error: 'User already exists' }
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    // Create user
    const result = await query(
      `INSERT INTO users (email, password, role, first_name, last_name, phone, district, taluka, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, email, role, first_name, last_name, phone, district, taluka, is_active`,
      [
        userData.email,
        hashedPassword,
        userData.role,
        userData.firstName,
        userData.lastName,
        userData.phone,
        userData.district,
        userData.taluka,
        true
      ]
    )

    const user = result.rows[0]
    const userObj: User = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      district: user.district,
      taluka: user.taluka,
      isActive: user.is_active
    }

    const token = generateToken(userObj)

    return { success: true, user: userObj, token }
  } catch (error) {
    console.error('Create user error:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

// Middleware to verify JWT token
export function verifyAuthToken(authHeader: string | null): { valid: boolean; user?: any; error?: string } {
  if (!authHeader) {
    return { valid: false, error: 'No authorization header' }
  }

  const token = authHeader.replace('Bearer ', '')
  const decoded = verifyToken(token)

  if (!decoded) {
    return { valid: false, error: 'Invalid token' }
  }

  return { valid: true, user: decoded }
}
