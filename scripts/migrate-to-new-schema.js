#!/usr/bin/env node

/**
 * Migration Script: Update existing database to new schema
 * Adds new fields and makes existing fields optional
 * 
 * Usage: node scripts/migrate-to-new-schema.js
 */

const { query } = require('../lib/database')

async function migrateToNewSchema() {
  try {
    console.log('🔄 Migrating database to new schema...')
    console.log('=====================================')
    
    // Add new education fields
    console.log('📚 Adding education fields...')
    await query(`
      ALTER TABLE submissions 
      ADD COLUMN IF NOT EXISTS education_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS document_type VARCHAR(50)
    `)
    console.log('✅ Education fields added')
    
    // Add new additional information fields
    console.log('ℹ️ Adding additional information fields...')
    await query(`
      ALTER TABLE submissions 
      ADD COLUMN IF NOT EXISTS previous_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS name_change_document_type VARCHAR(50)
    `)
    console.log('✅ Additional information fields added')
    
    // Make existing fields optional
    console.log('🔧 Making existing fields optional...')
    await query(`
      ALTER TABLE submissions 
      ALTER COLUMN fathers_husband_name DROP NOT NULL,
      ALTER COLUMN sex DROP NOT NULL,
      ALTER COLUMN date_of_birth DROP NOT NULL,
      ALTER COLUMN age_years DROP NOT NULL,
      ALTER COLUMN age_months DROP NOT NULL,
      ALTER COLUMN village_name DROP NOT NULL,
      ALTER COLUMN house_no DROP NOT NULL,
      ALTER COLUMN street DROP NOT NULL,
      ALTER COLUMN place DROP NOT NULL,
      ALTER COLUMN declaration_date DROP NOT NULL
    `)
    console.log('✅ Fields made optional')
    
    // Update existing records to have empty strings instead of null for place and declaration_date
    console.log('🔄 Updating existing records...')
    await query(`
      UPDATE submissions 
      SET place = '' WHERE place IS NULL,
          declaration_date = NULL WHERE declaration_date = ''
    `)
    console.log('✅ Existing records updated')
    
    console.log('🎉 Migration completed successfully!')
    console.log('')
    console.log('📋 Changes made:')
    console.log('  ✅ Added education_type field')
    console.log('  ✅ Added document_type field')
    console.log('  ✅ Added previous_name field')
    console.log('  ✅ Added name_change_document_type field')
    console.log('  ✅ Made fathers_husband_name optional')
    console.log('  ✅ Made sex optional')
    console.log('  ✅ Made date_of_birth optional')
    console.log('  ✅ Made age fields optional')
    console.log('  ✅ Made address fields optional')
    console.log('  ✅ Made place optional')
    console.log('  ✅ Made declaration_date optional')
    console.log('')
    console.log('🔧 Next steps:')
    console.log('  1. Test form submission')
    console.log('  2. Verify all fields work correctly')
    console.log('  3. Check database for new data')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  migrateToNewSchema()
    .then(() => {
      console.log('🎉 Migration completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error)
      process.exit(1)
    })
}

module.exports = { migrateToNewSchema }
