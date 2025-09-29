// Test script for PDF generation
const { generateStudentFormPDF } = require('./lib/student-pdf-generator.ts')

async function testPDFGeneration() {
  console.log('🧪 Testing PDF generation...')
  
  const testSubmission = {
    id: 'TEST_' + Date.now(),
    surname: 'Sharma',
    firstName: 'Rajesh',
    fathersHusbandName: 'Ram Prasad Sharma',
    fathersHusbandFullName: 'Ram Prasad Sharma',
    sex: 'M',
    qualification: 'B.Tech Computer Science',
    occupation: 'Software Engineer',
    dateOfBirth: '1995-06-15',
    ageYears: 28,
    ageMonths: 6,
    district: 'Mumbai',
    taluka: 'Mumbai City',
    villageName: 'Andheri',
    houseNo: '123',
    street: 'MG Road',
    pinCode: '400001',
    mobileNumber: '9876543210',
    aadhaarNumber: '123456789012',
    email: 'rajesh.sharma@example.com',
    yearOfPassing: '2017',
    degreeDiploma: 'B.Tech Computer Science',
    nameOfUniversity: 'Mumbai University',
    nameOfDiploma: 'Not applicable',
    haveChangedName: 'No',
    place: 'Mumbai',
    declarationDate: '2024-01-15',
    files: {},
    submittedAt: new Date().toISOString()
  }
  
  try {
    const pdfPath = await generateStudentFormPDF(testSubmission)
    console.log('✅ PDF generated successfully:', pdfPath)
    console.log('📄 You can find the PDF at:', pdfPath)
  } catch (error) {
    console.error('❌ PDF generation failed:', error)
  }
}

// Run the test
testPDFGeneration().catch(console.error)

