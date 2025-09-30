#!/usr/bin/env node

/**
 * Comprehensive Database Setup Check Script
 * Verifies database connection, schema, tables, indexes, and constraints
 * 
 * Usage: node scripts/check-database-setup.js
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

// Expected tables and their required columns
const expectedTables = {
  users: [
    'id', 'email', 'password', 'role', 'first_name', 'last_name', 
    'phone', 'district', 'taluka', 'is_active', 'last_login', 
    'created_at', 'updated_at'
  ],
  submissions: [
    'id', 'user_id', 'surname', 'first_name', 'fathers_husband_name', 
    'fathers_husband_full_name', 'sex', 'qualification', 'occupation', 
    'date_of_birth', 'age_years', 'age_months', 'district', 'taluka', 
    'village_name', 'house_no', 'street', 'pin_code', 'mobile_number', 
    'email', 'aadhaar_number', 'year_of_passing', 'degree_diploma', 
    'name_of_university', 'name_of_diploma', 'have_changed_name', 
    'place', 'declaration_date', 'status', 'submitted_at', 'updated_at', 
    'approved_by', 'approved_at', 'rejection_reason', 'files', 
    'ip_address', 'user_agent', 'source', 'filled_by_user_id', 
    'filled_by_name', 'filled_by_phone', 'form_source', 'filled_for_self'
  ],
  file_attachments: [
    'id', 'submission_id', 'field_name', 'original_name', 'file_path', 
    'file_size', 'file_type', 'mime_type', 'uploaded_at', 'uploaded_by'
  ],
  audit_logs: [
    'id', 'table_name', 'record_id', 'action', 'old_values', 'new_values', 
    'changed_by', 'changed_at', 'ip_address', 'user_agent'
  ],
  statistics: [
    'id', 'metric_name', 'metric_value', 'calculated_at', 'expires_at'
  ]
}

// Expected indexes
const expectedIndexes = [
  'idx_submissions_status',
  'idx_submissions_submitted_at',
  'idx_submissions_mobile_number',
  'idx_submissions_aadhaar_number',
  'idx_submissions_district',
  'idx_submissions_taluka',
  'idx_submissions_user_id',
  'idx_submissions_approved_by',
  'idx_submissions_approved_at',
  'idx_submissions_status_submitted_at',
  'idx_submissions_district_taluka',
  'idx_submissions_status_district',
  'idx_submissions_filled_by_user_id',
  'idx_submissions_form_source',
  'idx_submissions_filled_for_self',
  'idx_submissions_search',
  'idx_users_email',
  'idx_users_role',
  'idx_users_district',
  'idx_users_is_active',
  'idx_file_attachments_submission_id',
  'idx_file_attachments_field_name',
  'idx_audit_logs_table_record',
  'idx_audit_logs_changed_at',
  'idx_audit_logs_changed_by'
]

// Expected triggers
const expectedTriggers = [
  'update_submissions_updated_at',
  'update_users_updated_at'
]

// Expected functions
const expectedFunctions = [
  'update_updated_at_column'
]

class DatabaseSetupChecker {
  constructor() {
    this.pool = null
    this.results = {
      connection: false,
      database: false,
      tables: {},
      indexes: {},
      triggers: {},
      functions: {},
      constraints: {},
      data: {},
      overall: false
    }
  }

  async checkAll() {
    console.log('🔍 Comprehensive Database Setup Check')
    console.log('=====================================')
    console.log('')

    try {
      // 1. Test connection
      await this.checkConnection()
      
      // 2. Check database exists
      await this.checkDatabase()
      
      // 3. Check tables
      await this.checkTables()
      
      // 4. Check indexes
      await this.checkIndexes()
      
      // 5. Check triggers
      await this.checkTriggers()
      
      // 6. Check functions
      await this.checkFunctions()
      
      // 7. Check constraints
      await this.checkConstraints()
      
      // 8. Check sample data
      await this.checkSampleData()
      
      // 9. Overall assessment
      this.assessOverall()
      
      // 10. Generate report
      this.generateReport()
      
    } catch (error) {
      console.error('❌ Database check failed:', error.message)
      this.results.overall = false
    } finally {
      if (this.pool) {
        await this.pool.end()
      }
    }
  }

  async checkConnection() {
    console.log('🔌 Checking database connection...')
    
    try {
      this.pool = new Pool(dbConfig)
      const client = await this.pool.connect()
      
      const result = await client.query('SELECT NOW() as current_time, version() as version')
      console.log('✅ Database connection successful')
      console.log(`   Time: ${result.rows[0].current_time}`)
      console.log(`   Version: ${result.rows[0].version.split(' ')[0]}`)
      
      this.results.connection = true
      client.release()
    } catch (error) {
      console.error('❌ Database connection failed:', error.message)
      this.results.connection = false
      throw error
    }
  }

  async checkDatabase() {
    console.log('📊 Checking database existence...')
    
    try {
      const result = await this.pool.query(
        "SELECT datname FROM pg_database WHERE datname = $1",
        [dbConfig.database]
      )
      
      if (result.rows.length > 0) {
        console.log(`✅ Database '${dbConfig.database}' exists`)
        this.results.database = true
      } else {
        console.log(`❌ Database '${dbConfig.database}' does not exist`)
        this.results.database = false
      }
    } catch (error) {
      console.error('❌ Database check failed:', error.message)
      this.results.database = false
    }
  }

  async checkTables() {
    console.log('📋 Checking database tables...')
    
    for (const [tableName, expectedColumns] of Object.entries(expectedTables)) {
      try {
        // Check if table exists
        const tableExists = await this.pool.query(
          "SELECT table_name FROM information_schema.tables WHERE table_name = $1",
          [tableName]
        )
        
        if (tableExists.rows.length === 0) {
          console.log(`❌ Table '${tableName}' does not exist`)
          this.results.tables[tableName] = { exists: false, columns: [] }
          continue
        }
        
        // Check columns
        const columns = await this.pool.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position
        `, [tableName])
        
        const existingColumns = columns.rows.map(row => row.column_name)
        const missingColumns = expectedColumns.filter(col => !existingColumns.includes(col))
        const extraColumns = existingColumns.filter(col => !expectedColumns.includes(col))
        
        if (missingColumns.length === 0) {
          console.log(`✅ Table '${tableName}' exists with all required columns`)
          this.results.tables[tableName] = { 
            exists: true, 
            columns: existingColumns,
            missingColumns: [],
            extraColumns: extraColumns
          }
        } else {
          console.log(`⚠️ Table '${tableName}' exists but missing columns: ${missingColumns.join(', ')}`)
          this.results.tables[tableName] = { 
            exists: true, 
            columns: existingColumns,
            missingColumns: missingColumns,
            extraColumns: extraColumns
          }
        }
        
      } catch (error) {
        console.error(`❌ Error checking table '${tableName}':`, error.message)
        this.results.tables[tableName] = { exists: false, error: error.message }
      }
    }
  }

  async checkIndexes() {
    console.log('📊 Checking database indexes...')
    
    try {
      const indexes = await this.pool.query(`
        SELECT indexname, tablename 
        FROM pg_indexes 
        WHERE schemaname = 'public'
        ORDER BY tablename, indexname
      `)
      
      const existingIndexes = indexes.rows.map(row => row.indexname)
      
      for (const expectedIndex of expectedIndexes) {
        if (existingIndexes.includes(expectedIndex)) {
          console.log(`✅ Index '${expectedIndex}' exists`)
          this.results.indexes[expectedIndex] = true
        } else {
          console.log(`❌ Index '${expectedIndex}' missing`)
          this.results.indexes[expectedIndex] = false
        }
      }
      
      // Check for extra indexes
      const extraIndexes = existingIndexes.filter(idx => !expectedIndexes.includes(idx))
      if (extraIndexes.length > 0) {
        console.log(`ℹ️ Extra indexes found: ${extraIndexes.join(', ')}`)
      }
      
    } catch (error) {
      console.error('❌ Error checking indexes:', error.message)
    }
  }

  async checkTriggers() {
    console.log('⚡ Checking database triggers...')
    
    try {
      const triggers = await this.pool.query(`
        SELECT trigger_name, event_object_table
        FROM information_schema.triggers
        WHERE trigger_schema = 'public'
        ORDER BY event_object_table, trigger_name
      `)
      
      const existingTriggers = triggers.rows.map(row => row.trigger_name)
      
      for (const expectedTrigger of expectedTriggers) {
        if (existingTriggers.includes(expectedTrigger)) {
          console.log(`✅ Trigger '${expectedTrigger}' exists`)
          this.results.triggers[expectedTrigger] = true
        } else {
          console.log(`❌ Trigger '${expectedTrigger}' missing`)
          this.results.triggers[expectedTrigger] = false
        }
      }
      
    } catch (error) {
      console.error('❌ Error checking triggers:', error.message)
    }
  }

  async checkFunctions() {
    console.log('🔧 Checking database functions...')
    
    try {
      const functions = await this.pool.query(`
        SELECT routine_name
        FROM information_schema.routines
        WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
        ORDER BY routine_name
      `)
      
      const existingFunctions = functions.rows.map(row => row.routine_name)
      
      for (const expectedFunction of expectedFunctions) {
        if (existingFunctions.includes(expectedFunction)) {
          console.log(`✅ Function '${expectedFunction}' exists`)
          this.results.functions[expectedFunction] = true
        } else {
          console.log(`❌ Function '${expectedFunction}' missing`)
          this.results.functions[expectedFunction] = false
        }
      }
      
    } catch (error) {
      console.error('❌ Error checking functions:', error.message)
    }
  }

  async checkConstraints() {
    console.log('🔒 Checking database constraints...')
    
    try {
      const constraints = await this.pool.query(`
        SELECT 
          tc.table_name,
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public'
        ORDER BY tc.table_name, tc.constraint_type
      `)
      
      const constraintsByTable = {}
      constraints.rows.forEach(row => {
        if (!constraintsByTable[row.table_name]) {
          constraintsByTable[row.table_name] = []
        }
        constraintsByTable[row.table_name].push({
          name: row.constraint_name,
          type: row.constraint_type,
          column: row.column_name
        })
      })
      
      for (const [tableName, tableConstraints] of Object.entries(constraintsByTable)) {
        const primaryKeys = tableConstraints.filter(c => c.type === 'PRIMARY KEY')
        const uniqueConstraints = tableConstraints.filter(c => c.type === 'UNIQUE')
        const checkConstraints = tableConstraints.filter(c => c.type === 'CHECK')
        const foreignKeys = tableConstraints.filter(c => c.type === 'FOREIGN KEY')
        
        console.log(`📋 Table '${tableName}' constraints:`)
        console.log(`   Primary Keys: ${primaryKeys.length}`)
        console.log(`   Unique Constraints: ${uniqueConstraints.length}`)
        console.log(`   Check Constraints: ${checkConstraints.length}`)
        console.log(`   Foreign Keys: ${foreignKeys.length}`)
        
        this.results.constraints[tableName] = {
          primaryKeys: primaryKeys.length,
          uniqueConstraints: uniqueConstraints.length,
          checkConstraints: checkConstraints.length,
          foreignKeys: foreignKeys.length
        }
      }
      
    } catch (error) {
      console.error('❌ Error checking constraints:', error.message)
    }
  }

  async checkSampleData() {
    console.log('📊 Checking sample data...')
    
    try {
      // Check if admin user exists
      const adminUser = await this.pool.query(
        "SELECT id, email, role FROM users WHERE email = 'admin@election.com'"
      )
      
      if (adminUser.rows.length > 0) {
        console.log('✅ Default admin user exists')
        this.results.data.adminUser = true
      } else {
        console.log('❌ Default admin user missing')
        this.results.data.adminUser = false
      }
      
      // Check submissions count
      const submissionsCount = await this.pool.query("SELECT COUNT(*) as count FROM submissions")
      const count = parseInt(submissionsCount.rows[0].count)
      console.log(`📊 Total submissions: ${count}`)
      this.results.data.submissionsCount = count
      
      // Check recent submissions
      const recentSubmissions = await this.pool.query(`
        SELECT id, first_name, surname, submitted_at 
        FROM submissions 
        ORDER BY submitted_at DESC 
        LIMIT 5
      `)
      
      if (recentSubmissions.rows.length > 0) {
        console.log('📋 Recent submissions:')
        recentSubmissions.rows.forEach(row => {
          console.log(`   ${row.id}: ${row.first_name} ${row.surname} (${row.submitted_at})`)
        })
      }
      
    } catch (error) {
      console.error('❌ Error checking sample data:', error.message)
    }
  }

  assessOverall() {
    console.log('🎯 Overall Assessment...')
    
    const allTablesExist = Object.values(this.results.tables).every(table => table.exists)
    const allIndexesExist = Object.values(this.results.indexes).every(exists => exists)
    const allTriggersExist = Object.values(this.results.triggers).every(exists => exists)
    const allFunctionsExist = Object.values(this.results.functions).every(exists => exists)
    
    this.results.overall = this.results.connection && 
                          this.results.database && 
                          allTablesExist && 
                          allIndexesExist && 
                          allTriggersExist && 
                          allFunctionsExist
    
    if (this.results.overall) {
      console.log('🎉 Database setup is COMPLETE and ready for use!')
    } else {
      console.log('⚠️ Database setup is INCOMPLETE - some components are missing')
    }
  }

  generateReport() {
    console.log('')
    console.log('📋 DETAILED REPORT')
    console.log('==================')
    console.log('')
    
    // Connection status
    console.log(`🔌 Connection: ${this.results.connection ? '✅ OK' : '❌ FAILED'}`)
    console.log(`📊 Database: ${this.results.database ? '✅ OK' : '❌ FAILED'}`)
    console.log('')
    
    // Tables status
    console.log('📋 Tables Status:')
    for (const [tableName, status] of Object.entries(this.results.tables)) {
      if (status.exists) {
        const missing = status.missingColumns ? status.missingColumns.length : 0
        const extra = status.extraColumns ? status.extraColumns.length : 0
        console.log(`   ${tableName}: ✅ OK ${missing > 0 ? `(missing: ${missing})` : ''} ${extra > 0 ? `(extra: ${extra})` : ''}`)
      } else {
        console.log(`   ${tableName}: ❌ MISSING`)
      }
    }
    console.log('')
    
    // Indexes status
    const missingIndexes = Object.entries(this.results.indexes).filter(([_, exists]) => !exists)
    console.log(`📊 Indexes: ${missingIndexes.length === 0 ? '✅ ALL OK' : `❌ ${missingIndexes.length} MISSING`}`)
    if (missingIndexes.length > 0) {
      missingIndexes.forEach(([indexName, _]) => console.log(`   ❌ ${indexName}`))
    }
    console.log('')
    
    // Triggers status
    const missingTriggers = Object.entries(this.results.triggers).filter(([_, exists]) => !exists)
    console.log(`⚡ Triggers: ${missingTriggers.length === 0 ? '✅ ALL OK' : `❌ ${missingTriggers.length} MISSING`}`)
    if (missingTriggers.length > 0) {
      missingTriggers.forEach(([triggerName, _]) => console.log(`   ❌ ${triggerName}`))
    }
    console.log('')
    
    // Functions status
    const missingFunctions = Object.entries(this.results.functions).filter(([_, exists]) => !exists)
    console.log(`🔧 Functions: ${missingFunctions.length === 0 ? '✅ ALL OK' : `❌ ${missingFunctions.length} MISSING`}`)
    if (missingFunctions.length > 0) {
      missingFunctions.forEach(([functionName, _]) => console.log(`   ❌ ${functionName}`))
    }
    console.log('')
    
    // Data status
    console.log('📊 Data Status:')
    console.log(`   Admin User: ${this.results.data.adminUser ? '✅ OK' : '❌ MISSING'}`)
    console.log(`   Submissions: ${this.results.data.submissionsCount || 0} records`)
    console.log('')
    
    // Overall status
    console.log(`🎯 OVERALL STATUS: ${this.results.overall ? '✅ READY' : '❌ NOT READY'}`)
    console.log('')
    
    if (!this.results.overall) {
      console.log('🔧 TO FIX ISSUES:')
      console.log('   1. Run: node scripts/setup-database.js')
      console.log('   2. Check database credentials in .env.local')
      console.log('   3. Ensure PostgreSQL is running')
      console.log('   4. Verify database permissions')
      console.log('')
    }
  }
}

// Run the check
async function main() {
  const checker = new DatabaseSetupChecker()
  await checker.checkAll()
}

main().catch(console.error)

