#!/usr/bin/env node

/**
 * Database Reset Script
 * Resets the database by dropping and recreating all tables
 * WARNING: This will delete all data!
 * 
 * Usage: node scripts/reset-database.js
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

async function resetDatabase() {
  console.log('⚠️ WARNING: This will delete ALL data in the database!')
  console.log('====================================================')
  
  // Ask for confirmation
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const answer = await new Promise((resolve) => {
    rl.question('Are you sure you want to reset the database? Type "yes" to confirm: ', resolve)
  })
  
  rl.close()

  if (answer.toLowerCase() !== 'yes') {
    console.log('❌ Database reset cancelled.')
    process.exit(0)
  }

  console.log('🔄 Resetting database...')
  
  const pool = new Pool(dbConfig)
  
  try {
    await pool.connect()
    console.log(`✅ Connected to database '${dbConfig.database}'`)

    // Drop all tables in correct order (respecting foreign key constraints)
    const tables = [
      'audit_logs',
      'file_attachments', 
      'statistics',
      'submissions',
      'users'
    ]

    for (const table of tables) {
      try {
        await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`)
        console.log(`✅ Dropped table: ${table}`)
      } catch (error) {
        console.log(`⚠️ Could not drop table ${table}:`, error.message)
      }
    }

    // Drop functions
    try {
      await pool.query('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE')
      console.log('✅ Dropped trigger function')
    } catch (error) {
      console.log('⚠️ Could not drop trigger function:', error.message)
    }

    console.log('')
    console.log('🎉 Database reset complete!')
    console.log('')
    console.log('🔧 Next steps:')
    console.log('  1. Run: npm run db:setup')
    console.log('  2. Run: npm run db:migrate (if you have JSON data)')
    console.log('  3. Run: npm run dev')

  } catch (error) {
    console.error('❌ Error resetting database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

resetDatabase()
