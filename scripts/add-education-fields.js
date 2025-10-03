const { query } = require('../lib/database')

async function addEducationFields() {
  try {
    console.log('🔄 Adding new education and additional fields...')
    
    // Add new education fields
    await query(`
      ALTER TABLE submissions 
      ADD COLUMN IF NOT EXISTS education_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS document_type VARCHAR(50)
    `)
    
    // Add new additional information fields
    await query(`
      ALTER TABLE submissions 
      ADD COLUMN IF NOT EXISTS previous_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS name_change_document_type VARCHAR(50)
    `)
    
    // Remove old fields (make them optional first)
    await query(`
      ALTER TABLE submissions 
      ALTER COLUMN place DROP NOT NULL,
      ALTER COLUMN declaration_date DROP NOT NULL
    `)
    
    console.log('✅ New fields added successfully!')
    console.log('📝 Added fields:')
    console.log('  - education_type (VARCHAR(50))')
    console.log('  - document_type (VARCHAR(50))')
    console.log('  - previous_name (VARCHAR(255))')
    console.log('  - name_change_document_type (VARCHAR(50))')
    console.log('📝 Made optional:')
    console.log('  - place (no longer required)')
    console.log('  - declaration_date (no longer required)')
    
  } catch (error) {
    console.error('❌ Error adding fields:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  addEducationFields()
    .then(() => {
      console.log('🎉 Migration completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error)
      process.exit(1)
    })
}

module.exports = { addEducationFields }
