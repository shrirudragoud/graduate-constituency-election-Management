// Simple PDF generator using browser's print functionality as fallback
export interface SimpleSubmissionData {
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

export function generateSimpleStudentPDF(submission: SimpleSubmissionData): void {
  try {
    // Create a new window with the student data formatted for printing
    const printWindow = window.open('', '_blank')
    
    if (!printWindow) {
      throw new Error('Unable to open print window')
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Registration - ${submission.firstName} ${submission.surname}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #0066cc;
            margin: 0;
            font-size: 24px;
          }
          .header h2 {
            color: #666;
            margin: 5px 0 0 0;
            font-size: 18px;
            font-weight: normal;
          }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section-title {
            background-color: #f0f8ff;
            color: #0066cc;
            padding: 8px 12px;
            margin: 0 0 15px 0;
            font-weight: bold;
            border-left: 4px solid #0066cc;
          }
          .field {
            margin-bottom: 8px;
            display: flex;
          }
          .field-label {
            font-weight: bold;
            min-width: 150px;
            color: #555;
          }
          .field-value {
            flex: 1;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Bharatiya Janata Party</h1>
          <h2>Student Registration Form</h2>
        </div>

        <div class="section">
          <div class="section-title">Personal Information</div>
          <div class="field">
            <div class="field-label">Name:</div>
            <div class="field-value">${submission.firstName} ${submission.surname}</div>
          </div>
          <div class="field">
            <div class="field-label">Father's/Husband Name:</div>
            <div class="field-value">${submission.fathersHusbandName}</div>
          </div>
          <div class="field">
            <div class="field-label">Sex:</div>
            <div class="field-value">${submission.sex}</div>
          </div>
          <div class="field">
            <div class="field-label">Date of Birth:</div>
            <div class="field-value">${submission.dateOfBirth}</div>
          </div>
          <div class="field">
            <div class="field-label">Age:</div>
            <div class="field-value">${submission.ageYears} years ${submission.ageMonths} months</div>
          </div>
          <div class="field">
            <div class="field-label">Qualification:</div>
            <div class="field-value">${submission.qualification || 'Not specified'}</div>
          </div>
          <div class="field">
            <div class="field-label">Occupation:</div>
            <div class="field-value">${submission.occupation || 'Not specified'}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Contact Information</div>
          <div class="field">
            <div class="field-label">Mobile Number:</div>
            <div class="field-value">${submission.mobileNumber}</div>
          </div>
          <div class="field">
            <div class="field-label">Aadhaar Number:</div>
            <div class="field-value">${submission.aadhaarNumber}</div>
          </div>
          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${submission.email}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Address Information</div>
          <div class="field">
            <div class="field-label">District:</div>
            <div class="field-value">${submission.address.district}</div>
          </div>
          <div class="field">
            <div class="field-label">Taluka:</div>
            <div class="field-value">${submission.address.taluka}</div>
          </div>
          <div class="field">
            <div class="field-label">Village:</div>
            <div class="field-value">${submission.address.villageName}</div>
          </div>
          <div class="field">
            <div class="field-label">House No:</div>
            <div class="field-value">${submission.address.houseNo}</div>
          </div>
          <div class="field">
            <div class="field-label">Street:</div>
            <div class="field-value">${submission.address.street}</div>
          </div>
          <div class="field">
            <div class="field-label">Pin Code:</div>
            <div class="field-value">${submission.address.pinCode}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Education Information</div>
          <div class="field">
            <div class="field-label">Year of Passing:</div>
            <div class="field-value">${submission.yearOfPassing}</div>
          </div>
          <div class="field">
            <div class="field-label">Degree/Diploma:</div>
            <div class="field-value">${submission.degreeDiploma}</div>
          </div>
          <div class="field">
            <div class="field-label">University:</div>
            <div class="field-value">${submission.nameOfUniversity}</div>
          </div>
          <div class="field">
            <div class="field-label">Diploma:</div>
            <div class="field-value">${submission.nameOfDiploma}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Additional Information</div>
          <div class="field">
            <div class="field-label">Name Changed:</div>
            <div class="field-value">${submission.haveChangedName}</div>
          </div>
          <div class="field">
            <div class="field-label">Place:</div>
            <div class="field-value">${submission.place}</div>
          </div>
          <div class="field">
            <div class="field-label">Declaration Date:</div>
            <div class="field-value">${submission.declarationDate}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Attached Documents</div>
          ${submission.files ? Object.entries(submission.files).map(([key, file]) => 
            file && file.fileName ? `<div class="field"><div class="field-label">${key}:</div><div class="field-value">${file.fileName}</div></div>` : ''
          ).join('') : '<div class="field-value">No documents attached</div>'}
        </div>

        <div class="footer">
          <p>Registration ID: ${submission.id}</p>
          <p>Submitted on: ${new Date(submission.submittedAt).toLocaleString()}</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>

        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Print / Save as PDF
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.print()
    }, 500)

  } catch (error) {
    console.error('Error generating simple PDF:', error)
    throw new Error('Failed to generate PDF: ' + (error as Error).message)
  }
}

export function generateSimpleAllStudentsPDF(submissions: SimpleSubmissionData[]): void {
  try {
    const printWindow = window.open('', '_blank')
    
    if (!printWindow) {
      throw new Error('Unable to open print window')
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>All Student Registrations - ${new Date().toLocaleDateString()}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #0066cc;
            margin: 0;
            font-size: 24px;
          }
          .header h2 {
            color: #666;
            margin: 5px 0 0 0;
            font-size: 18px;
            font-weight: normal;
          }
          .summary {
            background-color: #f0f8ff;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
          }
          .student {
            border: 1px solid #ddd;
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 5px;
            page-break-inside: avoid;
          }
          .student-header {
            font-weight: bold;
            color: #0066cc;
            font-size: 16px;
            margin-bottom: 10px;
          }
          .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 14px;
          }
          .info-item {
            display: flex;
          }
          .info-label {
            font-weight: bold;
            min-width: 100px;
            color: #555;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Bharatiya Janata Party</h1>
          <h2>All Student Registrations</h2>
        </div>

        <div class="summary">
          <p><strong>Total Registrations:</strong> ${submissions.length}</p>
          <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
        </div>

        ${submissions.map((submission, index) => `
          <div class="student">
            <div class="student-header">${index + 1}. ${submission.firstName} ${submission.surname}</div>
            <div class="student-info">
              <div class="info-item">
                <div class="info-label">ID:</div>
                <div>${submission.id}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Mobile:</div>
                <div>${submission.mobileNumber}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email:</div>
                <div>${submission.email}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Submitted:</div>
                <div>${new Date(submission.submittedAt).toLocaleDateString()}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Address:</div>
                <div>${submission.address.district}, ${submission.address.taluka}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Qualification:</div>
                <div>${submission.qualification || 'Not specified'}</div>
              </div>
            </div>
          </div>
        `).join('')}

        <div class="footer">
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>

        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Print / Save as PDF
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.print()
    }, 500)

  } catch (error) {
    console.error('Error generating simple all students PDF:', error)
    throw new Error('Failed to generate PDF: ' + (error as Error).message)
  }
}
