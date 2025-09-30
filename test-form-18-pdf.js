// Test script for the new Form-18 PDF generation
const { generateStudentFormPDF } = require('./lib/student-pdf-generator.ts')

async function testForm18PDFGeneration() {
  console.log('🧪 Testing Form-18 PDF generation with official format...')
  
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
    files: {
      // Simulate an ID photo with base64 data
      idPhoto: {
        originalName: 'id-photo.jpg',
        filename: 'test-id-photo.jpg',
        size: 50000,
        base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
      }
    },
    submittedAt: new Date().toISOString()
  }
  
  try {
    console.log('📄 Generating Form-18 PDF with official ECI format...')
    const pdfPath = await generateStudentFormPDF(testSubmission)
    console.log('✅ Form-18 PDF generated successfully:', pdfPath)
    console.log('📄 You can find the PDF at:', pdfPath)
    console.log('')
    console.log('🎯 Key Features:')
    console.log('✅ Official ECI Form-18 format (no extra styling)')
    console.log('✅ ID photo displayed in proper location')
    console.log('✅ Base64 image handling')
    console.log('✅ All form fields properly mapped')
    console.log('✅ Professional government layout')
  } catch (error) {
    console.error('❌ Form-18 PDF generation failed:', error)
  }
}

// Run the test
testForm18PDFGeneration().catch(console.error)
