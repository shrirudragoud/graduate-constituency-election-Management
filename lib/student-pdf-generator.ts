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
        console.log('✅ ID photo processed for PDF with base64 conversion')
      } catch (error) {
        console.log('⚠️ Could not process ID photo:', error)
        // Try to get base64 from existing data if available
        if (submission.files.idPhoto.base64) {
          console.log('✅ Using existing base64 data for ID photo')
        } else {
          console.log('❌ No ID photo data available')
        }
      }
    } else if (submission.files.idPhoto && submission.files.idPhoto.base64) {
      console.log('✅ ID photo base64 data already available')
    } else {
      console.log('⚠️ No ID photo provided')
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

function getECILogoBase64(): string {
  try {
    const fs = require('fs')
    const path = require('path')
    const logoPath = path.join(process.cwd(), 'ECI.png')
    const logoBuffer = fs.readFileSync(logoPath)
    return logoBuffer.toString('base64')
  } catch (error) {
    console.log('⚠️ Could not load ECI logo, using placeholder')
    // Return a simple placeholder base64 image
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
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
      margin: 0;
      padding: 20px;
      background: #fff;
      font-size: 12px;
      line-height: 1.4;
    }
    .form-container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border: 2px solid #000;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      position: relative;
      border-bottom: 2px solid #000;
      padding-bottom: 15px;
    }
    .header-logo {
      position: absolute;
      left: 0;
      top: 0;
      width: 80px;
      height: 80px;
      border: 1px solid #000;
    }
    .header h1 {
      margin: 5px 0;
      font-size: 16px;
      font-weight: bold;
    }
    .header h2 {
      margin: 5px 0;
      font-size: 14px;
      font-weight: bold;
    }
    .header h3 {
      margin: 5px 0;
      font-size: 12px;
      font-weight: normal;
    }
    .photo-section {
      float: right;
      width: 120px;
      height: 150px;
      border: 1px solid #000;
      margin: 10px 0 20px 20px;
      text-align: center;
      font-size: 10px;
      padding: 5px;
      background: #fff;
    }
    .photo-section img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .photo-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #666;
      font-size: 9px;
      line-height: 1.2;
    }
    .form-content {
      clear: both;
    }
    .section {
      margin: 15px 0;
    }
    .section p {
      margin: 8px 0;
    }
    .field-line {
      border-bottom: 1px solid #000;
      display: inline-block;
      min-width: 200px;
      margin: 0 5px;
      padding-bottom: 2px;
    }
    .field-line-long {
      border-bottom: 1px solid #000;
      display: inline-block;
      min-width: 300px;
      margin: 0 5px;
      padding-bottom: 2px;
    }
    .checkbox {
      font-size: 14px;
      margin-right: 5px;
    }
    .checkbox-section {
      margin-left: 20px;
    }
    .declaration {
      border: 2px solid #000;
      padding: 15px;
      margin: 20px 0;
      background: #f9f9f9;
    }
    .office-use {
      border: 2px solid #000;
      padding: 15px;
      margin: 20px 0;
      background: #f0f0f0;
    }
    .section {
      margin: 15px 0;
      padding: 15px;
      border: 1px solid #000;
      background: #fff;
    }
    .main-section {
      border: 2px solid #000;
      padding: 20px;
      margin: 20px 0;
      background: #fafafa;
    }
    .signature-line {
      display: flex;
      justify-content: space-between;
      margin: 15px 0;
    }
    .perforation {
      border-top: 2px dashed #000;
      margin: 20px 0;
      padding-top: 10px;
    }
    .note {
      font-size: 10px;
      margin-top: 10px;
    }
    .clear {
      clear: both;
    }
  </style>
</head>
<body>
  <div class="form-container">
    <!-- HEADER -->
    <div class="header">
      <img src="data:image/png;base64,${getECILogoBase64()}" alt="ECI Logo" class="header-logo" />
      <h1>Form-18</h1>
      <h1>(See Rule 31)</h1>
      <h2>ELECTION COMMISSION OF INDIA</h2>
      <h3>Claim for inclusion of name in the electoral roll for a Graduates' Constituency</h3>
    </div>

    <!-- PHOTO SECTION -->
    <div class="photo-section">
      ${submission.files.idPhoto && submission.files.idPhoto.base64 ? 
        `<img src="data:image/jpeg;base64,${submission.files.idPhoto.base64}" alt="ID Photo" />` :
        `<div class="photo-placeholder">
          Space for pasting<br>one recent<br>passport size<br>colour photo (4.6 cm)<br>full face with<br>white background
        </div>`
      }
    </div>

    <!-- FORM CONTENT -->
    <div class="form-content">
      <div class="main-section">
        <p><strong>To,</strong></p>
        <p>The Electoral Registration Officer,</p>
        <p>(Graduates) Constituency.</p>
        <p><strong>Sir,</strong></p>
        <p>I request that my name be registered in the electoral roll for the <span class="field-line">${submission.district}</span> (Graduates') Constituency.</p>
      </div>

      <div class="main-section">
        <p><strong>1. The particulars are:-</strong></p>
        <p>Full Name <span class="field-line-long">${submission.firstName} ${submission.surname}</span></p>
        <p>Father's/Mother's/Husband's Name (in full) <span class="field-line-long">${submission.fathersHusbandName}</span></p>
        
        <p>Sex <span class="field-line">${submission.sex}</span> Qualification <span class="field-line">${submission.qualification || ''}</span> Occupation <span class="field-line">${submission.occupation || ''}</span></p>
        
        <p>House Address (Place of ordinary residence)</p>
        <p>House/Building/Apartment No. <span class="field-line">${submission.houseNo}</span> Street/ Mohalla <span class="field-line">${submission.street}</span></p>
        <p>Town/Village <span class="field-line">${submission.villageName}</span> Post Office <span class="field-line"></span></p>
        <p>Police Station/Tehsil/Taluka/Mouza <span class="field-line">${submission.taluka}</span></p>
        <p>District <span class="field-line">${submission.district}</span> State <span class="field-line"></span></p>
        
        <p>Age <span class="field-line">${submission.ageYears}</span> Years <span class="field-line">${submission.ageMonths}</span> Months</p>
        
        <p>Disability (if any):- (Tick appropriate box) (optional Field)</p>
        <div class="checkbox-section">
          <p><span class="checkbox">☐</span> Visual impairment <span class="checkbox">☐</span> Speech & hearing disability <span class="checkbox">☐</span> Locomotor disability <span class="checkbox">☐</span> Other</p>
        </div>
        
        <p>Whether registered as an elector for any assembly constituency <span class="checkbox">☐</span> If yes, then mention the following---</p>
        <p>(a) Number and Name of the Assembly constituency <span class="field-line-long"></span></p>
        <p>(b) Part/Polling Station No.(if known) <span class="field-line-long"></span></p>
        <p>(c) Date of Birth <span class="field-line">${new Date(submission.dateOfBirth).toLocaleDateString('en-GB')}</span></p>
        <p>(d) EPIC Number (if any) <span class="field-line-long"></span></p>
        
        <p><strong>Aadhaar Details:- (Please tick the appropriate box)</strong></p>
        <p>(a) Aadhaar Number <span class="field-line-long">${submission.aadhaarNumber}</span> or</p>
        <p>(b) <span class="checkbox">☐</span> I am not able to furnish my Aadhaar Number because I don't have Aadhaar Number</p>
        
        <p><strong>Contact Number :-</strong></p>
        <p>Mobile No. (optional) <span class="field-line">${submission.mobileNumber}</span> Landline <span class="field-line"></span></p>
        <p>Email Id (if any) <span class="field-line-long">${submission.email || ''}</span></p>
      </div>

      <div class="main-section">
        <p><strong>2. *I am a graduate of the <span class="field-line">${submission.nameOfUniversity}</span> University having passed the degree/diploma examination in the year <span class="field-line">${submission.yearOfPassing}</span></span></p>
        
        <p><strong>OR</strong></p>
        
        <p><strong>*I am in possession of a diploma/certificate in <span class="field-line">${submission.nameOfDiploma || ''}</span> which is a qualification equivalent to that of a graduate University in India having passed the examination for the diploma/certificate in the year <span class="field-line"></span></strong></p>
      </div>

      <div class="main-section">
        <p><strong>3. In support of my claim as being a graduate/in possession of the above diploma/certificate. I submit herewith <span class="field-line-long">Degree/Diploma Certificate, Aadhaar Card, Residential Proof, Signature Photo</span></strong></p>
      </div>

      <div class="main-section">
        <p><strong>4. *My name has not been included in the electoral roll for this or any other graduates' constituency.</strong></p>
        <p><strong>OR</strong></p>
        <p><strong>**My name has been included in the electoral roll for the <span class="field-line">${submission.district}</span> graduates' constituency under the address given below and I request that it be deleted from that roll</strong></p>
        <p><span class="field-line-long"></span></p>
        <p><span class="field-line-long"></span></p>
      </div>

      <div class="declaration">
        <p><strong>5. I declare that I am a citizen of India and that all the particulars given above are true to the best of my knowledge and belief.</strong></p>
        <div class="signature-line">
          <p>Place <span class="field-line">${submission.place}</span></p>
          <p>Date <span class="field-line">${new Date(submission.declarationDate).toLocaleDateString('en-GB')}</span></p>
          <p>Signature of claimant <span class="field-line-long"></span></p>
        </div>
        <div class="note">
          <p><strong>NOTE :</strong> Any person who makes a statement or declaration which is false and which he either knows or believes to be false or does not believe to be true is punishable under section 31 of the Representation of the People Act, 1950.</p>
          <p>*Strike off the paragraph not applicable.</p>
          <p>**Strike off the inappropriate alternative.</p>
        </div>
      </div>

      <div class="perforation"></div>

      <div class="office-use">
        <p><strong>Intimation of action taken</strong></p>
        <p>The application in Form 18 of Shri/Smt./Kumari <span class="field-line-long">${submission.firstName} ${submission.surname}</span> address <span class="field-line-long"></span> has been—</p>
        <p>(a) accepted and the name of Shri/Smt./Kumari <span class="field-line-long"></span> has been registered at Serial No. <span class="field-line">${submission.id}</span> in Part No. <span class="field-line"></span></p>
        <p>(b) rejected for the reason <span class="field-line-long"></span></p>
        <p><span class="field-line-long"></span></p>
        <p>Date <span class="field-line">${currentDate}</span></p>
        <p>Electoral Registration Officer, (Address) <span class="field-line-long"></span></p>
      </div>

      <div class="perforation"></div>

      <div class="office-use">
        <p><strong>Receipt of application</strong></p>
        <p>Received the application in Form 18 from Shri/ Smt./Kumari* <span class="field-line-long">${submission.firstName} ${submission.surname}</span> address* <span class="field-line-long"></span></p>
        <p><span class="field-line-long"></span></p>
        <p>Date <span class="field-line">${currentDate}</span></p>
        <p><span class="field-line-long"></span></p>
        <p><span class="field-line-long"></span></p>
        <p>*To be filled in by the applicant</p>
        <p>Electoral Registration Officer, (Address) <span class="field-line-long"></span></p>
      </div>
    </div>
  </div>
</body>
</html>`
}
