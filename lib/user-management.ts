import { query, transaction } from './database'
import { hashPassword } from './auth'
import { twilioWhatsAppService } from './twilio-whatsapp'

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
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  email: string
  password: string
  role: 'admin' | 'volunteer' | 'supervisor'
  firstName?: string
  lastName?: string
  phone?: string
  district?: string
  taluka?: string
}

export interface UserFilters {
  limit?: number
  offset?: number
  role?: 'admin' | 'volunteer' | 'supervisor'
  district?: string
  taluka?: string
  isActive?: boolean
  search?: string
}

class UserManagementService {
  // Create new user with WhatsApp notification
  async createUser(userData: CreateUserData): Promise<{ success: boolean; user?: User; error?: string }> {
    return await transaction(async (client) => {
      try {
        // Check if user already exists
        const existingUser = await client.query(
          'SELECT id FROM users WHERE email = $1',
          [userData.email]
        )

        if (existingUser.rows.length > 0) {
          return { success: false, error: 'User with this email already exists' }
        }

        // Hash password
        const hashedPassword = await hashPassword(userData.password)

        // Create user
        const result = await client.query(
          `INSERT INTO users (email, password, role, first_name, last_name, phone, district, taluka, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           RETURNING id, email, role, first_name, last_name, phone, district, taluka, is_active, created_at, updated_at`,
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

        const user = this.mapRowToUser(result.rows[0])

        // Send WhatsApp welcome message
        if (user.phone) {
          try {
            await this.sendWelcomeMessage(user)
          } catch (error) {
            console.error('Failed to send welcome WhatsApp message:', error)
            // Don't fail user creation if WhatsApp fails
          }
        }

        return { success: true, user }
      } catch (error) {
        console.error('Create user error:', error)
        return { success: false, error: 'Failed to create user' }
      }
    })
  }

  // Get all users with filtering and pagination
  async getUsers(filters: UserFilters = {}): Promise<{ users: User[], total: number }> {
    const {
      limit = 50,
      offset = 0,
      role,
      district,
      taluka,
      isActive,
      search
    } = filters

    let whereClause = 'WHERE 1=1'
    const params: any[] = []
    let paramCount = 0

    if (role) {
      paramCount++
      whereClause += ` AND role = $${paramCount}`
      params.push(role)
    }

    if (district) {
      paramCount++
      whereClause += ` AND district = $${paramCount}`
      params.push(district)
    }

    if (taluka) {
      paramCount++
      whereClause += ` AND taluka = $${paramCount}`
      params.push(taluka)
    }

    if (isActive !== undefined) {
      paramCount++
      whereClause += ` AND is_active = $${paramCount}`
      params.push(isActive)
    }

    if (search) {
      paramCount++
      whereClause += ` AND (
        first_name ILIKE $${paramCount} OR 
        last_name ILIKE $${paramCount} OR 
        email ILIKE $${paramCount} OR 
        phone ILIKE $${paramCount}
      )`
      params.push(`%${search}%`)
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    )
    const total = parseInt(countResult.rows[0].total)

    // Get paginated results
    paramCount++
    const limitParam = `$${paramCount}`
    paramCount++
    const offsetParam = `$${paramCount}`
    
    const res = await query(
      `SELECT id, email, role, first_name, last_name, phone, district, taluka, is_active, last_login, created_at, updated_at
       FROM users ${whereClause}
       ORDER BY created_at DESC 
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      [...params, limit, offset]
    )

    return {
      users: res.rows.map((row: any) => this.mapRowToUser(row)),
      total
    }
  }

  // Get user by ID
  async getUserById(id: number): Promise<User | null> {
    const res = await query(
      `SELECT id, email, role, first_name, last_name, phone, district, taluka, is_active, last_login, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    )
    return res.rows[0] ? this.mapRowToUser(res.rows[0]) : null
  }

  // Update user
  async updateUser(id: number, updates: Partial<CreateUserData>): Promise<{ success: boolean; user?: User; error?: string }> {
    return await transaction(async (client) => {
      try {
        const updateFields: string[] = []
        const values: any[] = []
        let paramCount = 0

        Object.entries(updates).forEach(([key, value]) => {
          if (value !== undefined && key !== 'password') {
            paramCount++
            updateFields.push(`${key} = $${paramCount}`)
            values.push(value)
          }
        })

        if (updates.password) {
          paramCount++
          updateFields.push(`password = $${paramCount}`)
          values.push(await hashPassword(updates.password))
        }

        if (updateFields.length === 0) {
          return { success: false, error: 'No fields to update' }
        }

        paramCount++
        updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
        values.push(id)

        const result = await client.query(
          `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
          values
        )

        if (result.rows.length === 0) {
          return { success: false, error: 'User not found' }
        }

        return { success: true, user: this.mapRowToUser(result.rows[0]) }
      } catch (error) {
        console.error('Update user error:', error)
        return { success: false, error: 'Failed to update user' }
      }
    })
  }

  // Deactivate user (soft delete)
  async deactivateUser(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await query(
        'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      )
      
      if (result.rowCount === 0) {
        return { success: false, error: 'User not found' }
      }

      return { success: true }
    } catch (error) {
      console.error('Deactivate user error:', error)
      return { success: false, error: 'Failed to deactivate user' }
    }
  }

  // Get user statistics
  async getUserStats(): Promise<{
    total: number
    active: number
    inactive: number
    byRole: Array<{ role: string; count: number }>
    byDistrict: Array<{ district: string; count: number }>
  }> {
    const res = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active,
        COUNT(CASE WHEN is_active = false THEN 1 END) as inactive
      FROM users
    `)

    const roleStats = await query(`
      SELECT role, COUNT(*) as count
      FROM users
      WHERE is_active = true
      GROUP BY role
      ORDER BY count DESC
    `)

    const districtStats = await query(`
      SELECT district, COUNT(*) as count
      FROM users
      WHERE is_active = true AND district IS NOT NULL
      GROUP BY district
      ORDER BY count DESC
      LIMIT 10
    `)

    const stats = res.rows[0]
    return {
      total: parseInt(stats.total),
      active: parseInt(stats.active),
      inactive: parseInt(stats.inactive),
      byRole: roleStats.rows.map((row: any) => ({
        role: row.role,
        count: parseInt(row.count)
      })),
      byDistrict: districtStats.rows.map((row: any) => ({
        district: row.district,
        count: parseInt(row.count)
      }))
    }
  }

  // Send welcome WhatsApp message
  private async sendWelcomeMessage(user: User): Promise<void> {
    if (!user.phone) return

    const message = `🎉 Welcome to Karykarta Portal!

Dear ${user.firstName || 'Team Member'},

Your account has been successfully created!

📋 Account Details:
• Name: ${user.firstName} ${user.lastName}
• Email: ${user.email}
• Role: ${user.role.toUpperCase()}
• Phone: ${user.phone}
${user.district ? `• District: ${user.district}` : ''}
${user.taluka ? `• Taluka: ${user.taluka}` : ''}

🔐 Login Credentials:
• Email: ${user.email}
• Password: [Check your email for password]

✅ You can now access the system and start managing voter registrations.

📱 Contact admin if you have any questions.

Welcome to the team! 🚀`

    await twilioWhatsAppService.sendMessage(user.phone, message)
  }

  // Map database row to User object
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      role: row.role,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      district: row.district,
      taluka: row.taluka,
      isActive: row.is_active,
      lastLogin: row.last_login,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }
}

export const UserManagement = new UserManagementService()
