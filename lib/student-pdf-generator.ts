import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import puppeteer from 'puppeteer'

export interface StudentSubmissionData {
  id: string
  surname: string
  firstName: string
  fathersHusbandName: string
  fathersHusbandFullName?: string
  sex: string
  qualification?: string
  occupation?: string
  dateOfBirth: string
  ageYears: number
  ageMonths: number
  district: string
  taluka: string
  villageName: string
  houseNo: string
  street: string
  pinCode: string
  mobileNumber: string
  aadhaarNumber: string
  email?: string
  yearOfPassing: string
  degreeDiploma: string
  nameOfUniversity: string
  nameOfDiploma?: string
  haveChangedName: string
  place: string
  declarationDate: string
  files: Record<string, any>
  submittedAt: string
}

export async function generateStudentFormPDF(submission: StudentSubmissionData): Promise<string> {
  let browser;
  try {
    console.log('🔄 Generating Student Form PDF for submission:', submission.id)
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'data', 'pdfs')
    await mkdir(outputDir, { recursive: true })
    
    // Process ID photo if available
    if (submission.files.idPhoto && submission.files.idPhoto.path) {
      try {
        const fs = require('fs')
        const imageBuffer = fs.readFileSync(submission.files.idPhoto.path)
        submission.files.idPhoto.base64 = imageBuffer.toString('base64')
        console.log('✅ ID photo processed for PDF')
      } catch (error) {
        console.log('⚠️ Could not process ID photo:', error)
      }
    }
    
    // Generate HTML content with form data
    const htmlContent = generateStudentFormHTML(submission)
    
    // Launch Puppeteer with better configuration
    const launchOptions: any = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ],
      timeout: 60000 // 60 second timeout for browser launch
    }

    // Try to use system Chrome if available
    const systemChromePaths = [
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium'
    ]

    for (const chromePath of systemChromePaths) {
      try {
        const fs = require('fs')
        if (fs.existsSync(chromePath)) {
          launchOptions.executablePath = chromePath
          console.log('✅ Using system Chrome:', chromePath)
          break
        }
      } catch (error) {
        // Continue to next path
      }
    }

    browser = await puppeteer.launch(launchOptions)
    
    const page = await browser.newPage()
    
    // Set viewport and timeout
    await page.setViewport({ width: 1200, height: 800 })
    page.setDefaultTimeout(30000) // 30 second timeout for operations
    
    // Set content with simpler wait condition
    await page.setContent(htmlContent, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000
    })
    
    // Wait a bit for any dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate PDF
    const pdfPath = join(outputDir, `student-form-${submission.id}.pdf`)
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      timeout: 30000
    })
    
    console.log('✅ Student Form PDF generated successfully:', pdfPath)
    return pdfPath
    
  } catch (error) {
    console.error('❌ Error generating Student Form PDF:', error)
    
    // Try fallback method - generate a simple HTML file instead
    try {
      console.log('🔄 Attempting fallback PDF generation...')
      const outputDir = join(process.cwd(), 'data', 'pdfs')
      await mkdir(outputDir, { recursive: true })
      
      const htmlPath = join(outputDir, `student-form-${submission.id}.html`)
      const htmlContent = generateStudentFormHTML(submission)
      await writeFile(htmlPath, htmlContent)
      
      console.log('✅ Fallback HTML file created:', htmlPath)
      return htmlPath
    } catch (fallbackError) {
      console.error('❌ Fallback PDF generation also failed:', fallbackError)
      throw new Error('Failed to generate Student Form PDF: ' + (error as Error).message)
    }
  } finally {
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('❌ Error closing browser:', closeError)
      }
    }
  }
}

function generateStudentFormHTML(submission: StudentSubmissionData): string {
  // Get current date for office use if not provided
  const currentDate = new Date().toLocaleDateString('en-GB')
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Form-18 | ECI - ${submission.firstName} ${submission.surname}</title>
  <style>
    body {
      font-family: "Times New Roman", serif;
      margin: 20px;
      background: #fff;
    }
    .form-container {
      border: 2px solid #000;
      padding: 25px 35px;
      max-width: 850px;
      margin: auto;
      line-height: 1.8;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 3px solid #000;
      padding-bottom: 15px;
      margin-bottom: 20px;
      position: relative;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 20px;
      border-radius: 8px 8px 0 0;
    }
    .header img {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 80px;
      height: 80px;
      border: 2px solid #000;
      border-radius: 8px;
      background: #fff;
      padding: 5px;
    }
    .header-text {
      text-align: center;
      width: 100%;
    }
    .header-text h2 {
      margin: 5px 0;
      color: #000;
      font-size: 24px;
      font-weight: bold;
    }
    .header-text h3 {
      margin: 5px 0;
      color: #333;
      font-size: 18px;
      font-weight: normal;
    }
    .photo-box {
      width: 140px;
      height: 170px;
      border: 1px solid #000;
      text-align: center;
      font-size: 12px;
      padding: 5px;
      float: right;
      margin: 15px 0 20px 20px;
      position: relative;
      background: #f8f9fa;
    }
    .photo-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 2px;
    }
    .photo-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #666;
      font-size: 10px;
      line-height: 1.3;
    }
    .section {
      margin-top: 20px;
      clear: both;
    }
    .section p {
      margin: 12px 0;
    }
    .checkboxes {
      margin-left: 20px;
    }
    .declaration, .office-use {
      border: 1px solid #000;
      padding: 15px;
      margin-top: 30px;
    }
    .signature {
      display: flex;
      justify-content: space-between;
      margin-top: 25px;
    }
    .note {
      font-size: 12px;
      margin-top: 15px;
      border-top: 1px dashed #000;
      padding-top: 10px;
    }
    hr {
      border: none;
      border-top: 1px dashed #000;
      margin: 10px 0;
    }
    .var-field {
      display: inline-block;
      min-width: 250px;
      border-bottom: 2px solid #000;
      padding-bottom: 3px;
      font-weight: bold;
      color: #000;
      background: #f8f9fa;
      padding: 2px 5px;
      border-radius: 3px;
    }
    .checkbox {
      font-size: 16px;
    }
    .student-info {
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
      padding: 20px;
      border: 2px solid #1976d2;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .student-info h4 {
      margin: 0 0 10px 0;
      color: #495057;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .info-item {
      display: flex;
      margin-bottom: 8px;
    }
    .info-label {
      font-weight: bold;
      min-width: 120px;
      color: #495057;
    }
    .info-value {
      flex: 1;
      color: #212529;
    }
  </style>
</head>
<body>
  <div class="form-container">
    <!-- HEADER -->
    <div class="header">
      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjkwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjQ1IiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FQ0kgTG9nbzwvdGV4dD4KPC9zdmc+" alt="ECI Logo">
      <div class="header-text">
        <h2>Form-18 (See Rule 31)</h2>
        <h2>ELECTION COMMISSION OF INDIA</h2>
        <h3>Claim for inclusion of name in the electoral roll<br>for a Graduates' Constituency</h3>
      </div>
    </div>

    <!-- PHOTO BOX BELOW HEADER -->
    <div class="photo-box">
      ${submission.files.idPhoto ? 
        `<img src="data:image/jpeg;base64,${submission.files.idPhoto.base64 || 'placeholder'}" alt="ID Photo" />` :
        `<div class="photo-placeholder">
          Space for pasting<br>one recent<br>passport size<br>colour photo (4.6 cm)<br>full face with<br>white background
        </div>`
      }
    </div>

    <!-- STUDENT INFORMATION SUMMARY -->
    <div class="student-info">
      <h4>📋 Registration Summary</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Registration ID:</span>
          <span class="info-value">${submission.id}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Submitted On:</span>
          <span class="info-value">${new Date(submission.submittedAt).toLocaleDateString('en-GB')}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Full Name:</span>
          <span class="info-value">${submission.firstName} ${submission.surname}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Mobile:</span>
          <span class="info-value">${submission.mobileNumber}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Email:</span>
          <span class="info-value">${submission.email || 'Not provided'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">District:</span>
          <span class="info-value">${submission.district}</span>
        </div>
      </div>
    </div>

    <!-- FORM BODY -->
    <div class="section">
      <p><strong>To,</strong><br>
      The Electoral Registration Officer,<br>
      (Graduates) Constituency.</p>
    </div>

    <div class="section">
      <p>I request that my name be registered in the Electoral Roll for the Graduates' Constituency.  
      The particulars are:—</p>

      <p>Full Name: <span class="var-field">${submission.firstName} ${submission.surname}</span></p>
      <p>Father's/Mother's/Husband's Name (in full): <span class="var-field">${submission.fathersHusbandName}</span></p>
      <p>Qualification: <span class="var-field">${submission.qualification || 'Not specified'}</span></p>
      <p>Occupation: <span class="var-field">${submission.occupation || 'Not specified'}</span></p>
      <p>House Address (place of ordinary residence): <span class="var-field">${submission.villageName}, ${submission.taluka}, ${submission.district}</span></p>
      <p>House/Building/Apartment No.: <span class="var-field">${submission.houseNo}</span>  
         Town/Village: <span class="var-field">${submission.villageName}</span></p>
      <p>Police Station/Tehsil/Taluka/Mouza: <span class="var-field">${submission.taluka}</span></p>
      <p>Street/Mohalla: <span class="var-field">${submission.street}</span></p>
      <p>Date of Birth (DD/MM/YYYY): <span class="var-field">${new Date(submission.dateOfBirth).toLocaleDateString('en-GB')}</span></p>

      <p><strong>Disability (if any):</strong> (Tick appropriate box)</p>
      <div class="checkboxes">
        <span class="checkbox">☐</span> Speech & hearing disability<br>
        <span class="checkbox">☐</span> Locomotor disability<br>
        <span class="checkbox">☐</span> Other
      </div>

      <p><strong>Whether registered as an Elector for any Assembly Constituency:</strong><br>
        (a) Number and Name of the Assembly Constituency <span class="var-field">_________________</span><br>
        (b) Part/Polling Station No. (if known) <span class="var-field">_________________</span><br>
        (c) Date of Birth <span class="var-field">_________________</span><br>
        (d) EPIC Number (if any) <span class="var-field">_________________</span>
      </p>

      <p><strong>Aadhaar Details:</strong><br>
        Aadhaar Number: <span class="var-field">${submission.aadhaarNumber}</span><br>
        <span class="checkbox">☐</span> I am not able to furnish my Aadhaar Number because I don't have Aadhaar Number.
      </p>

      <p>Mobile No. (optional): <span class="var-field">${submission.mobileNumber}</span>  
         Landline: <span class="var-field">_________________</span></p>
      <p>Email ID (if any): <span class="var-field">${submission.email || 'Not provided'}</span></p>

      <p>"I am a graduate of the year <span class="var-field">${submission.yearOfPassing}</span> from <span class="var-field">${submission.nameOfUniversity}</span> University, having passed the degree/diploma examination in <span class="var-field">${submission.degreeDiploma}</span>"</p>

      <p>"OR I am in possession of a diploma/certificate <span class="var-field">${submission.nameOfDiploma || 'Not applicable'}</span> which is a qualification equivalent to that of a graduate in India, having passed in the year <span class="var-field">_________________</span>"</p>

      <p>3. In support of my claim as being a graduate in possession of the above diploma/certificate, I submit herewith <span class="var-field">Degree/Diploma Certificate, Aadhaar Card, Residential Proof, Signature Photo</span></p>

      <p>4. <span class="checkbox">${submission.haveChangedName === 'No' ? '☑' : '☐'}</span> My name has not been included in the electoral roll for this or any other graduates' constituency.<br>
      OR<br>
      <span class="checkbox">${submission.haveChangedName === 'Yes' ? '☑' : '☐'}</span> My name has been included in the electoral roll for the address given below and I request that it be deleted from that roll.</p>

      <p>Graduates' constituency under the <span class="var-field">${submission.district} District</span></p>
    </div>

    <!-- DECLARATION -->
    <div class="declaration">
      <p>5. I declare that I am a citizen of India and that all the particulars given above are true to the best of my knowledge and belief.</p>
      <div class="signature">
        <div>Place: <span class="var-field">${submission.place}</span></div>
        <div>Date: <span class="var-field">${new Date(submission.declarationDate).toLocaleDateString('en-GB')}</span></div>
        <div>Signature of Claimant: __________________</div>
      </div>
      <div class="note">
        NOTE: Any person who makes a false statement is punishable under section 31 of the Representation of the People Act, 1950.<br>
        * Strike off the paragraph not applicable.<br>
        * Strike off the inappropriate alternative.
      </div>
    </div>

    <!-- OFFICE USE -->
    <div class="office-use">
      <h4>(For Office Use Only)</h4>
      <p>The application in Form 18 of Shri/Smt/Kumari <span class="var-field">${submission.firstName} ${submission.surname}</span> (address) has been:</p>
      <p><span class="checkbox">☐</span> accepted and the name of Shri/Smt/Kumari included in Part No. <span class="var-field">_________________</span><br>
      <span class="checkbox">☐</span> rejected for the reason <span class="var-field">_________________</span></p>
      <p>Date: <span class="var-field">${currentDate}</span></p>

      <hr>

      <p>(Perforation) Receipt of application</p>
      <p>Received the application in Form 18 from Shri/Smt/Kumari <span class="var-field">${submission.firstName} ${submission.surname}</span> (address)</p>
      <p>Date: <span class="var-field">${currentDate}</span></p>
      <p>* To be filled in by the applicant</p>
      <p>Has been registered at Serial No. <span class="var-field">${submission.id}</span></p>
      <p>Electoral Registration Officer (Address) <span class="var-field">_________________</span></p>
    </div>
  </div>
</body>
</html>`
}
