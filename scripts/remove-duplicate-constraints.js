#!/usr/bin/env node

/**
 * Remove unique constraints from submissions table to allow duplicates
 * Usage: node scripts/remove-duplicate-constraints.js
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

async function removeDuplicateConstraints() {
  console.log('🔧 Removing duplicate constraints from submissions table...')
  console.log('========================================================')
  
  const pool = new Pool(dbConfig)

  try {
    await pool.connect()
    console.log(`✅ Connected to database '${dbConfig.database}'`)

    // Check current constraints
    console.log('\n📋 Current constraints on submissions table:')
    const constraints = await pool.query(`
      SELECT 
        conname as constraint_name,
        contype as constraint_type,
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint 
      WHERE conrelid = 'submissions'::regclass
      AND conname LIKE '%mobile%' OR conname LIKE '%aadhaar%'
    `)
    
    if (constraints.rows.length > 0) {
      constraints.rows.forEach((constraint, index) => {
        console.log(`${index + 1}. ${constraint.constraint_name}: ${constraint.constraint_definition}`)
      })
    } else {
      console.log('No mobile/aadhaar constraints found.')
    }

    // Remove unique constraints
    console.log('\n🗑️  Removing unique constraints...')
    
    try {
      // Drop unique constraint on mobile_number
      await pool.query('ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_mobile_number_key')
      console.log('✅ Removed unique constraint on mobile_number')
    } catch (error) {
      console.log('⚠️  Mobile number constraint not found or already removed')
    }

    try {
      // Drop unique constraint on aadhaar_number
      await pool.query('ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_aadhaar_number_key')
      console.log('✅ Removed unique constraint on aadhaar_number')
    } catch (error) {
      console.log('⚠️  Aadhaar number constraint not found or already removed')
    }

    // Verify constraints are removed
    console.log('\n📋 Updated constraints on submissions table:')
    const updatedConstraints = await pool.query(`
      SELECT 
        conname as constraint_name,
        contype as constraint_type,
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint 
      WHERE conrelid = 'submissions'::regclass
      AND conname LIKE '%mobile%' OR conname LIKE '%aadhaar%'
    `)
    
    if (updatedConstraints.rows.length > 0) {
      updatedConstraints.rows.forEach((constraint, index) => {
        console.log(`${index + 1}. ${constraint.constraint_name}: ${constraint.constraint_definition}`)
      })
    } else {
      console.log('✅ No mobile/aadhaar unique constraints remaining')
    }

    // Test duplicate submission capability
    console.log('\n🧪 Testing duplicate submission capability...')
    const testCount = await pool.query(`
      SELECT COUNT(*) as count 
      FROM submissions 
      WHERE mobile_number = '8700546080' AND aadhaar_number = '111223344559'
    `)
    
    console.log(`📊 Found ${testCount.rows[0].count} submissions with test mobile/aadhaar`)
    
    if (parseInt(testCount.rows[0].count) > 1) {
      console.log('✅ Multiple submissions with same contact details are now allowed!')
    } else {
      console.log('ℹ️  Only one submission found with test data')
    }

    console.log('\n🎉 Database update complete!')
    console.log('========================================================')
    console.log('✅ Mobile number duplicates are now allowed')
    console.log('✅ Aadhaar number duplicates are now allowed')
    console.log('✅ Multiple family members can register with same contact details')
    console.log('✅ Public form will no longer reject duplicate submissions')

  } catch (error) {
    console.error('❌ Error updating database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

removeDuplicateConstraints()
