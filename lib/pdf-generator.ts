// @ts-ignore
import jsPDF from 'jspdf'

export interface SubmissionData {
  id: string
  firstName: string
  surname: string
  fathersHusbandName: string
  fathersHusbandFullName: string
  sex: string
  qualification: string
  occupation: string
  dateOfBirth: string
  ageYears: number
  ageMonths: number
  address: {
    district: string
    taluka: string
    villageName: string
    houseNo: string
    street: string
    pinCode: string
  }
  mobileNumber: string
  aadhaarNumber: string
  yearOfPassing: string
  degreeDiploma: string
  nameOfUniversity: string
  nameOfDiploma: string
  haveChangedName: string
  place: string
  declarationDate: string
  email: string
  files: Record<string, any>
  submittedAt: string
}

export function generateStudentPDF(submission: SubmissionData): jsPDF {
  try {
    const doc = new jsPDF()
  
  // Set font
  doc.setFont('helvetica')
  
  // Add header
  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0)
  doc.text('Bharatiya Janata Party', 20, 30)
  doc.setFontSize(16)
  doc.text('Student Registration Form', 20, 40)
  
  // Add line separator
  doc.setLineWidth(0.5)
  doc.line(20, 45, 190, 45)
  
  // Personal Information Section
  doc.setFontSize(14)
  doc.setTextColor(0, 100, 0)
  doc.text('Personal Information', 20, 60)
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  
  let yPosition = 70
  
  // Name
  doc.text(`Name: ${submission.firstName} ${submission.surname}`, 20, yPosition)
  yPosition += 8
  
  // Father's/Husband Name
  doc.text(`Father's/Husband Name: ${submission.fathersHusbandName}`, 20, yPosition)
  yPosition += 8
  
  // Sex
  doc.text(`Sex: ${submission.sex}`, 20, yPosition)
  yPosition += 8
  
  // Date of Birth
  doc.text(`Date of Birth: ${submission.dateOfBirth}`, 20, yPosition)
  yPosition += 8
  
  // Age
  doc.text(`Age: ${submission.ageYears} years ${submission.ageMonths} months`, 20, yPosition)
  yPosition += 8
  
  // Qualification
  doc.text(`Qualification: ${submission.qualification || 'Not specified'}`, 20, yPosition)
  yPosition += 8
  
  // Occupation
  doc.text(`Occupation: ${submission.occupation || 'Not specified'}`, 20, yPosition)
  yPosition += 8
  
  // Mobile Number
  doc.text(`Mobile Number: ${submission.mobileNumber}`, 20, yPosition)
  yPosition += 8
  
  // Aadhaar Number
  doc.text(`Aadhaar Number: ${submission.aadhaarNumber}`, 20, yPosition)
  yPosition += 8
  
  // Email
  doc.text(`Email: ${submission.email}`, 20, yPosition)
  yPosition += 15
  
  // Address Section
  doc.setFontSize(14)
  doc.setTextColor(0, 100, 0)
  doc.text('Address Information', 20, yPosition)
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  yPosition += 10
  
  doc.text(`District: ${submission.address.district}`, 20, yPosition)
  yPosition += 8
  doc.text(`Taluka: ${submission.address.taluka}`, 20, yPosition)
  yPosition += 8
  doc.text(`Village: ${submission.address.villageName}`, 20, yPosition)
  yPosition += 8
  doc.text(`House No: ${submission.address.houseNo}`, 20, yPosition)
  yPosition += 8
  doc.text(`Street: ${submission.address.street}`, 20, yPosition)
  yPosition += 8
  doc.text(`Pin Code: ${submission.address.pinCode}`, 20, yPosition)
  yPosition += 15
  
  // Education Section
  doc.setFontSize(14)
  doc.setTextColor(0, 100, 0)
  doc.text('Education Information', 20, yPosition)
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  yPosition += 10
  
  doc.text(`Year of Passing: ${submission.yearOfPassing}`, 20, yPosition)
  yPosition += 8
  doc.text(`Degree/Diploma: ${submission.degreeDiploma}`, 20, yPosition)
  yPosition += 8
  doc.text(`University: ${submission.nameOfUniversity}`, 20, yPosition)
  yPosition += 8
  doc.text(`Diploma: ${submission.nameOfDiploma}`, 20, yPosition)
  yPosition += 15
  
  // Additional Information
  doc.setFontSize(14)
  doc.setTextColor(0, 100, 0)
  doc.text('Additional Information', 20, yPosition)
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  yPosition += 10
  
  doc.text(`Name Changed: ${submission.haveChangedName}`, 20, yPosition)
  yPosition += 8
  doc.text(`Place: ${submission.place}`, 20, yPosition)
  yPosition += 8
  doc.text(`Declaration Date: ${submission.declarationDate}`, 20, yPosition)
  yPosition += 8
  doc.text(`Submitted At: ${new Date(submission.submittedAt).toLocaleString()}`, 20, yPosition)
  yPosition += 15
  
  // Attached Documents Section
  doc.setFontSize(14)
  doc.setTextColor(0, 100, 0)
  doc.text('Attached Documents', 20, yPosition)
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  yPosition += 10
  
  if (submission.files) {
    Object.entries(submission.files).forEach(([key, file]) => {
      if (file && file.fileName) {
        doc.text(`• ${key}: ${file.fileName}`, 20, yPosition)
        yPosition += 6
      }
    })
  }
  
  // Footer
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('Generated on: ' + new Date().toLocaleString(), 20, 280)
  doc.text('Registration ID: ' + submission.id, 20, 285)
  
  return doc
  } catch (error) {
    console.error('Error in generateStudentPDF:', error)
    throw new Error('Failed to generate student PDF: ' + (error as Error).message)
  }
}

export function generateAllStudentsPDF(submissions: SubmissionData[]): jsPDF {
  try {
    const doc = new jsPDF()
  
  // Add header
  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0)
  doc.text('Bharatiya Janata Party', 20, 30)
  doc.setFontSize(16)
  doc.text('All Student Registrations', 20, 40)
  
  // Add line separator
  doc.setLineWidth(0.5)
  doc.line(20, 45, 190, 45)
  
  // Summary
  doc.setFontSize(12)
  doc.text(`Total Registrations: ${submissions.length}`, 20, 60)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 70)
  
  let yPosition = 90
  
  submissions.forEach((submission, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 30
    }
    
    // Student header
    doc.setFontSize(14)
    doc.setTextColor(0, 100, 0)
    doc.text(`${index + 1}. ${submission.firstName} ${submission.surname}`, 20, yPosition)
    
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    yPosition += 10
    
    // Basic info
    doc.text(`ID: ${submission.id}`, 20, yPosition)
    yPosition += 6
    doc.text(`Mobile: ${submission.mobileNumber}`, 20, yPosition)
    yPosition += 6
    doc.text(`Email: ${submission.email}`, 20, yPosition)
    yPosition += 6
    doc.text(`Submitted: ${new Date(submission.submittedAt).toLocaleDateString()}`, 20, yPosition)
    yPosition += 6
    doc.text(`Address: ${submission.address.district}, ${submission.address.taluka}`, 20, yPosition)
    yPosition += 15
  })
  
  return doc
  } catch (error) {
    console.error('Error in generateAllStudentsPDF:', error)
    throw new Error('Failed to generate all students PDF: ' + (error as Error).message)
  }
}
