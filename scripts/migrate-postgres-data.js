#!/usr/bin/env node

/**
 * PostgreSQL Data Migration Script
 * Migrates data from existing PostgreSQL database to new setup
 * 
 * Usage: 
 *   node scripts/migrate-postgres-data.js --source-host=old-host --source-db=old-db --source-user=old-user
 *   node scripts/migrate-postgres-data.js --backup-file=backup.sql
 */

const { Pool } = require('pg')
const { exec } = require('child_process')
const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const execAsync = promisify(exec)

// Target database configuration (new setup)
const targetConfig = {
  user: process.env.DB_USER || 'voter_app',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'election_enrollment',
  password: process.env.DB_PASSWORD || 'HiveTech@8180',
  port: parseInt(process.env.DB_PORT || '5432'),
}

class PostgresDataMigrator {
  constructor() {
    this.sourcePool = null
    this.targetPool = null
    this.migrationLog = []
  }

  async connectToTarget() {
    if (!this.targetPool) {
      this.targetPool = new Pool(targetConfig)
      try {
        await this.targetPool.connect()
        console.log('✅ Connected to target database:', targetConfig.database)
      } catch (error) {
        console.error('❌ Failed to connect to target database:', error.message)
        throw error
      }
    }
    return this.targetPool
  }

  async connectToSource(sourceConfig) {
    if (!this.sourcePool) {
      this.sourcePool = new Pool(sourceConfig)
      try {
        await this.sourcePool.connect()
        console.log('✅ Connected to source database:', sourceConfig.database)
      } catch (error) {
        console.error('❌ Failed to connect to source database:', error.message)
        throw error
      }
    }
    return this.sourcePool
  }

  async migrateFromBackup(backupFile) {
    console.log('🔄 Migrating from SQL backup file...')
    
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`)
    }

    await this.connectToTarget()

    try {
      // Create a temporary database for the backup
      const tempDbName = `temp_migration_${Date.now()}`
      
      console.log('📋 Creating temporary database for migration...')
      await this.targetPool.query(`CREATE DATABASE ${tempDbName}`)
      
      // Restore backup to temporary database
      console.log('📥 Restoring backup to temporary database...')
      const restoreCmd = `psql -h ${targetConfig.host} -U ${targetConfig.user} -d ${tempDbName} -f "${backupFile}"`
      const env = { ...process.env, PGPASSWORD: targetConfig.password }
      
      await execAsync(restoreCmd, { env })
      
      // Connect to temporary database
      const tempConfig = { ...targetConfig, database: tempDbName }
      const tempPool = new Pool(tempConfig)
      await tempPool.connect()
      
      console.log('✅ Backup restored to temporary database')
      
      // Get list of tables
      const tablesResult = await tempPool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `)
      
      const tables = tablesResult.rows.map(row => row.table_name)
      console.log('📊 Found tables:', tables)
      
      // Migrate data table by table
      for (const tableName of tables) {
        await this.migrateTable(tempPool, tableName)
      }
      
      // Clean up temporary database
      await tempPool.end()
      await this.targetPool.query(`DROP DATABASE ${tempDbName}`)
      
      console.log('✅ Migration from backup completed')
      
    } catch (error) {
      console.error('❌ Migration from backup failed:', error.message)
      throw error
    }
  }

  async migrateFromSource(sourceConfig) {
    console.log('🔄 Migrating from source PostgreSQL database...')
    
    await this.connectToSource(sourceConfig)
    await this.connectToTarget()

    try {
      // Get list of tables from source
      const tablesResult = await this.sourcePool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `)
      
      const tables = tablesResult.rows.map(row => row.table_name)
      console.log('📊 Found tables in source:', tables)
      
      // Migrate data table by table
      for (const tableName of tables) {
        await this.migrateTable(this.sourcePool, tableName)
      }
      
      console.log('✅ Migration from source database completed')
      
    } catch (error) {
      console.error('❌ Migration from source database failed:', error.message)
      throw error
    }
  }

  async migrateTable(sourcePool, tableName) {
    console.log(`📋 Migrating table: ${tableName}`)
    
    try {
      // Get table structure
      const columnsResult = await sourcePool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [tableName])
      
      const columns = columnsResult.rows
      const columnNames = columns.map(col => col.column_name)
      
      console.log(`   Columns: ${columnNames.join(', ')}`)
      
      // Get row count
      const countResult = await sourcePool.query(`SELECT COUNT(*) as count FROM ${tableName}`)
      const rowCount = parseInt(countResult.rows[0].count)
      
      if (rowCount === 0) {
        console.log(`   ⚠️ Table ${tableName} is empty, skipping...`)
        return
      }
      
      console.log(`   📊 Found ${rowCount} rows to migrate`)
      
      // Check if table exists in target
      const targetExists = await this.targetPool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [tableName])
      
      if (!targetExists.rows[0].exists) {
        console.log(`   ⚠️ Table ${tableName} doesn't exist in target, skipping...`)
        return
      }
      
      // Migrate data in batches
      const batchSize = 1000
      let offset = 0
      let migrated = 0
      
      while (offset < rowCount) {
        const dataResult = await sourcePool.query(`
          SELECT * FROM ${tableName} 
          ORDER BY ${columnNames[0]}
          LIMIT $1 OFFSET $2
        `, [batchSize, offset])
        
        if (dataResult.rows.length === 0) break
        
        // Insert data into target
        for (const row of dataResult.rows) {
          try {
            const values = columnNames.map(col => row[col])
            const placeholders = columnNames.map((_, i) => `$${i + 1}`).join(', ')
            
            await this.targetPool.query(`
              INSERT INTO ${tableName} (${columnNames.join(', ')})
              VALUES (${placeholders})
              ON CONFLICT DO NOTHING
            `, values)
            
            migrated++
          } catch (error) {
            console.log(`   ⚠️ Skipped row due to error: ${error.message}`)
          }
        }
        
        offset += batchSize
        console.log(`   📈 Migrated ${migrated}/${rowCount} rows...`)
      }
      
      console.log(`   ✅ Table ${tableName} migration completed: ${migrated} rows migrated`)
      this.migrationLog.push({
        table: tableName,
        rows: migrated,
        status: 'success'
      })
      
    } catch (error) {
      console.error(`   ❌ Error migrating table ${tableName}:`, error.message)
      this.migrationLog.push({
        table: tableName,
        rows: 0,
        status: 'error',
        error: error.message
      })
    }
  }

  async createBackup(sourceConfig, backupFile) {
    console.log('💾 Creating backup of source database...')
    
    try {
      const pgDumpCmd = `pg_dump -h ${sourceConfig.host} -U ${sourceConfig.user} -d ${sourceConfig.database} -f "${backupFile}"`
      const env = { ...process.env, PGPASSWORD: sourceConfig.password }
      
      await execAsync(pgDumpCmd, { env })
      console.log(`✅ Backup created: ${backupFile}`)
      
    } catch (error) {
      console.error('❌ Backup creation failed:', error.message)
      throw error
    }
  }

  async verifyMigration() {
    console.log('🔍 Verifying migration...')
    
    await this.connectToTarget()
    
    try {
      // Check table counts
      const tables = ['users', 'submissions', 'file_attachments', 'audit_logs']
      
      for (const table of tables) {
        const result = await this.targetPool.query(`SELECT COUNT(*) as count FROM ${table}`)
        const count = parseInt(result.rows[0].count)
        console.log(`   📊 ${table}: ${count} rows`)
      }
      
      // Check for data integrity issues
      const issues = []
      
      // Check for orphaned submissions
      const orphanedSubs = await this.targetPool.query(`
        SELECT COUNT(*) as count FROM submissions s 
        LEFT JOIN users u ON s.user_id = u.id 
        WHERE s.user_id IS NOT NULL AND u.id IS NULL
      `)
      
      if (parseInt(orphanedSubs.rows[0].count) > 0) {
        issues.push(`${orphanedSubs.rows[0].count} submissions have invalid user_id references`)
      }
      
      // Check for duplicate mobile numbers
      const duplicateMobiles = await this.targetPool.query(`
        SELECT mobile_number, COUNT(*) as count 
        FROM submissions 
        WHERE status != 'deleted'
        GROUP BY mobile_number 
        HAVING COUNT(*) > 1
      `)
      
      if (duplicateMobiles.rows.length > 0) {
        issues.push(`${duplicateMobiles.rows.length} mobile numbers have duplicates`)
      }
      
      console.log('\n🔍 Migration Verification Report:')
      if (issues.length === 0) {
        console.log('✅ No data integrity issues found')
      } else {
        console.log('⚠️ Issues found:')
        issues.forEach(issue => console.log(`  - ${issue}`))
      }
      
      return { success: true, issues }
      
    } catch (error) {
      console.error('❌ Migration verification failed:', error.message)
      return { success: false, error: error.message }
    }
  }

  async cleanup() {
    if (this.sourcePool) {
      await this.sourcePool.end()
    }
    if (this.targetPool) {
      await this.targetPool.end()
    }
  }

  printMigrationReport() {
    console.log('\n📋 Migration Report')
    console.log('==================')
    
    const successful = this.migrationLog.filter(log => log.status === 'success')
    const failed = this.migrationLog.filter(log => log.status === 'error')
    
    console.log(`✅ Successful migrations: ${successful.length}`)
    successful.forEach(log => {
      console.log(`   - ${log.table}: ${log.rows} rows`)
    })
    
    if (failed.length > 0) {
      console.log(`❌ Failed migrations: ${failed.length}`)
      failed.forEach(log => {
        console.log(`   - ${log.table}: ${log.error}`)
      })
    }
    
    const totalRows = successful.reduce((sum, log) => sum + log.rows, 0)
    console.log(`📊 Total rows migrated: ${totalRows}`)
  }
}

// Main execution function
async function main() {
  const args = process.argv.slice(2)
  
  // Parse command line arguments
  const sourceHost = args.find(arg => arg.startsWith('--source-host='))?.split('=')[1]
  const sourceDb = args.find(arg => arg.startsWith('--source-db='))?.split('=')[1]
  const sourceUser = args.find(arg => arg.startsWith('--source-user='))?.split('=')[1]
  const sourcePassword = args.find(arg => arg.startsWith('--source-password='))?.split('=')[1]
  const backupFile = args.find(arg => arg.startsWith('--backup-file='))?.split('=')[1]
  
  console.log('🔄 PostgreSQL Data Migration Tool')
  console.log('=================================')
  
  const migrator = new PostgresDataMigrator()
  
  try {
    if (backupFile) {
      // Migrate from backup file
      await migrator.migrateFromBackup(backupFile)
    } else if (sourceHost && sourceDb && sourceUser) {
      // Migrate from source database
      const sourceConfig = {
        host: sourceHost,
        database: sourceDb,
        user: sourceUser,
        password: sourcePassword || 'password',
        port: 5432
      }
      
      // Create backup first
      const backupFile = `backup_${Date.now()}.sql`
      await migrator.createBackup(sourceConfig, backupFile)
      
      // Migrate from source
      await migrator.migrateFromSource(sourceConfig)
    } else {
      console.log('Usage:')
      console.log('  From backup file:')
      console.log('    node scripts/migrate-postgres-data.js --backup-file=backup.sql')
      console.log('')
      console.log('  From source database:')
      console.log('    node scripts/migrate-postgres-data.js --source-host=old-host --source-db=old-db --source-user=old-user --source-password=old-password')
      process.exit(1)
    }
    
    // Verify migration
    await migrator.verifyMigration()
    
    // Print report
    migrator.printMigrationReport()
    
    console.log('\n🎉 PostgreSQL data migration completed!')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await migrator.cleanup()
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { PostgresDataMigrator }
