import { query } from './database'

// Professional database schema with proper constraints and indexes
export async function createSchema() {
  console.log('🏗️ Creating professional database schema...')

  try {
    // Create users table
    await query(`
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
      );
    `)

    // Create submissions table with comprehensive fields
    await query(`
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
        date_of_birth DATE,
        age_years INTEGER CHECK (age_years >= 0 AND age_years <= 150),
        age_months INTEGER CHECK (age_months >= 0 AND age_months <= 11),
        
        -- Address Details
        district VARCHAR(255) NOT NULL,
        taluka VARCHAR(255) NOT NULL,
        village_name VARCHAR(255) NOT NULL,
        house_no VARCHAR(255) NOT NULL,
        street VARCHAR(255) NOT NULL,
        pin_code VARCHAR(10) CHECK (pin_code IS NULL OR pin_code ~ '^[0-9]{6}$'),
        
        -- Contact Details
        mobile_number VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        aadhaar_number VARCHAR(255) NOT NULL,
        
        -- Education Details
        year_of_passing VARCHAR(4),
        degree_diploma VARCHAR(255),
        name_of_university VARCHAR(255),
        name_of_diploma VARCHAR(255),
        
        -- Additional Information
        have_changed_name VARCHAR(5) CHECK (have_changed_name IN ('Yes', 'No')),
        place VARCHAR(255),
        declaration_date DATE,
        
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
        source VARCHAR(50) DEFAULT 'web'
      );
    `)

    // Create file attachments table
    await query(`
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
      );
    `)

    // Create audit log table
    await query(`
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
      );
    `)

    // Create statistics table for caching
    await query(`
      CREATE TABLE IF NOT EXISTS statistics (
        id SERIAL PRIMARY KEY,
        metric_name VARCHAR(255) UNIQUE NOT NULL,
        metric_value JSONB NOT NULL,
        calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE
      );
    `)

    console.log('✅ Database tables created successfully')
  } catch (error) {
    console.error('❌ Error creating database schema:', error)
    throw error
  }
}

// Create indexes for optimal performance
export async function createIndexes() {
  console.log('📊 Creating database indexes...')

  try {
    // Submissions table indexes
    await query(`
      CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
      CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at);
      CREATE INDEX IF NOT EXISTS idx_submissions_mobile_number ON submissions(mobile_number);
      CREATE INDEX IF NOT EXISTS idx_submissions_aadhaar_number ON submissions(aadhaar_number);
      CREATE INDEX IF NOT EXISTS idx_submissions_district ON submissions(district);
      CREATE INDEX IF NOT EXISTS idx_submissions_taluka ON submissions(taluka);
      CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_approved_by ON submissions(approved_by);
      CREATE INDEX IF NOT EXISTS idx_submissions_approved_at ON submissions(approved_at);
      
      -- Composite indexes for common queries
      CREATE INDEX IF NOT EXISTS idx_submissions_status_submitted_at ON submissions(status, submitted_at);
      CREATE INDEX IF NOT EXISTS idx_submissions_district_taluka ON submissions(district, taluka);
      CREATE INDEX IF NOT EXISTS idx_submissions_status_district ON submissions(status, district);
      
      -- Full-text search index
      CREATE INDEX IF NOT EXISTS idx_submissions_search ON submissions USING gin(
        to_tsvector('english', 
          surname || ' ' || first_name || ' ' || mobile_number || ' ' || aadhaar_number
        )
      );
    `)

    // Users table indexes
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_district ON users(district);
      CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
    `)

    // File attachments indexes
    await query(`
      CREATE INDEX IF NOT EXISTS idx_file_attachments_submission_id ON file_attachments(submission_id);
      CREATE INDEX IF NOT EXISTS idx_file_attachments_field_name ON file_attachments(field_name);
    `)

    // Audit logs indexes
    await query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_at ON audit_logs(changed_at);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_by ON audit_logs(changed_by);
    `)

    console.log('✅ Database indexes created successfully')
  } catch (error) {
    console.error('❌ Error creating database indexes:', error)
    throw error
  }
}

// Create triggers for automatic updates
export async function createTriggers() {
  console.log('⚡ Creating database triggers...')

  try {
    // Update timestamp trigger function
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `)

    // Apply triggers
    await query(`
      DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
      CREATE TRIGGER update_submissions_updated_at
        BEFORE UPDATE ON submissions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `)

    await query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `)

    console.log('✅ Database triggers created successfully')
  } catch (error) {
    console.error('❌ Error creating database triggers:', error)
    throw error
  }
}

// Migration function to fix PIN code constraint
async function migratePinCodeConstraint() {
  console.log('🔧 Checking PIN code constraint...')
  
  try {
    // Check if the old constraint exists
    const constraintCheck = await query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'submissions' 
      AND constraint_name = 'submissions_pin_code_check'
    `)
    
    if (constraintCheck.rows.length > 0) {
      console.log('📝 Found old PIN code constraint, updating...')
      
      // Update any empty string pin codes to NULL
      await query(`
        UPDATE submissions 
        SET pin_code = NULL 
        WHERE pin_code = '' OR LENGTH(TRIM(pin_code)) = 0
      `)
      
      // Drop the old constraint
      await query(`
        ALTER TABLE submissions 
        DROP CONSTRAINT submissions_pin_code_check
      `)
      
      // Add the new constraint that allows NULL or 6 digits
      await query(`
        ALTER TABLE submissions 
        ADD CONSTRAINT submissions_pin_code_check 
        CHECK (pin_code IS NULL OR pin_code ~ '^[0-9]{6}$')
      `)
      
      // Make the column nullable
      await query(`
        ALTER TABLE submissions 
        ALTER COLUMN pin_code DROP NOT NULL
      `)
      
      console.log('✅ PIN code constraint updated successfully!')
    } else {
      console.log('✅ PIN code constraint is already correct')
    }
  } catch (error) {
    console.log('⚠️ PIN code constraint migration skipped (table may not exist yet):', error.message)
  }
}

// Initialize complete database schema
export async function initializeDatabase() {
  console.log('🚀 Initializing professional database...')
  
  try {
    await createSchema()
    await createIndexes()
    await createTriggers()
    await migratePinCodeConstraint()
    
    console.log('🎉 Database initialization completed successfully!')
    return true
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    return false
  }
}
