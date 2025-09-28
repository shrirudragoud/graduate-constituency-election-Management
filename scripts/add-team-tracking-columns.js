#!/usr/bin/env node

/**
 * Migration Script: Add Team Tracking Columns
 * Adds new columns to track form source and team member information
 * 
 * Usage: node scripts/add-team-tracking-columns.js
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

async function addTeamTrackingColumns() {
  console.log('🔄 Adding team tracking columns to submissions table...')
  console.log('================================================')
  
  const pool = new Pool(dbConfig)
  
  try {
    await pool.connect()
    console.log(`✅ Connected to database '${dbConfig.database}'`)

    // Add new columns
    console.log('📝 Adding team tracking columns...')
    
    await pool.query(`
      ALTER TABLE submissions 
      ADD COLUMN IF NOT EXISTS filled_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS filled_by_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS filled_by_phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS form_source VARCHAR(50) DEFAULT 'public' CHECK (form_source IN ('public', 'team')),
      ADD COLUMN IF NOT EXISTS filled_for_self BOOLEAN DEFAULT false
    `)
    console.log('✅ Team tracking columns added')

    // Update existing records to have 'public' as default form_source
    console.log('🔄 Updating existing records...')
    const updateResult = await pool.query(`
      UPDATE submissions 
      SET form_source = 'public', filled_for_self = true 
      WHERE form_source IS NULL
    `)
    console.log(`✅ Updated ${updateResult.rowCount} existing records`)

    // Add indexes for the new columns
    console.log('📊 Creating indexes for team tracking...')
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_submissions_filled_by_user_id ON submissions(filled_by_user_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_form_source ON submissions(form_source);
      CREATE INDEX IF NOT EXISTS idx_submissions_filled_for_self ON submissions(filled_for_self);
    `)
    console.log('✅ Team tracking indexes created')

    // Verify the changes
    console.log('🔍 Verifying changes...')
    const verifyResult = await pool.query(`
      SELECT 
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN form_source = 'public' THEN 1 END) as public_submissions,
        COUNT(CASE WHEN form_source = 'team' THEN 1 END) as team_submissions,
        COUNT(CASE WHEN filled_by_user_id IS NOT NULL THEN 1 END) as team_filled_submissions
      FROM submissions
    `)
    
    const stats = verifyResult.rows[0]
    console.log('📊 Database Statistics:')
    console.log(`  Total submissions: ${stats.total_submissions}`)
    console.log(`  Public submissions: ${stats.public_submissions}`)
    console.log(`  Team submissions: ${stats.team_submissions}`)
    console.log(`  Team-filled submissions: ${stats.team_filled_submissions}`)

    console.log('')
    console.log('🎉 Team tracking migration completed successfully!')
    console.log('')
    console.log('📋 What was added:')
    console.log('  ✅ filled_by_user_id - References the team member who filled the form')
    console.log('  ✅ filled_by_name - Name of the team member who filled the form')
    console.log('  ✅ filled_by_phone - Phone number of the team member')
    console.log('  ✅ form_source - Whether form was filled publicly or by team')
    console.log('  ✅ filled_for_self - Whether the form was filled for the team member themselves')
    console.log('  ✅ Indexes for efficient querying')
    console.log('')
    console.log('🔧 Next steps:')
    console.log('  1. Test the team form submission functionality')
    console.log('  2. Verify that public forms still work correctly')
    console.log('  3. Check the team dashboard analytics')

  } catch (error) {
    console.error('❌ Error adding team tracking columns:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

addTeamTrackingColumns()
