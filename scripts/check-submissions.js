#!/usr/bin/env node

/**
 * Check submissions in database
 * Usage: node scripts/check-submissions.js
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

async function checkSubmissions() {
  console.log('🔍 Checking submissions in database...')
  console.log('=====================================')
  
  const pool = new Pool(dbConfig)

  try {
    await pool.connect()
    console.log(`✅ Connected to database '${dbConfig.database}'`)

    // Get all submissions
    const result = await pool.query(`
      SELECT 
        id, 
        first_name, 
        surname, 
        mobile_number, 
        aadhaar_number, 
        status, 
        submitted_at,
        source
      FROM submissions 
      ORDER BY submitted_at DESC 
      LIMIT 20
    `)

    console.log(`\n📊 Found ${result.rows.length} submissions:`)
    console.log('=====================================')
    
    if (result.rows.length === 0) {
      console.log('No submissions found in database.')
    } else {
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ID: ${row.id}`)
        console.log(`   Name: ${row.first_name} ${row.surname}`)
        console.log(`   Mobile: ${row.mobile_number}`)
        console.log(`   Aadhaar: ${row.aadhaar_number}`)
        console.log(`   Status: ${row.status}`)
        console.log(`   Source: ${row.source}`)
        console.log(`   Submitted: ${new Date(row.submitted_at).toLocaleString()}`)
        console.log('   ---')
      })
    }

    // Check for duplicates
    const duplicates = await pool.query(`
      SELECT 
        mobile_number, 
        aadhaar_number, 
        COUNT(*) as count,
        array_agg(id) as submission_ids
      FROM submissions 
      WHERE status != 'deleted'
      GROUP BY mobile_number, aadhaar_number 
      HAVING COUNT(*) > 1
    `)

    if (duplicates.rows.length > 0) {
      console.log(`\n🚫 Found ${duplicates.rows.length} duplicate entries:`)
      console.log('=====================================')
      duplicates.rows.forEach((row, index) => {
        console.log(`${index + 1}. Mobile: ${row.mobile_number}, Aadhaar: ${row.aadhaar_number}`)
        console.log(`   Count: ${row.count}`)
        console.log(`   IDs: ${row.submission_ids.join(', ')}`)
        console.log('   ---')
      })
    } else {
      console.log('\n✅ No duplicate entries found.')
    }

    // Get statistics
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN source = 'public-web' THEN 1 END) as public_submissions
      FROM submissions
      WHERE status != 'deleted'
    `)

    const stat = stats.rows[0]
    console.log(`\n📈 Statistics:`)
    console.log('=====================================')
    console.log(`Total submissions: ${stat.total}`)
    console.log(`Pending: ${stat.pending}`)
    console.log(`Approved: ${stat.approved}`)
    console.log(`Rejected: ${stat.rejected}`)
    console.log(`Public submissions: ${stat.public_submissions}`)

  } catch (error) {
    console.error('❌ Error checking submissions:', error)
  } finally {
    await pool.end()
  }
}

// Add option to clear test data
if (process.argv.includes('--clear-test')) {
  console.log('🗑️  Clearing test submissions...')
  
  const pool = new Pool(dbConfig)
  
  pool.query(`
    DELETE FROM submissions 
    WHERE source = 'public-web' 
    AND submitted_at > NOW() - INTERVAL '1 hour'
  `)
  .then(() => {
    console.log('✅ Test submissions cleared.')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error clearing test data:', error)
    process.exit(1)
  })
} else {
  checkSubmissions()
}
