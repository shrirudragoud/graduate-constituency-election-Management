import { query, transaction, generateSubmissionId } from './database'

export interface Submission {
  id: string
  userId?: number
  
  // Personal Details
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
  
  // Address Details
  district: string
  taluka: string
  villageName: string
  houseNo: string
  street: string
  pinCode: string
  
  // Contact Details
  mobileNumber: string
  email?: string
  aadhaarNumber: string
  
  // Education Details
  yearOfPassing?: string
  degreeDiploma?: string
  nameOfUniversity?: string
  nameOfDiploma?: string
  
  // Additional Information
  haveChangedName?: 'Yes' | 'No'
  place: string
  declarationDate: string
  
  // Status and Metadata
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  updatedAt?: string
  
  // File attachments
  files: Record<string, any>
}

class SubmissionsDAL {
  // Create tables with proper indexes for concurrency
  async createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER,
        surname VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        fathers_husband_name VARCHAR(255) NOT NULL,
        fathers_husband_full_name VARCHAR(255),
        sex VARCHAR(10) NOT NULL,
        qualification VARCHAR(255),
        occupation VARCHAR(255),
        date_of_birth VARCHAR(255) NOT NULL,
        age_years INTEGER NOT NULL,
        age_months INTEGER NOT NULL,
        district VARCHAR(255) NOT NULL,
        taluka VARCHAR(255) NOT NULL,
        village_name VARCHAR(255) NOT NULL,
        house_no VARCHAR(255) NOT NULL,
        street VARCHAR(255) NOT NULL,
        pin_code VARCHAR(10) NOT NULL,
        mobile_number VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        aadhaar_number VARCHAR(255) NOT NULL,
        year_of_passing VARCHAR(255),
        degree_diploma VARCHAR(255),
        name_of_university VARCHAR(255),
        name_of_diploma VARCHAR(255),
        have_changed_name VARCHAR(5),
        place VARCHAR(255) NOT NULL,
        declaration_date VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        files JSONB DEFAULT '{}',
        
        -- Add constraints for data integrity
        CONSTRAINT valid_sex CHECK (sex IN ('M', 'F')),
        CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected')),
        CONSTRAINT valid_age_years CHECK (age_years >= 0 AND age_years <= 150),
        CONSTRAINT valid_age_months CHECK (age_months >= 0 AND age_months <= 11),
        CONSTRAINT valid_pin_code CHECK (pin_code ~ '^[0-9]{6}$'),
        CONSTRAINT valid_mobile_number CHECK (mobile_number ~ '^[0-9]{10}$'),
        CONSTRAINT valid_aadhaar_number CHECK (aadhaar_number ~ '^[0-9]{12}$')
      );
    `
    
    const createIndexesQuery = `
      -- Create indexes for better query performance and concurrency
      CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
      CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at);
      CREATE INDEX IF NOT EXISTS idx_submissions_mobile_number ON submissions(mobile_number);
      CREATE INDEX IF NOT EXISTS idx_submissions_aadhaar_number ON submissions(aadhaar_number);
      CREATE INDEX IF NOT EXISTS idx_submissions_district ON submissions(district);
      CREATE INDEX IF NOT EXISTS idx_submissions_taluka ON submissions(taluka);
      CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
      
      -- Composite indexes for common queries
      CREATE INDEX IF NOT EXISTS idx_submissions_status_submitted_at ON submissions(status, submitted_at);
      CREATE INDEX IF NOT EXISTS idx_submissions_district_taluka ON submissions(district, taluka);
    `
    
    await query(createTableQuery)
    await query(createIndexesQuery)
    console.log('✅ Submissions table and indexes created')
  }

  // Create submission with transaction safety
  async create(submission: Omit<Submission, 'id' | 'submittedAt' | 'status'>): Promise<Submission> {
    return await transaction(async (client) => {
      const submissionId = generateSubmissionId()
      const now = new Date().toISOString()
      
      const newSubmission: Submission = {
        ...submission,
        id: submissionId,
        status: 'pending',
        submittedAt: now,
        updatedAt: now
      }

      // Check for duplicate mobile number or Aadhaar number
      const duplicateCheck = await client.query(
        `SELECT id FROM submissions 
         WHERE mobile_number = $1 OR aadhaar_number = $2 
         LIMIT 1`,
        [submission.mobileNumber, submission.aadhaarNumber]
      )

      if (duplicateCheck.rows.length > 0) {
        throw new Error('A submission with this mobile number or Aadhaar number already exists')
      }

      const res = await client.query(
        `INSERT INTO submissions (
          id, user_id, surname, first_name, fathers_husband_name, fathers_husband_full_name,
          sex, qualification, occupation, date_of_birth, age_years, age_months,
          district, taluka, village_name, house_no, street, pin_code,
          mobile_number, email, aadhaar_number,
          year_of_passing, degree_diploma, name_of_university, name_of_diploma,
          have_changed_name, place, declaration_date, status, submitted_at, updated_at, files
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)
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
          newSubmission.updatedAt, newSubmission.files
        ]
      )
      
      return res.rows[0]
    })
  }

  // Get all submissions with pagination and filtering
  async getAll(options: {
    limit?: number
    offset?: number
    status?: string
    district?: string
    taluka?: string
  } = {}): Promise<{ submissions: Submission[], total: number }> {
    const { limit = 50, offset = 0, status, district, taluka } = options
    
    let whereClause = 'WHERE 1=1'
    const params: any[] = []
    let paramCount = 0

    if (status) {
      paramCount++
      whereClause += ` AND status = $${paramCount}`
      params.push(status)
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

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM submissions ${whereClause}`,
      params
    )
    const total = parseInt(countResult.rows[0].total)

    // Get paginated results
    paramCount++
    const limitParam = `$${paramCount}`
    paramCount++
    const offsetParam = `$${paramCount}`
    
    const res = await query(
      `SELECT * FROM submissions ${whereClause} 
       ORDER BY submitted_at DESC 
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      [...params, limit, offset]
    )

    return {
      submissions: res.rows,
      total
    }
  }

  // Get submission by ID with row-level locking
  async getById(id: string, forUpdate = false): Promise<Submission | null> {
    const lockClause = forUpdate ? 'FOR UPDATE' : ''
    const res = await query(
      `SELECT * FROM submissions WHERE id = $1 ${lockClause}`,
      [id]
    )
    return res.rows[0] || null
  }

  // Update submission status with optimistic locking
  async updateStatus(
    id: string, 
    status: 'pending' | 'approved' | 'rejected',
    updatedBy?: string
  ): Promise<Submission | null> {
    return await transaction(async (client) => {
      // First, get the current submission with lock
      const current = await client.query(
        'SELECT * FROM submissions WHERE id = $1 FOR UPDATE',
        [id]
      )

      if (current.rows.length === 0) {
        throw new Error('Submission not found')
      }

      // Update with new timestamp
      const res = await client.query(
        `UPDATE submissions 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [status, id]
      )

      return res.rows[0] || null
    })
  }

  // Bulk update status for multiple submissions
  async bulkUpdateStatus(
    ids: string[], 
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<{ updated: number, failed: string[] }> {
    return await transaction(async (client) => {
      const failed: string[] = []
      let updated = 0

      for (const id of ids) {
        try {
          const res = await client.query(
            `UPDATE submissions 
             SET status = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 AND status != $1`,
            [status, id]
          )
          if (res.rowCount > 0) {
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

  // Delete submission (soft delete by updating status)
  async delete(id: string): Promise<boolean> {
    return await transaction(async (client) => {
      const res = await client.query(
        'UPDATE submissions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['deleted', id]
      )
      return res.rowCount > 0
    })
  }

  // Hard delete (permanent removal)
  async hardDelete(id: string): Promise<boolean> {
    const res = await query('DELETE FROM submissions WHERE id = $1', [id])
    return res.rowCount > 0
  }

  // Search submissions with full-text search
  async search(query: string, limit = 20): Promise<Submission[]> {
    const res = await query(
      `SELECT * FROM submissions 
       WHERE to_tsvector('english', 
         surname || ' ' || first_name || ' ' || mobile_number || ' ' || aadhaar_number
       ) @@ plainto_tsquery('english', $1)
       ORDER BY submitted_at DESC 
       LIMIT $2`,
      [query, limit]
    )
    return res.rows
  }

  // Get statistics for dashboard
  async getStatistics(): Promise<{
    total: number
    pending: number
    approved: number
    rejected: number
    today: number
    thisWeek: number
    thisMonth: number
  }> {
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

    const stats = res.rows[0]
    return {
      total: parseInt(stats.total),
      pending: parseInt(stats.pending),
      approved: parseInt(stats.approved),
      rejected: parseInt(stats.rejected),
      today: parseInt(stats.today),
      thisWeek: parseInt(stats.this_week),
      thisMonth: parseInt(stats.this_month)
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
}

export const SubmissionsDAL = new SubmissionsDAL()
