#!/usr/bin/env node

/**
 * Migration Script: JSON to PostgreSQL
 * This script migrates existing JSON data to PostgreSQL database with concurrency safety
 * 
 * Usage: node scripts/migrate-json-to-postgres.js
 */

const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'election_enrollment',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
}

async function migrateData() {
  console.log('🔄 Starting migration from JSON to PostgreSQL...')
  console.log('===============================================')
  
  const pool = new Pool(dbConfig)
  
  try {
    // Test database connection
    await pool.query('SELECT 1')
    console.log('✅ Database connection established')

    // Read existing JSON data
    const jsonPath = path.join(process.cwd(), 'data', 'submissions.json')
    
    if (!fs.existsSync(jsonPath)) {
      console.log('⚠️ No submissions.json found. Skipping migration.')
      return
    }
    
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    
    if (jsonData.length === 0) {
      console.log('ℹ️ submissions.json is empty. Skipping migration.')
      return
    }

    console.log(`📊 Found ${jsonData.length} submissions in JSON file.`)

    // Process submissions in batches for better performance
    const batchSize = 100
    let processed = 0
    let errors = 0

    for (let i = 0; i < jsonData.length; i += batchSize) {
      const batch = jsonData.slice(i, i + batchSize)
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(jsonData.length / batchSize)} (${batch.length} records)`)

      // Process batch in transaction
      const client = await pool.connect()
      try {
        await client.query('BEGIN')

        for (const submission of batch) {
          try {
            // Ensure all required fields are present or provide defaults
            const mappedSubmission = {
              id: submission.id || `MIGRATED_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
              userId: submission.userId || null,
              surname: submission.surname || 'N/A',
              firstName: submission.firstName || 'N/A',
              fathersHusbandName: submission.fathersHusbandName || 'N/A',
              fathersHusbandFullName: submission.fathersHusbandFullName || null,
              sex: submission.sex || 'M',
              qualification: submission.qualification || null,
              occupation: submission.occupation || null,
              dateOfBirth: submission.dateOfBirth || '2000-01-01',
              ageYears: submission.ageYears || 0,
              ageMonths: submission.ageMonths || 0,
              district: submission.district || 'N/A',
              taluka: submission.taluka || 'N/A',
              villageName: submission.villageName || 'N/A',
              houseNo: submission.houseNo || 'N/A',
              street: submission.street || 'N/A',
              pinCode: submission.pinCode || '000000',
              mobileNumber: submission.mobileNumber || '0000000000',
              email: submission.email || null,
              aadhaarNumber: submission.aadhaarNumber || '000000000000',
              yearOfPassing: submission.yearOfPassing || null,
              degreeDiploma: submission.degreeDiploma || null,
              nameOfUniversity: submission.nameOfUniversity || null,
              nameOfDiploma: submission.nameOfDiploma || null,
              haveChangedName: submission.haveChangedName || 'No',
              place: submission.place || 'N/A',
              declarationDate: submission.declarationDate || '2000-01-01',
              status: submission.status || 'pending',
              submittedAt: submission.submittedAt || new Date().toISOString(),
              updatedAt: submission.updatedAt || new Date().toISOString(),
              files: submission.files || {},
            }

            // Validate data before insertion
            if (mappedSubmission.mobileNumber.length !== 10) {
              console.log(`⚠️ Invalid mobile number for submission ${mappedSubmission.id}: ${mappedSubmission.mobileNumber}`)
              mappedSubmission.mobileNumber = '0000000000'
            }

            if (mappedSubmission.aadhaarNumber.length !== 12) {
              console.log(`⚠️ Invalid Aadhaar number for submission ${mappedSubmission.id}: ${mappedSubmission.aadhaarNumber}`)
              mappedSubmission.aadhaarNumber = '000000000000'
            }

            if (mappedSubmission.pinCode.length !== 6) {
              console.log(`⚠️ Invalid PIN code for submission ${mappedSubmission.id}: ${mappedSubmission.pinCode}`)
              mappedSubmission.pinCode = '000000'
            }

            // Check for duplicates before insertion
            const duplicateCheck = await client.query(
              `SELECT id FROM submissions 
               WHERE mobile_number = $1 OR aadhaar_number = $2 
               LIMIT 1`,
              [mappedSubmission.mobileNumber, mappedSubmission.aadhaarNumber]
            )

            if (duplicateCheck.rows.length > 0) {
              console.log(`⚠️ Duplicate found for submission ${mappedSubmission.id}, skipping...`)
              continue
            }

            await client.query(
              `INSERT INTO submissions (
                id, user_id, surname, first_name, fathers_husband_name, fathers_husband_full_name,
                sex, qualification, occupation, date_of_birth, age_years, age_months,
                district, taluka, village_name, house_no, street, pin_code,
                mobile_number, email, aadhaar_number,
                year_of_passing, degree_diploma, name_of_university, name_of_diploma,
                have_changed_name, place, declaration_date, status, submitted_at, updated_at, files
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)
              ON CONFLICT (id) DO UPDATE SET
                user_id = EXCLUDED.user_id,
                surname = EXCLUDED.surname,
                first_name = EXCLUDED.first_name,
                fathers_husband_name = EXCLUDED.fathers_husband_name,
                fathers_husband_full_name = EXCLUDED.fathers_husband_full_name,
                sex = EXCLUDED.sex,
                qualification = EXCLUDED.qualification,
                occupation = EXCLUDED.occupation,
                date_of_birth = EXCLUDED.date_of_birth,
                age_years = EXCLUDED.age_years,
                age_months = EXCLUDED.age_months,
                district = EXCLUDED.district,
                taluka = EXCLUDED.taluka,
                village_name = EXCLUDED.village_name,
                house_no = EXCLUDED.house_no,
                street = EXCLUDED.street,
                pin_code = EXCLUDED.pin_code,
                mobile_number = EXCLUDED.mobile_number,
                email = EXCLUDED.email,
                aadhaar_number = EXCLUDED.aadhaar_number,
                year_of_passing = EXCLUDED.year_of_passing,
                degree_diploma = EXCLUDED.degree_diploma,
                name_of_university = EXCLUDED.name_of_university,
                name_of_diploma = EXCLUDED.name_of_diploma,
                have_changed_name = EXCLUDED.have_changed_name,
                place = EXCLUDED.place,
                declaration_date = EXCLUDED.declaration_date,
                status = EXCLUDED.status,
                submitted_at = EXCLUDED.submitted_at,
                updated_at = EXCLUDED.updated_at,
                files = EXCLUDED.files
              `,
              [
                mappedSubmission.id, mappedSubmission.userId, mappedSubmission.surname, mappedSubmission.firstName, 
                mappedSubmission.fathersHusbandName, mappedSubmission.fathersHusbandFullName,
                mappedSubmission.sex, mappedSubmission.qualification, mappedSubmission.occupation, 
                mappedSubmission.dateOfBirth, mappedSubmission.ageYears, mappedSubmission.ageMonths,
                mappedSubmission.district, mappedSubmission.taluka, mappedSubmission.villageName, 
                mappedSubmission.houseNo, mappedSubmission.street, mappedSubmission.pinCode,
                mappedSubmission.mobileNumber, mappedSubmission.email, mappedSubmission.aadhaarNumber,
                mappedSubmission.yearOfPassing, mappedSubmission.degreeDiploma, mappedSubmission.nameOfUniversity, 
                mappedSubmission.nameOfDiploma, mappedSubmission.haveChangedName, mappedSubmission.place, 
                mappedSubmission.declarationDate, mappedSubmission.status, mappedSubmission.submittedAt, 
                mappedSubmission.updatedAt, mappedSubmission.files
              ]
            )
            
            processed++
            console.log(`✅ Migrated submission ID: ${mappedSubmission.id}`)

          } catch (error) {
            console.error(`❌ Error migrating submission ${submission.id}:`, error.message)
            errors++
          }
        }

        await client.query('COMMIT')
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} completed successfully`)

      } catch (error) {
        await client.query('ROLLBACK')
        console.error(`❌ Error processing batch ${Math.floor(i / batchSize) + 1}:`, error)
        errors += batch.length
      } finally {
        client.release()
      }
    }

    // Verify migration
    console.log('🔍 Verifying migration...')
    const countResult = await pool.query('SELECT COUNT(*) as total FROM submissions')
    const totalInDB = parseInt(countResult.rows[0].total)

    console.log('')
    console.log('📊 Migration Summary:')
    console.log(`   Total records in JSON: ${jsonData.length}`)
    console.log(`   Successfully migrated: ${processed}`)
    console.log(`   Errors encountered: ${errors}`)
    console.log(`   Total records in DB: ${totalInDB}`)
    console.log('')

    if (errors === 0) {
      console.log('🎉 JSON to PostgreSQL migration completed successfully!')
      
      // Create backup of original JSON file
      const backupPath = path.join(process.cwd(), 'data', `submissions_backup_${Date.now()}.json`)
      fs.copyFileSync(jsonPath, backupPath)
      console.log(`💾 Original JSON file backed up to: ${backupPath}`)
      
      // Optionally archive the original file
      console.log('ℹ️ You can now safely remove the original JSON file if everything looks good.')
    } else {
      console.log('⚠️ Migration completed with errors. Please review the error messages above.')
    }

  } catch (error) {
    console.error('❌ Error during migration:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

migrateData()
