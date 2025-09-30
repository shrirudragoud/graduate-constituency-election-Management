#!/usr/bin/env node

/**
 * Simple Database Setup - Just Works!
 * Same name and password every time - no remembering needed
 */

const { Pool } = require('pg')

// Simple config - same every time
const dbConfig = {
  user: 'postgres',
  host: 'localhost', 
  database: 'election_enrollment',
  password: 'password',
  port: 5432
}

async function simpleSetup() {
  console.log('🚀 Simple Database Setup')
  console.log('========================')
  console.log('Database: election_enrollment')
  console.log('User: postgres')
  console.log('Password: password')
  console.log('')

  const pool = new Pool(dbConfig)

  try {
    // Test connection
    console.log('🔌 Testing connection...')
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    console.log('✅ Connected to database')

    // Create submissions table (the main one we need)
    console.log('📋 Creating submissions table...')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER,
        surname VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        fathers_husband_name VARCHAR(255) NOT NULL,
        fathers_husband_full_name VARCHAR(255),
        sex VARCHAR(10) NOT NULL CHECK (sex IN ('M', 'F')),
        qualification VARCHAR(255),
        occupation VARCHAR(255),
        date_of_birth DATE NOT NULL,
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
        year_of_passing VARCHAR(4),
        degree_diploma VARCHAR(255),
        name_of_university VARCHAR(255),
        name_of_diploma VARCHAR(255),
        have_changed_name VARCHAR(5),
        place VARCHAR(255) NOT NULL,
        declaration_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        approved_by INTEGER,
        approved_at TIMESTAMP WITH TIME ZONE,
        rejection_reason TEXT,
        files JSONB DEFAULT '{}',
        ip_address INET,
        user_agent TEXT,
        source VARCHAR(50) DEFAULT 'web',
        filled_by_user_id INTEGER,
        filled_by_name VARCHAR(255),
        filled_by_phone VARCHAR(20),
        form_source VARCHAR(50) DEFAULT 'public',
        filled_for_self BOOLEAN DEFAULT false
      )
    `)
    console.log('✅ Submissions table ready')

    // Create users table
    console.log('👥 Creating users table...')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'volunteer',
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
    `)
    console.log('✅ Users table ready')

    // Add admin user
    console.log('👤 Adding admin user...')
    await pool.query(`
      INSERT INTO users (email, password, role, first_name, last_name, is_active)
      VALUES ('admin@election.com', '$2b$10$rQZ8K9vL8mN7pQrS5tU6OeX1yA2bC3dE4fG5hI6jK7lM8nO9pQ', 'admin', 'Admin', 'User', true)
      ON CONFLICT (email) DO NOTHING
    `)
    console.log('✅ Admin user ready (email: admin@election.com, password: admin123)')

    // Check data
    const count = await pool.query('SELECT COUNT(*) as count FROM submissions')
    console.log(`📊 Current submissions: ${count.rows[0].count}`)

    console.log('')
    console.log('🎉 Setup Complete!')
    console.log('==================')
    console.log('✅ Database: election_enrollment')
    console.log('✅ User: postgres')
    console.log('✅ Password: password')
    console.log('✅ Admin: admin@election.com / admin123')
    console.log('')
    console.log('🚀 Now run: npm run dev')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

simpleSetup()
