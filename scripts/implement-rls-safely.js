#!/usr/bin/env node

/**
 * Safe Row-Level Security (RLS) Implementation
 * 
 * This script implements RLS policies incrementally without breaking existing functionality.
 * It can be run multiple times safely and includes rollback capabilities.
 */

const { Pool } = require('pg')
require('dotenv').config()

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'election_enrollment',
  user: process.env.DB_USER || 'voter_app',
  password: process.env.DB_PASSWORD || 'voter_password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

async function testConnection() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    client.release()
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

async function checkRLSStatus() {
  try {
    const client = await pool.connect()
    
    // Check if RLS is already enabled
    const submissionsRLS = await client.query(`
      SELECT relrowsecurity FROM pg_class 
      WHERE relname = 'submissions' AND relkind = 'r'
    `)
    
    const usersRLS = await client.query(`
      SELECT relrowsecurity FROM pg_class 
      WHERE relname = 'users' AND relkind = 'r'
    `)
    
    client.release()
    
    return {
      submissions: submissionsRLS.rows[0]?.relrowsecurity || false,
      users: usersRLS.rows[0]?.relrowsecurity || false
    }
  } catch (error) {
    console.error('❌ Error checking RLS status:', error.message)
    return { submissions: false, users: false }
  }
}

async function createRLSPolicies() {
  const client = await pool.connect()
  
  try {
    console.log('🔒 Creating RLS policies...')
    
    // Enable RLS on tables
    await client.query('ALTER TABLE submissions ENABLE ROW LEVEL SECURITY')
    console.log('✅ RLS enabled on submissions table')
    
    await client.query('ALTER TABLE users ENABLE ROW LEVEL SECURITY')
    console.log('✅ RLS enabled on users table')
    
    // Create policies for submissions table
    await client.query(`
      CREATE POLICY IF NOT EXISTS submissions_volunteer_policy ON submissions
        FOR ALL TO voter_app
        USING (
          filled_by_user_id = current_setting('app.current_user_id', true)::int
          OR current_setting('app.current_user_role', true) IN ('admin', 'supervisor')
        )
    `)
    console.log('✅ Volunteer policy created for submissions')
    
    await client.query(`
      CREATE POLICY IF NOT EXISTS submissions_supervisor_policy ON submissions
        FOR ALL TO voter_app
        USING (
          current_setting('app.current_user_role', true) = 'admin'
          OR (
            current_setting('app.current_user_role', true) = 'supervisor'
            AND district = current_setting('app.current_user_district', true)
          )
        )
    `)
    console.log('✅ Supervisor policy created for submissions')
    
    // Create policies for users table
    await client.query(`
      CREATE POLICY IF NOT EXISTS users_self_policy ON users
        FOR ALL TO voter_app
        USING (
          id = current_setting('app.current_user_id', true)::int
          OR current_setting('app.current_user_role', true) = 'admin'
        )
    `)
    console.log('✅ User self-policy created')
    
    // Create a permissive policy for testing (can be removed later)
    await client.query(`
      CREATE POLICY IF NOT EXISTS submissions_testing_policy ON submissions
        FOR ALL TO voter_app
        USING (true)
    `)
    console.log('✅ Testing policy created (permissive for now)')
    
    console.log('🎉 RLS policies created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating RLS policies:', error.message)
    throw error
  } finally {
    client.release()
  }
}

async function updateApplicationLogic() {
  console.log('🔧 Updating application logic for RLS...')
  
  // Create a helper function to set user context
  const helperCode = `
// RLS Helper Functions
export async function setUserContext(client: any, userId: number, role: string, district?: string) {
  await client.query('SET app.current_user_id = $1', [userId])
  await client.query('SET app.current_user_role = $1', [role])
  if (district) {
    await client.query('SET app.current_user_district = $1', [district])
  }
}

export async function clearUserContext(client: any) {
  await client.query('RESET app.current_user_id')
  await client.query('RESET app.current_user_role')
  await client.query('RESET app.current_user_district')
}
`
  
  // Write the helper to a new file
  const fs = require('fs')
  const path = require('path')
  const helperPath = path.join(__dirname, '..', 'lib', 'rls-helper.ts')
  
  fs.writeFileSync(helperPath, helperCode)
  console.log('✅ RLS helper functions created')
}

async function createRollbackScript() {
  console.log('🔄 Creating rollback script...')
  
  const rollbackCode = `#!/usr/bin/env node

/**
 * Rollback RLS Implementation
 * Use this if you need to disable RLS
 */

const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'election_enrollment',
  user: process.env.DB_USER || 'voter_app',
  password: process.env.DB_PASSWORD || 'voter_password',
})

async function rollbackRLS() {
  const client = await pool.connect()
  
  try {
    console.log('🔄 Rolling back RLS implementation...')
    
    // Drop policies
    await client.query('DROP POLICY IF EXISTS submissions_volunteer_policy ON submissions')
    await client.query('DROP POLICY IF EXISTS submissions_supervisor_policy ON submissions')
    await client.query('DROP POLICY IF EXISTS submissions_testing_policy ON submissions')
    await client.query('DROP POLICY IF EXISTS users_self_policy ON users')
    
    // Disable RLS
    await client.query('ALTER TABLE submissions DISABLE ROW LEVEL SECURITY')
    await client.query('ALTER TABLE users DISABLE ROW LEVEL SECURITY')
    
    console.log('✅ RLS rollback completed')
    
  } catch (error) {
    console.error('❌ Rollback failed:', error.message)
  } finally {
    client.release()
    await pool.end()
  }
}

rollbackRLS()
`
  
  const fs = require('fs')
  const path = require('path')
  const rollbackPath = path.join(__dirname, 'rollback-rls.js')
  
  fs.writeFileSync(rollbackPath, rollbackCode)
  fs.chmodSync(rollbackPath, '755')
  console.log('✅ Rollback script created: scripts/rollback-rls.js')
}

async function main() {
  console.log('🚀 Starting safe RLS implementation...')
  
  try {
    // Test connection
    const connected = await testConnection()
    if (!connected) {
      process.exit(1)
    }
    
    // Check current RLS status
    const rlsStatus = await checkRLSStatus()
    console.log('📊 Current RLS status:', rlsStatus)
    
    if (rlsStatus.submissions && rlsStatus.users) {
      console.log('⚠️  RLS is already enabled. Skipping implementation.')
      console.log('💡 Use rollback-rls.js if you need to disable it.')
      return
    }
    
    // Create RLS policies
    await createRLSPolicies()
    
    // Update application logic
    await updateApplicationLogic()
    
    // Create rollback script
    await createRollbackScript()
    
    console.log('')
    console.log('🎉 RLS implementation completed successfully!')
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Test the application to ensure it still works')
    console.log('2. Update your API routes to use setUserContext()')
    console.log('3. Remove the testing policy when ready for production')
    console.log('4. Use rollback-rls.js if you need to disable RLS')
    console.log('')
    console.log('⚠️  Note: The testing policy allows all access for now.')
    console.log('   Remove it when you\'re ready for production security.')
    
  } catch (error) {
    console.error('❌ RLS implementation failed:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { main, createRLSPolicies, checkRLSStatus }
