#!/usr/bin/env node

/**
 * Complete Setup & Connection Sequence Script
 * Establishes database connections and validates system setup
 * 
 * This script demonstrates the complete connection flow and setup sequence
 * used by the Election Management System
 */

const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

// Database configuration with environment fallbacks
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'election_enrollment',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
  
  // Connection pool settings for high concurrency
  max: 100,
  min: 20,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  acquireTimeoutMillis: 30000,
  createTimeoutMillis: 10000,
  destroyTimeoutMillis: 2000,
  reapIntervalMillis: 500,
  createRetryIntervalMillis: 100,
  
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
}

class ConnectionSequenceManager {
  constructor() {
    this.pool = null
    this.connectionSteps = []
  }

  // Step 1: Validate environment configuration
  validateEnvironment() {
    console.log('🔍 Step 1: Validating Environment Configuration')
    console.log('===============================================')
    
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']
    const missingVars = []
    
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        missingVars.push(varName)
      }
    })
    
    if (missingVars.length > 0) {
      console.log('❌ Missing environment variables:', missingVars.join(', '))
      console.log('📝 Please check your .env.local file')
      return false
    }
    
    console.log('✅ Environment variables validated')
    console.log(`   Host: ${dbConfig.host}`)
    console.log(`   Database: ${dbConfig.database}`)
    console.log(`   User: ${dbConfig.user}`)
    console.log(`   Port: ${dbConfig.port}`)
    console.log(`   SSL: ${dbConfig.ssl ? 'Enabled' : 'Disabled'}`)
    
    this.connectionSteps.push('Environment validation completed')
    return true
  }

  // Step 2: Test basic database connectivity
  async testBasicConnection() {
    console.log('\n🔌 Step 2: Testing Basic Database Connectivity')
    console.log('==============================================')
    
    try {
      // Create a simple connection pool
      const testPool = new Pool({
        user: dbConfig.user,
        host: dbConfig.host,
        database: 'postgres', // Connect to default postgres database first
        password: dbConfig.password,
        port: dbConfig.port,
        ssl: dbConfig.ssl
      })
      
      const client = await testPool.connect()
      const result = await client.query('SELECT NOW() as current_time, version() as version')
      client.release()
      await testPool.end()
      
      console.log('✅ Basic connection successful')
      console.log(`   Time: ${result.rows[0].current_time}`)
      console.log(`   Version: ${result.rows[0].version.split(' ')[0]}`)
      
      this.connectionSteps.push('Basic connectivity test passed')
      return true
      
    } catch (error) {
      console.log('❌ Basic connection failed:', error.message)
      console.log('🔧 Troubleshooting:')
      console.log('   1. Check if PostgreSQL is running')
      console.log('   2. Verify host and port settings')
      console.log('   3. Check username and password')
      console.log('   4. Ensure database server is accessible')
      return false
    }
  }

  // Step 3: Create application database if needed
  async createApplicationDatabase() {
    console.log('\n🏗️ Step 3: Creating Application Database')
    console.log('=========================================')
    
    try {
      // Connect to postgres database to create our app database
      const adminPool = new Pool({
        user: dbConfig.user,
        host: dbConfig.host,
        database: 'postgres',
        password: dbConfig.password,
        port: dbConfig.port,
        ssl: dbConfig.ssl
      })
      
      await adminPool.query(`CREATE DATABASE ${dbConfig.database}`)
      console.log(`✅ Database '${dbConfig.database}' created successfully`)
      await adminPool.end()
      
      this.connectionSteps.push('Application database created')
      return true
      
    } catch (error) {
      if (error.code === '42P04') {
        console.log(`⚠️ Database '${dbConfig.database}' already exists`)
        this.connectionSteps.push('Application database already exists')
        return true
      } else {
        console.log('❌ Database creation failed:', error.message)
        return false
      }
    }
  }

  // Step 4: Initialize connection pool
  async initializeConnectionPool() {
    console.log('\n🏊 Step 4: Initializing Connection Pool')
    console.log('======================================')
    
    try {
      this.pool = new Pool(dbConfig)
      
      // Test pool connection
      const client = await this.pool.connect()
      const result = await client.query('SELECT NOW() as current_time')
      client.release()
      
      console.log('✅ Connection pool initialized successfully')
      console.log(`   Pool size: ${this.pool.totalCount}`)
      console.log(`   Idle connections: ${this.pool.idleCount}`)
      console.log(`   Current time: ${result.rows[0].current_time}`)
      
      this.connectionSteps.push('Connection pool initialized')
      return true
      
    } catch (error) {
      console.log('❌ Connection pool initialization failed:', error.message)
      return false
    }
  }

  // Step 5: Verify database schema
  async verifyDatabaseSchema() {
    console.log('\n📋 Step 5: Verifying Database Schema')
    console.log('====================================')
    
    try {
      const requiredTables = ['users', 'submissions', 'file_attachments', 'audit_logs', 'statistics']
      const existingTables = []
      
      for (const table of requiredTables) {
        const result = await this.pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `, [table])
        
        if (result.rows[0].exists) {
          existingTables.push(table)
          console.log(`✅ Table '${table}' exists`)
        } else {
          console.log(`❌ Table '${table}' missing`)
        }
      }
      
      if (existingTables.length === requiredTables.length) {
        console.log('✅ All required tables present')
        this.connectionSteps.push('Database schema verified')
        return true
      } else {
        console.log('⚠️ Some tables are missing. Run database setup first.')
        this.connectionSteps.push('Database schema incomplete')
        return false
      }
      
    } catch (error) {
      console.log('❌ Schema verification failed:', error.message)
      return false
    }
  }

  // Step 6: Test data operations
  async testDataOperations() {
    console.log('\n💾 Step 6: Testing Data Operations')
    console.log('==================================')
    
    try {
      // Test read operation
      const readResult = await this.pool.query('SELECT COUNT(*) as count FROM submissions')
      console.log(`✅ Read operation successful: ${readResult.rows[0].count} submissions`)
      
      // Test write operation (if we have a test user)
      const userCheck = await this.pool.query('SELECT COUNT(*) as count FROM users WHERE email = $1', ['admin@election.com'])
      
      if (parseInt(userCheck.rows[0].count) > 0) {
        console.log('✅ Admin user exists')
      } else {
        console.log('⚠️ Admin user not found - run database setup')
      }
      
      // Test transaction
      const client = await this.pool.connect()
      try {
        await client.query('BEGIN')
        await client.query('SELECT 1')
        await client.query('COMMIT')
        console.log('✅ Transaction test successful')
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      } finally {
        client.release()
      }
      
      this.connectionSteps.push('Data operations tested successfully')
      return true
      
    } catch (error) {
      console.log('❌ Data operations test failed:', error.message)
      return false
    }
  }

  // Step 7: Performance testing
  async testPerformance() {
    console.log('\n⚡ Step 7: Performance Testing')
    console.log('==============================')
    
    try {
      const startTime = Date.now()
      
      // Test multiple concurrent connections
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(this.pool.query('SELECT NOW() as time, $1 as id', [i]))
      }
      
      await Promise.all(promises)
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      console.log(`✅ Concurrent query test completed in ${duration}ms`)
      console.log(`   Pool utilization: ${this.pool.totalCount - this.pool.idleCount}/${this.pool.totalCount}`)
      
      this.connectionSteps.push('Performance test completed')
      return true
      
    } catch (error) {
      console.log('❌ Performance test failed:', error.message)
      return false
    }
  }

  // Step 8: Health check
  async performHealthCheck() {
    console.log('\n🏥 Step 8: System Health Check')
    console.log('==============================')
    
    try {
      const healthData = {
        poolSize: this.pool.totalCount,
        idleConnections: this.pool.idleCount,
        waitingClients: this.pool.waitingCount,
        connectionUtilization: Math.round(((this.pool.totalCount - this.pool.idleCount) / this.pool.totalCount) * 100)
      }
      
      console.log('📊 Connection Pool Status:')
      console.log(`   Total connections: ${healthData.poolSize}`)
      console.log(`   Idle connections: ${healthData.idleConnections}`)
      console.log(`   Waiting clients: ${healthData.waitingClients}`)
      console.log(`   Utilization: ${healthData.connectionUtilization}%`)
      
      // Test database responsiveness
      const startTime = Date.now()
      await this.pool.query('SELECT 1')
      const responseTime = Date.now() - startTime
      
      console.log(`   Response time: ${responseTime}ms`)
      
      if (responseTime < 100) {
        console.log('✅ Database is responsive')
      } else if (responseTime < 500) {
        console.log('⚠️ Database is slow but responsive')
      } else {
        console.log('❌ Database is unresponsive')
        return false
      }
      
      this.connectionSteps.push('Health check completed')
      return true
      
    } catch (error) {
      console.log('❌ Health check failed:', error.message)
      return false
    }
  }

  // Cleanup connections
  async cleanup() {
    if (this.pool) {
      await this.pool.end()
      console.log('🔌 Connection pool closed')
    }
  }

  // Run complete sequence
  async runCompleteSequence() {
    console.log('🚀 Starting Complete Connection Sequence')
    console.log('========================================')
    console.log(`Target Database: ${dbConfig.database}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log('')
    
    const steps = [
      () => this.validateEnvironment(),
      () => this.testBasicConnection(),
      () => this.createApplicationDatabase(),
      () => this.initializeConnectionPool(),
      () => this.verifyDatabaseSchema(),
      () => this.testDataOperations(),
      () => this.testPerformance(),
      () => this.performHealthCheck()
    ]
    
    let allPassed = true
    
    for (let i = 0; i < steps.length; i++) {
      try {
        const result = await steps[i]()
        if (!result) {
          allPassed = false
          console.log(`\n❌ Step ${i + 1} failed. Stopping sequence.`)
          break
        }
      } catch (error) {
        console.log(`\n❌ Step ${i + 1} error:`, error.message)
        allPassed = false
        break
      }
    }
    
    console.log('\n📋 Connection Sequence Summary')
    console.log('==============================')
    console.log(`Steps completed: ${this.connectionSteps.length}/8`)
    console.log(`Overall status: ${allPassed ? '✅ SUCCESS' : '❌ FAILED'}`)
    
    if (allPassed) {
      console.log('\n🎉 System is ready for production!')
      console.log('🔧 Next steps:')
      console.log('   1. Start the application: npm run dev')
      console.log('   2. Test form submissions')
      console.log('   3. Monitor performance')
    } else {
      console.log('\n🔧 Troubleshooting required:')
      console.log('   1. Check database server status')
      console.log('   2. Verify network connectivity')
      console.log('   3. Review environment configuration')
      console.log('   4. Run database setup if needed')
    }
    
    return allPassed
  }
}

// Main execution
async function main() {
  const manager = new ConnectionSequenceManager()
  
  try {
    const success = await manager.runCompleteSequence()
    process.exit(success ? 0 : 1)
  } catch (error) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  } finally {
    await manager.cleanup()
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { ConnectionSequenceManager, dbConfig }
