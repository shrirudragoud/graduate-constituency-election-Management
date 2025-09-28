#!/usr/bin/env node

/**
 * Database Setup Script for Ubuntu VPS
 * Run this script to initialize the PostgreSQL database with proper concurrency support
 * 
 * Usage: node scripts/setup-database.js
 */

const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'election_enrollment',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
}

async function setupDatabase() {
  console.log('🚀 Setting up PostgreSQL database for high concurrency...')
  console.log('=======================================================')
  
  // First, connect to postgres database to create our database
  const adminPool = new Pool({
    ...dbConfig,
    database: 'postgres'
  })

  try {
    // Create database if it doesn't exist
    await adminPool.query(`CREATE DATABASE ${dbConfig.database}`)
    console.log(`✅ Database '${dbConfig.database}' created successfully (if it didn't exist)`)
  } catch (error) {
    if (error.code === '42P04') { // Database already exists
      console.log(`⚠️ Database '${dbConfig.database}' already exists. Skipping creation.`)
    } else {
      console.error('❌ Error creating database:', error)
      process.exit(1)
    }
  } finally {
    await adminPool.end()
  }

  // Now connect to our specific database to create tables
  const appPool = new Pool(dbConfig)

  try {
    await appPool.connect()
    console.log(`✅ Connected to database '${dbConfig.database}'`)

    // Create users table with proper constraints
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'volunteer',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT valid_role CHECK (role IN ('volunteer', 'manager', 'admin'))
      );
    `)
    console.log('✅ Users table created')

    // Create submissions table with comprehensive constraints and indexes
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
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
        CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'deleted')),
        CONSTRAINT valid_age_years CHECK (age_years >= 0 AND age_years <= 150),
        CONSTRAINT valid_age_months CHECK (age_months >= 0 AND age_months <= 11),
        CONSTRAINT valid_pin_code CHECK (pin_code ~ '^[0-9]{6}$'),
        CONSTRAINT valid_mobile_number CHECK (mobile_number ~ '^[0-9]{10}$'),
        CONSTRAINT valid_aadhaar_number CHECK (aadhaar_number ~ '^[0-9]{12}$'),
        CONSTRAINT valid_email CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
      );
    `)
    console.log('✅ Submissions table created')

    // Create files table for file attachments
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        submission_id VARCHAR(255) REFERENCES submissions(id) ON DELETE CASCADE,
        field_name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        saved_as VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_size INTEGER NOT NULL,
        file_type VARCHAR(255),
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 10485760) -- 10MB max
      );
    `)
    console.log('✅ Files table created')

    // Create audit log table for tracking changes
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        table_name VARCHAR(255) NOT NULL,
        record_id VARCHAR(255) NOT NULL,
        action VARCHAR(50) NOT NULL,
        old_values JSONB,
        new_values JSONB,
        user_id INTEGER REFERENCES users(id),
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT valid_action CHECK (action IN ('INSERT', 'UPDATE', 'DELETE'))
      );
    `)
    console.log('✅ Audit logs table created')

    // Create indexes for better performance and concurrency
    console.log('📊 Creating indexes for optimal performance...')
    
    const indexes = [
      // Submissions indexes
      'CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_mobile_number ON submissions(mobile_number)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_aadhaar_number ON submissions(aadhaar_number)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_district ON submissions(district)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_taluka ON submissions(taluka)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_status_submitted_at ON submissions(status, submitted_at)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_district_taluka ON submissions(district, taluka)',
      
      // Users indexes
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
      'CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active)',
      
      // Files indexes
      'CREATE INDEX IF NOT EXISTS idx_files_submission_id ON files(submission_id)',
      'CREATE INDEX IF NOT EXISTS idx_files_field_name ON files(field_name)',
      
      // Audit logs indexes
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)'
    ]

    for (const indexQuery of indexes) {
      await appPool.query(indexQuery)
    }
    console.log('✅ All indexes created')

    // Create unique constraints to prevent duplicates
    console.log('🔒 Creating unique constraints...')
    
    const constraints = [
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions_mobile_unique ON submissions(mobile_number) WHERE status != \'deleted\'',
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions_aadhaar_unique ON submissions(aadhaar_number) WHERE status != \'deleted\''
    ]

    for (const constraintQuery of constraints) {
      await appPool.query(constraintQuery)
    }
    console.log('✅ Unique constraints created')

    // Create functions for automatic timestamp updates
    console.log('⚙️ Creating database functions...')
    
    await appPool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `)

    // Create triggers for automatic timestamp updates
    const triggers = [
      'CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      'CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()'
    ]

    for (const triggerQuery of triggers) {
      await appPool.query(triggerQuery)
    }
    console.log('✅ Triggers created')

    // Insert default admin user
    console.log('👤 Creating default admin user...')
    
    try {
      await appPool.query(`
        INSERT INTO users (email, password, role, is_active) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
      `, [
        'admin@bjp.org',
        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
        'admin',
        true
      ])
      console.log('✅ Default admin user created (email: admin@bjp.org, password: password)')
    } catch (error) {
      console.log('⚠️ Default admin user already exists or could not be created')
    }

    // Test the setup
    console.log('🧪 Testing database setup...')
    
    const testResult = await appPool.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = \'public\'')
    const tableCount = testResult.rows[0].table_count
    
    console.log(`✅ Database setup complete! Created ${tableCount} tables.`)
    console.log('')
    console.log('📋 Database Configuration:')
    console.log(`   Host: ${dbConfig.host}`)
    console.log(`   Port: ${dbConfig.port}`)
    console.log(`   Database: ${dbConfig.database}`)
    console.log(`   User: ${dbConfig.user}`)
    console.log('')
    console.log('🔧 Next steps:')
    console.log('   1. Update .env.local with your database credentials')
    console.log('   2. Run: npm run db:migrate (to migrate existing JSON data)')
    console.log('   3. Start your application: npm run dev')
    console.log('')
    console.log('🚀 Your database is ready for high-concurrency operations!')

  } catch (error) {
    console.error('❌ Error setting up tables:', error)
    process.exit(1)
  } finally {
    await appPool.end()
  }
}

setupDatabase()
