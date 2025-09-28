import { query, transaction } from './database'

// Database row interface for type safety
interface DatabaseRow {
  id: string
  user_id?: number
  surname: string
  first_name: string
  fathers_husband_name: string
  fathers_husband_full_name?: string
  sex: 'M' | 'F'
  qualification?: string
  occupation?: string
  date_of_birth: string
  age_years: number
  age_months: number
  district: string
  taluka: string
  village_name: string
  house_no: string
  street: string
  pin_code: string
  mobile_number: string
  email?: string
  aadhaar_number: string
  year_of_passing?: string
  degree_diploma?: string
  name_of_university?: string
  name_of_diploma?: string
  have_changed_name?: 'Yes' | 'No'
  place: string
  declaration_date: string
  status: 'pending' | 'approved' | 'rejected' | 'deleted'
  submitted_at: string
  updated_at?: string
  approved_by?: number
  approved_at?: string
  rejection_reason?: string
  files: Record<string, any>
  ip_address?: string
  user_agent?: string
  source: string
  user_first_name?: string
  user_last_name?: string
  user_email?: string
}

// Main Submission interface matching the form structure
export interface Submission {
  id: string
  userId?: number
  
  // Personal Details (Required)
  surname: string
  firstName: string
  fathersHusbandName: string
  fathersHusbandFullName?: string
  sex: 'M' | 'F'
  qualification?: string
  occupation?: string
  dateOfBirth: string
  ageYears: number
  ageMonths: number
  
  // Address Details (Required)
  district: string
  taluka: string
  villageName: string
  houseNo: string
  street: string
  pinCode: string
  
  // Contact Details (Required)
  mobileNumber: string
  email?: string
  aadhaarNumber: string
  
  // Education Details (Required)
  yearOfPassing?: string
  degreeDiploma?: string
  nameOfUniversity?: string
  nameOfDiploma?: string
  
  // Additional Information (Required)
  haveChangedName?: 'Yes' | 'No'
  place: string
  declarationDate: string
  
  // Status and Metadata
  status: 'pending' | 'approved' | 'rejected' | 'deleted'
  submittedAt: string
  updatedAt?: string
  approvedBy?: number
  approvedAt?: string
  rejectionReason?: string
  
  // File attachments
  files: Record<string, any>
  
  // Additional metadata
  ipAddress?: string
  userAgent?: string
  source?: string
}

// Filter interface for queries
export interface SubmissionFilters {
  limit?: number
  offset?: number
  status?: 'pending' | 'approved' | 'rejected' | 'deleted'
  district?: string
  taluka?: string
  userId?: number
  dateFrom?: string
  dateTo?: string
  search?: string
}

// Statistics interface
export interface SubmissionStats {
  total: number
  pending: number
  approved: number
  rejected: number
  today: number
  thisWeek: number
  thisMonth: number
  byDistrict: Array<{ district: string; count: number }>
  byTaluka: Array<{ taluka: string; count: number }>
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

class SubmissionsDataAccessLayer {
  // Validate submission data based on form requirements
  private validateSubmission(submission: Partial<Submission>): ValidationResult {
    const errors: string[] = []
    
    // Required personal details
    if (!submission.surname?.trim()) errors.push('Surname is required')
    if (!submission.firstName?.trim()) errors.push('First name is required')
    if (!submission.fathersHusbandName?.trim()) errors.push('Father/Husband name is required')
    if (!submission.sex || !['M', 'F'].includes(submission.sex)) errors.push('Valid sex selection is required')
    if (!submission.dateOfBirth) errors.push('Date of birth is required')
    if (submission.ageYears === undefined || submission.ageYears < 0 || submission.ageYears > 150) {
      errors.push('Valid age in years is required')
    }
    if (submission.ageMonths === undefined || submission.ageMonths < 0 || submission.ageMonths > 11) {
      errors.push('Valid age in months is required')
    }
    
    // Required address details
    if (!submission.district?.trim()) errors.push('District is required')
    if (!submission.taluka?.trim()) errors.push('Taluka is required')
    if (!submission.villageName?.trim()) errors.push('Village name is required')
    if (!submission.houseNo?.trim()) errors.push('House number is required')
    if (!submission.street?.trim()) errors.push('Street is required')
    if (!submission.pinCode?.trim() || !/^[0-9]{6}$/.test(submission.pinCode)) {
      errors.push('Valid 6-digit PIN code is required')
    }
    
    // Required contact details
    if (!submission.mobileNumber?.trim() || !/^[0-9]{10}$/.test(submission.mobileNumber)) {
      errors.push('Valid 10-digit mobile number is required')
    }
    if (!submission.aadhaarNumber?.trim() || !/^[0-9]{12}$/.test(submission.aadhaarNumber)) {
      errors.push('Valid 12-digit Aadhaar number is required')
    }
    
    // Required education details
    if (!submission.yearOfPassing?.trim()) errors.push('Year of passing is required')
    if (!submission.degreeDiploma?.trim()) errors.push('Degree/Diploma is required')
    if (!submission.nameOfUniversity?.trim()) errors.push('University name is required')
    
    // Required additional information
    if (!submission.place?.trim()) errors.push('Place is required')
    if (!submission.declarationDate) errors.push('Declaration date is required')
    
    // Email validation if provided
    if (submission.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) {
      errors.push('Valid email address is required')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Create submission with comprehensive validation and transaction safety
  async create(submission: Omit<Submission, 'id' | 'submittedAt' | 'status' | 'updatedAt'>): Promise<Submission> {
    return await transaction(async (client) => {
      // Validate submission data
      const validation = this.validateSubmission(submission)
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
      }

      const submissionId = this.generateSubmissionId()
      const now = new Date().toISOString()
      
      const newSubmission: Submission = {
        ...submission,
        id: submissionId,
        status: 'pending',
        submittedAt: now,
        updatedAt: now,
        files: submission.files || {}
      }

      // Check for duplicate mobile number or Aadhaar number
      const duplicateCheck = await client.query(
        `SELECT id FROM submissions 
         WHERE (mobile_number = $1 OR aadhaar_number = $2) 
         AND status != 'deleted'
         LIMIT 1`,
        [submission.mobileNumber, submission.aadhaarNumber]
      )

      if (duplicateCheck.rows.length > 0) {
        throw new Error('A submission with this mobile number or Aadhaar number already exists')
      }

      // Insert submission
      const res = await client.query(
        `INSERT INTO submissions (
          id, user_id, surname, first_name, fathers_husband_name, fathers_husband_full_name,
          sex, qualification, occupation, date_of_birth, age_years, age_months,
          district, taluka, village_name, house_no, street, pin_code,
          mobile_number, email, aadhaar_number,
          year_of_passing, degree_diploma, name_of_university, name_of_diploma,
          have_changed_name, place, declaration_date, status, submitted_at, updated_at, files,
          ip_address, user_agent, source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35)
        RETURNING *`,
        [
          newSubmission.id, newSubmission.userId, newSubmission.surname, newSubmission.firstName, 
          newSubmission.fathersHusbandName, newSubmission.fathersHusbandFullName,
          newSubmission.sex, newSubmission.qualification, newSubmission.occupation, 
          newSubmission.dateOfBirth, newSubmission.ageYears, newSubmission.ageMonths,
          newSubmission.district, newSubmission.taluka, newSubmission.villageName, 
          newSubmission.houseNo, newSubmission.street, newSubmission.pinCode,
          newSubmission.mobileNumber, newSubmission.email, newSubmission.aadhaarNumber,
          newSubmission.yearOfPassing, newSubmission.degreeDiploma, newSubmission.nameOfUniversity, 
          newSubmission.nameOfDiploma, newSubmission.haveChangedName, newSubmission.place, 
          newSubmission.declarationDate, newSubmission.status, newSubmission.submittedAt, 
          newSubmission.updatedAt, newSubmission.files,
          newSubmission.ipAddress, newSubmission.userAgent, newSubmission.source
        ]
      )
      
      return this.mapRowToSubmission(res.rows[0] as DatabaseRow)
    })
  }

  // Get submissions with advanced filtering and pagination
  async getAll(filters: SubmissionFilters = {}): Promise<{ submissions: Submission[], total: number }> {
    const {
      limit = 50,
      offset = 0,
      status,
      district,
      taluka,
      userId,
      dateFrom,
      dateTo,
      search
    } = filters

    let whereClause = 'WHERE s.status != \'deleted\''
    const params: any[] = []
    let paramCount = 0

    if (status) {
      paramCount++
      whereClause += ` AND s.status = $${paramCount}`
      params.push(status)
    }

    if (district) {
      paramCount++
      whereClause += ` AND s.district = $${paramCount}`
      params.push(district)
    }

    if (taluka) {
      paramCount++
      whereClause += ` AND s.taluka = $${paramCount}`
      params.push(taluka)
    }

    if (userId) {
      paramCount++
      whereClause += ` AND s.user_id = $${paramCount}`
      params.push(userId)
    }

    if (dateFrom) {
      paramCount++
      whereClause += ` AND s.submitted_at >= $${paramCount}`
      params.push(dateFrom)
    }

    if (dateTo) {
      paramCount++
      whereClause += ` AND s.submitted_at <= $${paramCount}`
      params.push(dateTo)
    }

    if (search) {
      paramCount++
      whereClause += ` AND to_tsvector('english', 
        s.surname || ' ' || s.first_name || ' ' || s.mobile_number || ' ' || s.aadhaar_number
      ) @@ plainto_tsquery('english', $${paramCount})`
      params.push(search)
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM submissions s ${whereClause}`,
      params
    )
    const total = parseInt(countResult.rows[0].total)

    // Get paginated results with user information
    paramCount++
    const limitParam = `$${paramCount}`
    paramCount++
    const offsetParam = `$${paramCount}`
    
    const res = await query(
      `SELECT s.*, u.first_name as user_first_name, u.last_name as user_last_name, u.email as user_email
       FROM submissions s
       LEFT JOIN users u ON s.user_id = u.id
       ${whereClause}
       ORDER BY s.submitted_at DESC 
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      [...params, limit, offset]
    )

    return {
      submissions: res.rows.map((row: DatabaseRow) => this.mapRowToSubmission(row)),
      total
    }
  }

  // Get submission by ID with row-level locking
  async getById(id: string, forUpdate = false): Promise<Submission | null> {
    const lockClause = forUpdate ? 'FOR UPDATE' : ''
    const res = await query(
      `SELECT s.*, u.first_name as user_first_name, u.last_name as user_last_name, u.email as user_email
       FROM submissions s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = $1 ${lockClause}`,
      [id]
    )
    return res.rows[0] ? this.mapRowToSubmission(res.rows[0] as DatabaseRow) : null
  }

  // Update submission status with audit trail
  async updateStatus(
    id: string, 
    status: 'pending' | 'approved' | 'rejected' | 'deleted',
    updatedBy?: number,
    rejectionReason?: string
  ): Promise<Submission | null> {
    return await transaction(async (client) => {
      // Get current submission
      const current = await client.query(
        'SELECT * FROM submissions WHERE id = $1 FOR UPDATE',
        [id]
      )

      if (current.rows.length === 0) {
        throw new Error('Submission not found')
      }

      const now = new Date().toISOString()
      const updateData: any = {
        status,
        updated_at: now
      }

      if (status === 'approved') {
        updateData.approved_by = updatedBy
        updateData.approved_at = now
        updateData.rejection_reason = null
      } else if (status === 'rejected') {
        updateData.rejection_reason = rejectionReason
        updateData.approved_by = updatedBy
        updateData.approved_at = now
      }

      // Update submission
      const res = await client.query(
        `UPDATE submissions 
         SET ${Object.keys(updateData).map((key, index) => `${key} = $${index + 2}`).join(', ')}
         WHERE id = $1 
         RETURNING *`,
        [id, ...Object.values(updateData)]
      )

      // Log audit trail
      await client.query(
        `INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_by)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          'submissions',
          id,
          'UPDATE',
          JSON.stringify(current.rows[0]),
          JSON.stringify(res.rows[0]),
          updatedBy
        ]
      )

      return this.mapRowToSubmission(res.rows[0] as DatabaseRow)
    })
  }

  // Bulk update status for multiple submissions
  async bulkUpdateStatus(
    ids: string[], 
    status: 'pending' | 'approved' | 'rejected' | 'deleted',
    updatedBy?: number
  ): Promise<{ updated: number, failed: string[] }> {
    return await transaction(async (client) => {
      const failed: string[] = []
      let updated = 0

      for (const id of ids) {
        try {
          const res = await client.query(
            `UPDATE submissions 
             SET status = $1, updated_at = CURRENT_TIMESTAMP, approved_by = $3, approved_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND status != $1`,
            [status, id, updatedBy]
          )
          if (res.rowCount && res.rowCount > 0) {
            updated++
          }
        } catch (error) {
          console.error(`Failed to update submission ${id}:`, error)
          failed.push(id)
        }
      }

      return { updated, failed }
    })
  }

  // Search submissions with full-text search
  async search(queryText: string, limit = 20): Promise<Submission[]> {
    const res = await query(
      `SELECT s.*, u.first_name as user_first_name, u.last_name as user_last_name, u.email as user_email
       FROM submissions s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.status != 'deleted'
       AND to_tsvector('english', 
         s.surname || ' ' || s.first_name || ' ' || s.mobile_number || ' ' || s.aadhaar_number
       ) @@ plainto_tsquery('english', $1)
       ORDER BY ts_rank(to_tsvector('english', 
         s.surname || ' ' || s.first_name || ' ' || s.mobile_number || ' ' || s.aadhaar_number
       ), plainto_tsquery('english', $1)) DESC, s.submitted_at DESC
       LIMIT $2`,
      [queryText, limit]
    )
    return res.rows.map((row: DatabaseRow) => this.mapRowToSubmission(row))
  }

  // Get comprehensive statistics
  async getStatistics(): Promise<SubmissionStats> {
    const res = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN submitted_at >= CURRENT_DATE THEN 1 END) as today,
        COUNT(CASE WHEN submitted_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as this_week,
        COUNT(CASE WHEN submitted_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as this_month
      FROM submissions
      WHERE status != 'deleted'
    `)

    const districtStats = await query(`
      SELECT district, COUNT(*) as count
      FROM submissions
      WHERE status != 'deleted'
      GROUP BY district
      ORDER BY count DESC
      LIMIT 10
    `)

    const talukaStats = await query(`
      SELECT taluka, COUNT(*) as count
      FROM submissions
      WHERE status != 'deleted'
      GROUP BY taluka
      ORDER BY count DESC
      LIMIT 10
    `)

    const stats = res.rows[0]
    return {
      total: parseInt(stats.total),
      pending: parseInt(stats.pending),
      approved: parseInt(stats.approved),
      rejected: parseInt(stats.rejected),
      today: parseInt(stats.today),
      thisWeek: parseInt(stats.this_week),
      thisMonth: parseInt(stats.this_month),
      byDistrict: districtStats.rows.map((row: any) => ({
        district: row.district,
        count: parseInt(row.count)
      })),
      byTaluka: talukaStats.rows.map((row: any) => ({
        taluka: row.taluka,
        count: parseInt(row.count)
      }))
    }
  }

  // Check for duplicate mobile or Aadhaar
  async checkDuplicates(mobileNumber: string, aadhaarNumber: string): Promise<{
    mobileExists: boolean
    aadhaarExists: boolean
  }> {
    const res = await query(
      `SELECT 
         COUNT(CASE WHEN mobile_number = $1 THEN 1 END) as mobile_count,
         COUNT(CASE WHEN aadhaar_number = $2 THEN 1 END) as aadhaar_count
       FROM submissions 
       WHERE status != 'deleted'`,
      [mobileNumber, aadhaarNumber]
    )

    const counts = res.rows[0]
    return {
      mobileExists: parseInt(counts.mobile_count) > 0,
      aadhaarExists: parseInt(counts.aadhaar_count) > 0
    }
  }

  // Delete submission (soft delete)
  async delete(id: string, deletedBy?: number): Promise<boolean> {
    return await transaction(async (client) => {
      const res = await client.query(
        'UPDATE submissions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['deleted', id]
      )
      return res.rowCount ? res.rowCount > 0 : false
    })
  }

  // Hard delete (permanent removal)
  async hardDelete(id: string): Promise<boolean> {
    const res = await query('DELETE FROM submissions WHERE id = $1', [id])
    return res.rowCount ? res.rowCount > 0 : false
  }

  // Generate unique submission ID
  private generateSubmissionId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `SUB_${timestamp}_${random}`
  }

  // Map database row to Submission object with proper type safety
  private mapRowToSubmission(row: DatabaseRow): Submission {
    return {
      id: row.id,
      userId: row.user_id,
      surname: row.surname,
      firstName: row.first_name,
      fathersHusbandName: row.fathers_husband_name,
      fathersHusbandFullName: row.fathers_husband_full_name,
      sex: row.sex,
      qualification: row.qualification,
      occupation: row.occupation,
      dateOfBirth: row.date_of_birth,
      ageYears: row.age_years,
      ageMonths: row.age_months,
      district: row.district,
      taluka: row.taluka,
      villageName: row.village_name,
      houseNo: row.house_no,
      street: row.street,
      pinCode: row.pin_code,
      mobileNumber: row.mobile_number,
      email: row.email,
      aadhaarNumber: row.aadhaar_number,
      yearOfPassing: row.year_of_passing,
      degreeDiploma: row.degree_diploma,
      nameOfUniversity: row.name_of_university,
      nameOfDiploma: row.name_of_diploma,
      haveChangedName: row.have_changed_name,
      place: row.place,
      declarationDate: row.declaration_date,
      status: row.status,
      submittedAt: row.submitted_at,
      updatedAt: row.updated_at,
      approvedBy: row.approved_by,
      approvedAt: row.approved_at,
      rejectionReason: row.rejection_reason,
      files: row.files || {},
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      source: row.source
    }
  }
}

export const SubmissionsDAL = new SubmissionsDataAccessLayer()
