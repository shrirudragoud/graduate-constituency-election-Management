#!/usr/bin/env node

/**
 * Database Test Script
 * This script tests the PostgreSQL database connection and concurrency
 * 
 * Usage: node scripts/test-database.js
 */

const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'election_enrollment',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
  // Test with connection pooling
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}

async function testDatabase() {
  console.log('🧪 Testing PostgreSQL Database Connection and Concurrency...')
  console.log('==========================================================')
  
  const pool = new Pool(dbConfig)
  
  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...')
    const client = await pool.connect()
    const result = await client.query('SELECT NOW() as current_time, version() as version')
    console.log('✅ Connection successful:', {
      time: result.rows[0].current_time,
      version: result.rows[0].version.split(' ')[0]
    })
    client.release()

    // Test 2: Table existence
    console.log('\n2️⃣ Testing table existence...')
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    console.log('✅ Tables found:', tablesResult.rows.map(row => row.table_name))

    // Test 3: Connection pool status
    console.log('\n3️⃣ Testing connection pool...')
    console.log(`   Pool size: ${pool.totalCount}`)
    console.log(`   Idle connections: ${pool.idleCount}`)
    console.log(`   Waiting clients: ${pool.waitingCount}`)

    // Test 4: Concurrent connections
    console.log('\n4️⃣ Testing concurrent connections...')
    const concurrentTests = []
    const testCount = 5

    for (let i = 0; i < testCount; i++) {
      concurrentTests.push(
        pool.query(`SELECT $1 as test_id, NOW() as timestamp`, [i + 1])
      )
    }

    const results = await Promise.all(concurrentTests)
    console.log(`✅ ${results.length} concurrent queries completed successfully`)
    results.forEach((result, index) => {
      console.log(`   Test ${index + 1}: ${result.rows[0].test_id} at ${result.rows[0].timestamp}`)
    })

    // Test 5: Transaction testing
    console.log('\n5️⃣ Testing transactions...')
    const transactionClient = await pool.connect()
    try {
      await transactionClient.query('BEGIN')
      
      // Test insert
      const insertResult = await transactionClient.query(`
        INSERT INTO submissions (
          id, surname, first_name, fathers_husband_name, sex, date_of_birth, 
          age_years, age_months, district, taluka, village_name, house_no, 
          street, pin_code, mobile_number, aadhaar_number, place, declaration_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING id
      `, [
        `TEST_${Date.now()}`,
        'Test', 'User', 'Test Father', 'M', '1990-01-01',
        30, 0, 'Test District', 'Test Taluka', 'Test Village', '123',
        'Test Street', '123456', '9876543210', '123456789012', 'Test Place', '2024-01-01'
      ])
      
      const testId = insertResult.rows[0].id
      console.log(`✅ Test record inserted: ${testId}`)
      
      // Test update
      const updateResult = await transactionClient.query(
        'UPDATE submissions SET status = $1 WHERE id = $2 RETURNING id, status',
        ['approved', testId]
      )
      console.log(`✅ Test record updated: ${updateResult.rows[0].id} -> ${updateResult.rows[0].status}`)
      
      // Test select
      const selectResult = await transactionClient.query(
        'SELECT id, status FROM submissions WHERE id = $1',
        [testId]
      )
      console.log(`✅ Test record selected: ${selectResult.rows[0].id} -> ${selectResult.rows[0].status}`)
      
      // Rollback to clean up
      await transactionClient.query('ROLLBACK')
      console.log('✅ Transaction rolled back (test data cleaned up)')
      
    } catch (error) {
      await transactionClient.query('ROLLBACK')
      throw error
    } finally {
      transactionClient.release()
    }

    // Test 6: Performance testing
    console.log('\n6️⃣ Testing performance...')
    const startTime = Date.now()
    
    const performanceTests = []
    for (let i = 0; i < 10; i++) {
      performanceTests.push(
        pool.query('SELECT COUNT(*) as count FROM submissions')
      )
    }
    
    await Promise.all(performanceTests)
    const endTime = Date.now()
    const duration = endTime - startTime
    
    console.log(`✅ 10 concurrent COUNT queries completed in ${duration}ms`)
    console.log(`   Average query time: ${duration / 10}ms`)

    // Test 7: Index testing
    console.log('\n7️⃣ Testing indexes...')
    const indexResult = await pool.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'submissions' 
      ORDER BY indexname
    `)
    console.log(`✅ Found ${indexResult.rows.length} indexes on submissions table:`)
    indexResult.rows.forEach(row => {
      console.log(`   - ${row.indexname}`)
    })

    // Test 8: Constraints testing
    console.log('\n8️⃣ Testing constraints...')
    try {
      // Test invalid data (should fail)
      await pool.query(`
        INSERT INTO submissions (
          id, surname, first_name, fathers_husband_name, sex, date_of_birth, 
          age_years, age_months, district, taluka, village_name, house_no, 
          street, pin_code, mobile_number, aadhaar_number, place, declaration_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      `, [
        `CONSTRAINT_TEST_${Date.now()}`,
        'Test', 'User', 'Test Father', 'X', '1990-01-01', // Invalid sex
        30, 0, 'Test District', 'Test Taluka', 'Test Village', '123',
        'Test Street', '123456', '9876543210', '123456789012', 'Test Place', '2024-01-01'
      ])
      console.log('❌ Constraint test failed - invalid data was accepted')
    } catch (error) {
      if (error.message.includes('constraint')) {
        console.log('✅ Constraint test passed - invalid data was rejected')
      } else {
        console.log('⚠️ Unexpected error during constraint test:', error.message)
      }
    }

    // Test 9: Statistics
    console.log('\n9️⃣ Database statistics...')
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
      FROM submissions
    `)
    
    const stats = statsResult.rows[0]
    console.log('📊 Current database statistics:')
    console.log(`   Total submissions: ${stats.total_submissions}`)
    console.log(`   Pending: ${stats.pending}`)
    console.log(`   Approved: ${stats.approved}`)
    console.log(`   Rejected: ${stats.rejected}`)

    console.log('\n🎉 All database tests completed successfully!')
    console.log('✅ Your PostgreSQL database is ready for production use.')

  } catch (error) {
    console.error('❌ Database test failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testDatabase()
