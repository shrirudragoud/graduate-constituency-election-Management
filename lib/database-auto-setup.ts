import { Pool } from 'pg'

/**
 * Safe Database Auto-Setup System
 * Automatically initializes database tables and indexes on startup
 * Preserves all existing data and is safe to run multiple times
 */

interface DatabaseSetupResult {
  success: boolean
  message: string
  tablesCreated: string[]
  indexesCreated: string[]
  errors: string[]
}

class DatabaseAutoSetup {
  private pool: Pool
  private isInitialized = false

  constructor() {
    // Use same config as main database.ts
    const dbConfig = {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'election_enrollment',
      password: process.env.DB_PASSWORD || 'password',
      port: parseInt(process.env.DB_PORT || '5432'),
      max: 10, // Smaller pool for setup operations
      min: 2,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
    
    this.pool = new Pool(dbConfig)
  }

  /**
   * Safe database initialization - only creates missing components
   */
  async initializeDatabase(): Promise<DatabaseSetupResult> {
    if (this.isInitialized) {
      return {
        success: true,
        message: 'Database already initialized',
        tablesCreated: [],
        indexesCreated: [],
        errors: []
      }
    }

    const result: DatabaseSetupResult = {
      success: true,
      message: 'Database initialization completed',
      tablesCreated: [],
      indexesCreated: [],
      errors: []
    }

    try {
      console.log('🔧 Starting safe database auto-setup...')

      // Test connection first
      await this.testConnection()

      // Create tables safely
      await this.createTablesSafely(result)

      // Create indexes safely
      await this.createIndexesSafely(result)

      // Create triggers safely
      await this.createTriggersSafely(result)

      // Create functions safely
      await this.createFunctionsSafely(result)

      this.isInitialized = true
      console.log('✅ Database auto-setup completed successfully')

    } catch (error) {
      console.error('❌ Database auto-setup failed:', error)
      result.success = false
      result.message = `Database setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      result.errors.push(result.message)
    }

    return result
  }

  /**
   * Test database connection
   */
  private async testConnection(): Promise<void> {
    const client = await this.pool.connect()
    try {
      await client.query('SELECT 1')
      console.log('✅ Database connection verified')
    } finally {
      client.release()
    }
  }

  /**
   * Create tables safely - only if they don't exist
   */
  private async createTablesSafely(result: DatabaseSetupResult): Promise<void> {
    const tables = [
      {
        name: 'users',
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'volunteer' CHECK (role IN ('admin', 'volunteer', 'supervisor')),
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            phone VARCHAR(20),
            district VARCHAR(255),
            taluka VARCHAR(255),
            is_active BOOLEAN DEFAULT true,
            last_login TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `
      },
      {
        name: 'submissions',
        sql: `
          CREATE TABLE IF NOT EXISTS submissions (
            id VARCHAR(255) PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            
            -- Personal Details
            surname VARCHAR(255) NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            fathers_husband_name VARCHAR(255) NOT NULL,
            fathers_husband_full_name VARCHAR(255),
            sex VARCHAR(10) NOT NULL CHECK (sex IN ('M', 'F')),
            qualification VARCHAR(255),
            occupation VARCHAR(255),
            date_of_birth DATE NOT NULL,
            age_years INTEGER NOT NULL CHECK (age_years >= 0 AND age_years <= 150),
            age_months INTEGER NOT NULL CHECK (age_months >= 0 AND age_months <= 11),
            
            -- Address Details
            district VARCHAR(255) NOT NULL,
            taluka VARCHAR(255) NOT NULL,
            village_name VARCHAR(255) NOT NULL,
            house_no VARCHAR(255) NOT NULL,
            street VARCHAR(255) NOT NULL,
            pin_code VARCHAR(10) NOT NULL CHECK (pin_code ~ '^[0-9]{6}$'),
            
            -- Contact Details
            mobile_number VARCHAR(20) NOT NULL CHECK (mobile_number ~ '^[0-9]{10}$'),
            email VARCHAR(255),
            aadhaar_number VARCHAR(255) NOT NULL CHECK (aadhaar_number ~ '^[0-9]{12}$'),
            
            -- Education Details
            year_of_passing VARCHAR(4),
            degree_diploma VARCHAR(255),
            name_of_university VARCHAR(255),
            name_of_diploma VARCHAR(255),
            
            -- Additional Information
            have_changed_name VARCHAR(5) CHECK (have_changed_name IN ('Yes', 'No')),
            place VARCHAR(255) NOT NULL,
            declaration_date DATE NOT NULL,
            
            -- Status and Metadata
            status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'deleted')),
            submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            approved_by INTEGER REFERENCES users(id),
            approved_at TIMESTAMP WITH TIME ZONE,
            rejection_reason TEXT,
            
            -- File attachments (JSONB for flexibility)
            files JSONB DEFAULT '{}',
            
            -- Additional metadata
            ip_address INET,
            user_agent TEXT,
            source VARCHAR(50) DEFAULT 'web',
            
            -- Team member tracking
            filled_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            filled_by_name VARCHAR(255),
            filled_by_phone VARCHAR(20),
            form_source VARCHAR(50) DEFAULT 'public' CHECK (form_source IN ('public', 'team')),
            filled_for_self BOOLEAN DEFAULT false
          )
        `
      },
      {
        name: 'file_attachments',
        sql: `
          CREATE TABLE IF NOT EXISTS file_attachments (
            id SERIAL PRIMARY KEY,
            submission_id VARCHAR(255) REFERENCES submissions(id) ON DELETE CASCADE,
            field_name VARCHAR(255) NOT NULL,
            original_name VARCHAR(255) NOT NULL,
            file_path VARCHAR(500) NOT NULL,
            file_size INTEGER NOT NULL,
            file_type VARCHAR(100),
            mime_type VARCHAR(100),
            uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            uploaded_by INTEGER REFERENCES users(id)
          )
        `
      },
      {
        name: 'audit_logs',
        sql: `
          CREATE TABLE IF NOT EXISTS audit_logs (
            id SERIAL PRIMARY KEY,
            table_name VARCHAR(255) NOT NULL,
            record_id VARCHAR(255) NOT NULL,
            action VARCHAR(50) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
            old_values JSONB,
            new_values JSONB,
            changed_by INTEGER REFERENCES users(id),
            changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            ip_address INET,
            user_agent TEXT
          )
        `
      },
      {
        name: 'statistics',
        sql: `
          CREATE TABLE IF NOT EXISTS statistics (
            id SERIAL PRIMARY KEY,
            metric_name VARCHAR(255) UNIQUE NOT NULL,
            metric_value JSONB NOT NULL,
            calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP WITH TIME ZONE
          )
        `
      }
    ]

    for (const table of tables) {
      try {
        // Check if table exists first
        const exists = await this.pool.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_name = $1 AND table_schema = 'public'
        `, [table.name])

        if (exists.rows.length === 0) {
          await this.pool.query(table.sql)
          result.tablesCreated.push(table.name)
          console.log(`✅ Created table: ${table.name}`)
        } else {
          console.log(`ℹ️ Table already exists: ${table.name}`)
        }
      } catch (error) {
        const errorMsg = `Failed to create table ${table.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(`❌ ${errorMsg}`)
        result.errors.push(errorMsg)
      }
    }
  }

  /**
   * Create indexes safely - only if they don't exist
   */
  private async createIndexesSafely(result: DatabaseSetupResult): Promise<void> {
    const indexes = [
      // Submissions indexes
      'CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_mobile_number ON submissions(mobile_number)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_aadhaar_number ON submissions(aadhaar_number)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_district ON submissions(district)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_taluka ON submissions(taluka)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_approved_by ON submissions(approved_by)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_approved_at ON submissions(approved_at)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_status_submitted_at ON submissions(status, submitted_at)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_district_taluka ON submissions(district, taluka)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_status_district ON submissions(status, district)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_filled_by_user_id ON submissions(filled_by_user_id)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_form_source ON submissions(form_source)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_filled_for_self ON submissions(filled_for_self)',
      
      // Users indexes
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
      'CREATE INDEX IF NOT EXISTS idx_users_district ON users(district)',
      'CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active)',
      
      // File attachments indexes
      'CREATE INDEX IF NOT EXISTS idx_file_attachments_submission_id ON file_attachments(submission_id)',
      'CREATE INDEX IF NOT EXISTS idx_file_attachments_field_name ON file_attachments(field_name)',
      
      // Audit logs indexes
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_at ON audit_logs(changed_at)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_by ON audit_logs(changed_by)'
    ]

    for (const indexSql of indexes) {
      try {
        await this.pool.query(indexSql)
        const indexName = indexSql.match(/idx_\w+/)?.[0]
        if (indexName) {
          result.indexesCreated.push(indexName)
        }
      } catch (error) {
        const errorMsg = `Failed to create index: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(`❌ ${errorMsg}`)
        result.errors.push(errorMsg)
      }
    }

    console.log(`✅ Created/verified ${result.indexesCreated.length} indexes`)
  }

  /**
   * Create triggers safely - only if they don't exist
   */
  private async createTriggersSafely(result: DatabaseSetupResult): Promise<void> {
    try {
      // Create trigger function
      await this.pool.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ language 'plpgsql'
      `)

      // Create triggers
      await this.pool.query(`
        DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
        CREATE TRIGGER update_submissions_updated_at
          BEFORE UPDATE ON submissions
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
      `)

      await this.pool.query(`
        DROP TRIGGER IF EXISTS update_users_updated_at ON users;
        CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
      `)

      console.log('✅ Created/verified database triggers')
    } catch (error) {
      const errorMsg = `Failed to create triggers: ${error instanceof Error ? error.message : 'Unknown error'}`
      console.error(`❌ ${errorMsg}`)
      result.errors.push(errorMsg)
    }
  }

  /**
   * Create functions safely - only if they don't exist
   */
  private async createFunctionsSafely(result: DatabaseSetupResult): Promise<void> {
    try {
      // Functions are created with triggers, so this is just verification
      const functions = await this.pool.query(`
        SELECT routine_name
        FROM information_schema.routines
        WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
      `)

      console.log(`✅ Verified ${functions.rows.length} database functions`)
    } catch (error) {
      const errorMsg = `Failed to verify functions: ${error instanceof Error ? error.message : 'Unknown error'}`
      console.error(`❌ ${errorMsg}`)
      result.errors.push(errorMsg)
    }
  }

  /**
   * Get database health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy'
    details: {
      connection: boolean
      tables: string[]
      missingTables: string[]
      totalSubmissions: number
      lastSubmission?: string
    }
  }> {
    try {
      // Test connection
      const client = await this.pool.connect()
      await client.query('SELECT 1')
      client.release()

      // Check tables
      const tables = await this.pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `)

      const existingTables = tables.rows.map(row => row.table_name)
      const expectedTables = ['users', 'submissions', 'file_attachments', 'audit_logs', 'statistics']
      const missingTables = expectedTables.filter(table => !existingTables.includes(table))

      // Get submission count
      let totalSubmissions = 0
      let lastSubmission = undefined

      if (existingTables.includes('submissions')) {
        const countResult = await this.pool.query('SELECT COUNT(*) as count FROM submissions')
        totalSubmissions = parseInt(countResult.rows[0].count)

        if (totalSubmissions > 0) {
          const lastResult = await this.pool.query(`
            SELECT id, submitted_at 
            FROM submissions 
            ORDER BY submitted_at DESC 
            LIMIT 1
          `)
          if (lastResult.rows.length > 0) {
            lastSubmission = lastResult.rows[0].submitted_at
          }
        }
      }

      return {
        status: missingTables.length === 0 ? 'healthy' : 'unhealthy',
        details: {
          connection: true,
          tables: existingTables,
          missingTables,
          totalSubmissions,
          lastSubmission
        }
      }
    } catch (error) {
      console.error('❌ Health check failed:', error)
      return {
        status: 'unhealthy',
        details: {
          connection: false,
          tables: [],
          missingTables: ['users', 'submissions', 'file_attachments', 'audit_logs', 'statistics'],
          totalSubmissions: 0
        }
      }
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
    }
  }
}

// Export singleton instance
export const databaseAutoSetup = new DatabaseAutoSetup()

