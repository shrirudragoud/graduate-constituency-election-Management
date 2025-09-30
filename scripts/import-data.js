#!/usr/bin/env node

/**
 * Simple Data Import - Just Works!
 * Imports sample data to see it in the webapp
 */

const { Pool } = require('pg')

// Same simple config
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'election_enrollment', 
  password: 'password',
  port: 5432
}

async function importSampleData() {
  console.log('📥 Importing Sample Data')
  console.log('========================')
  console.log('')

  const pool = new Pool(dbConfig)

  try {
    // Test connection
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    console.log('✅ Connected to database')

    // Sample submissions
    const sampleSubmissions = [
      {
        id: 'SUB_' + Date.now() + '_001',
        surname: 'Sharma',
        first_name: 'Rajesh',
        fathers_husband_name: 'Ram Prasad Sharma',
        sex: 'M',
        date_of_birth: '1995-06-15',
        age_years: 28,
        age_months: 6,
        district: 'Mumbai',
        taluka: 'Mumbai City',
        village_name: 'Andheri',
        house_no: '123',
        street: 'MG Road',
        pin_code: '400001',
        mobile_number: '9876543210',
        email: 'rajesh.sharma@example.com',
        aadhaar_number: '123456789012',
        year_of_passing: '2017',
        degree_diploma: 'B.Tech Computer Science',
        name_of_university: 'Mumbai University',
        have_changed_name: 'No',
        place: 'Mumbai',
        declaration_date: '2024-01-15',
        status: 'pending'
      },
      {
        id: 'SUB_' + Date.now() + '_002',
        surname: 'Patel',
        first_name: 'Priya',
        fathers_husband_name: 'Kumar Patel',
        sex: 'F',
        date_of_birth: '1998-03-22',
        age_years: 25,
        age_months: 9,
        district: 'Delhi',
        taluka: 'New Delhi',
        village_name: 'Connaught Place',
        house_no: '456',
        street: 'Janpath',
        pin_code: '110001',
        mobile_number: '9876543211',
        email: 'priya.patel@example.com',
        aadhaar_number: '123456789013',
        year_of_passing: '2020',
        degree_diploma: 'B.Com',
        name_of_university: 'Delhi University',
        have_changed_name: 'No',
        place: 'Delhi',
        declaration_date: '2024-01-16',
        status: 'approved'
      },
      {
        id: 'SUB_' + Date.now() + '_003',
        surname: 'Singh',
        first_name: 'Amit',
        fathers_husband_name: 'Vikram Singh',
        sex: 'M',
        date_of_birth: '1992-11-08',
        age_years: 31,
        age_months: 2,
        district: 'Bangalore',
        taluka: 'Bangalore Urban',
        village_name: 'Koramangala',
        house_no: '789',
        street: '100 Feet Road',
        pin_code: '560034',
        mobile_number: '9876543212',
        email: 'amit.singh@example.com',
        aadhaar_number: '123456789014',
        year_of_passing: '2014',
        degree_diploma: 'B.E Mechanical',
        name_of_university: 'VTU',
        have_changed_name: 'No',
        place: 'Bangalore',
        declaration_date: '2024-01-17',
        status: 'pending'
      }
    ]

    console.log('📋 Adding sample submissions...')
    
    for (const submission of sampleSubmissions) {
      try {
        await pool.query(`
          INSERT INTO submissions (
            id, surname, first_name, fathers_husband_name, sex, date_of_birth, 
            age_years, age_months, district, taluka, village_name, house_no, 
            street, pin_code, mobile_number, email, aadhaar_number, 
            year_of_passing, degree_diploma, name_of_university, 
            have_changed_name, place, declaration_date, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
          ON CONFLICT (id) DO NOTHING
        `, [
          submission.id, submission.surname, submission.first_name, 
          submission.fathers_husband_name, submission.sex, submission.date_of_birth,
          submission.age_years, submission.age_months, submission.district, 
          submission.taluka, submission.village_name, submission.house_no,
          submission.street, submission.pin_code, submission.mobile_number, 
          submission.email, submission.aadhaar_number, submission.year_of_passing,
          submission.degree_diploma, submission.name_of_university, 
          submission.have_changed_name, submission.place, submission.declaration_date, 
          submission.status
        ])
        console.log(`✅ Added: ${submission.first_name} ${submission.surname}`)
      } catch (error) {
        console.log(`⚠️ Skipped: ${submission.first_name} ${submission.surname} (already exists)`)
      }
    }

    // Check final count
    const count = await pool.query('SELECT COUNT(*) as count FROM submissions')
    console.log('')
    console.log(`📊 Total submissions now: ${count.rows[0].count}`)
    console.log('')
    console.log('🎉 Sample data imported!')
    console.log('========================')
    console.log('✅ Check your webapp at http://localhost:3000')
    console.log('✅ Go to admin panel to see the data')
    console.log('✅ Try submitting a new form')

  } catch (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

importSampleData()
