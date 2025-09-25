import { NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'data')
const SUBMISSIONS_FILE = join(DATA_DIR, 'submissions.json')

async function getSubmissions() {
  try {
    const data = await readFile(SUBMISSIONS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveSubmission(submission: any) {
  await mkdir(DATA_DIR, { recursive: true })
  const submissions = await getSubmissions()
  submissions.push({
    ...submission,
    id: Date.now().toString(),
    submittedAt: new Date().toISOString()
  })
  await writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2))
  return submissions[submissions.length - 1]
}

export async function POST() {
  try {
    const testSubmission = {
      surname: "Test",
      firstName: "Student",
      fathersHusbandName: "Test Father",
      fathersHusbandFullName: "Test Father Full Name",
      sex: "M",
      qualification: "B.Tech",
      occupation: "Student",
      dateOfBirth: "2000-01-01",
      ageYears: "24",
      ageMonths: "8",
      district: "Test District",
      taluka: "Test Taluka",
      villageName: "Test Village",
      houseNo: "123",
      street: "Test Street",
      pinCode: "123456",
      mobileNumber: "9876543210",
      aadhaarNumber: "123456789012",
      yearOfPassing: "2024",
      degreeDiploma: "B.Tech",
      nameOfUniversity: "Test University",
      nameOfDiploma: "Test Diploma",
      haveChangedName: "no",
      place: "Test Place",
      declarationDate: new Date().toISOString().split('T')[0],
      files: {}
    }

    const savedSubmission = await saveSubmission(testSubmission)
    
    return NextResponse.json({
      success: true,
      submissionId: savedSubmission.id,
      message: 'Test submission created successfully!'
    })

  } catch (error) {
    console.error('Test submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create test submission' },
      { status: 500 }
    )
  }
}
