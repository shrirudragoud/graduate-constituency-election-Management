import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import puppeteer from 'puppeteer'

export interface ECISubmissionData {
  id: string
  fullname: string
  guardian: string
  qualification: string
  occupation: string
  address: string
  house: string
  town: string
  ps: string
  street: string
  dob: string
  disability: string
  assembly: string
  polling: string
  dob2: string
  epic: string
  aadhaar: string
  noAadhaar: boolean
  mobile: string
  landline: string
  email: string
  gradyear: string
  university: string
  degree: string
  diploma: string
  dipyear: string
  supportdoc: string
  notIncluded: boolean
  includedElsewhere: boolean
  gradconst: string
  place: string
  date: string
  applicant: string
  partno: string
  reason: string
  officedate: string
  recapp: string
  recdate: string
  serial: string
  officer: string
  files: Record<string, any>
  submittedAt: string
}

export async function generateECIFormPDF(submission: ECISubmissionData): Promise<string> {
  let browser;
  try {
    console.log('🔄 Generating ECI Form PDF for submission:', submission.id)
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'data', 'pdfs')
    await mkdir(outputDir, { recursive: true })
    
    // Generate HTML content with form data
    const htmlContent = generateECIFormHTML(submission)
    
    // Launch Puppeteer with better configuration
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
      timeout: 60000 // 60 second timeout for browser launch
    })
    
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
    const pdfPath = join(outputDir, `eci-form-${submission.id}.pdf`)
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
    
    console.log('✅ ECI Form PDF generated successfully:', pdfPath)
    return pdfPath
    
  } catch (error) {
    console.error('❌ Error generating ECI Form PDF:', error)
    
    // Try fallback method - generate a simple HTML file instead
    try {
      console.log('🔄 Attempting fallback PDF generation...')
      const outputDir = join(process.cwd(), 'data', 'pdfs')
      await mkdir(outputDir, { recursive: true })
      
      const htmlPath = join(outputDir, `eci-form-${submission.id}.html`)
      const htmlContent = generateECIFormHTML(submission)
      await writeFile(htmlPath, htmlContent)
      
      console.log('✅ Fallback HTML file created:', htmlPath)
      return htmlPath
    } catch (fallbackError) {
      console.error('❌ Fallback PDF generation also failed:', fallbackError)
      throw new Error('Failed to generate ECI Form PDF: ' + (error as Error).message)
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

function generateECIFormHTML(submission: ECISubmissionData): string {
  // Get current date for office use if not provided
  const currentDate = new Date().toLocaleDateString('en-GB')
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Form-18 | ECI</title>
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
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 2px solid #000;
      padding-bottom: 10px;
      margin-bottom: 10px;
      position: relative;
    }
    .header img {
      position: absolute;
      left: 0;
      top: 0;
      width: 90px;
    }
    .header-text {
      text-align: center;
      width: 100%;
    }
    .header-text h2, .header-text h3 {
      margin: 5px 0;
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
      border-bottom: 1px dotted #000;
      padding-bottom: 2px;
    }
    .checkbox {
      font-size: 16px;
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
      Space for pasting<br>one recent<br>passport size<br>colour photo (4.6 cm)<br>full face with<br>white background
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

      <p>Full Name: <span class="var-field">${submission.fullname || ''}</span></p>
      <p>Father's/Mother's/Husband's Name (in full): <span class="var-field">${submission.guardian || ''}</span></p>
      <p>Qualification: <span class="var-field">${submission.qualification || ''}</span></p>
      <p>Occupation: <span class="var-field">${submission.occupation || ''}</span></p>
      <p>House Address (place of ordinary residence): <span class="var-field">${submission.address || ''}</span></p>
      <p>House/Building/Apartment No.: <span class="var-field">${submission.house || ''}</span>  
         Town/Village: <span class="var-field">${submission.town || ''}</span></p>
      <p>Police Station/Tehsil/Taluka/Mouza: <span class="var-field">${submission.ps || ''}</span></p>
      <p>Street/Mohalla: <span class="var-field">${submission.street || ''}</span></p>
      <p>Date of Birth (DD/MM/YYYY): <span class="var-field">${submission.dob || ''}</span></p>

      <p><strong>Disability (if any):</strong> (Tick appropriate box)</p>
      <div class="checkboxes">
        <span class="checkbox">${submission.disability === 'speech' ? '☑' : '☐'}</span> Speech & hearing disability<br>
        <span class="checkbox">${submission.disability === 'locomotor' ? '☑' : '☐'}</span> Locomotor disability<br>
        <span class="checkbox">${submission.disability === 'other' ? '☑' : '☐'}</span> Other
      </div>

      <p><strong>Whether registered as an Elector for any Assembly Constituency:</strong><br>
        (a) Number and Name of the Assembly Constituency <span class="var-field">${submission.assembly || ''}</span><br>
        (b) Part/Polling Station No. (if known) <span class="var-field">${submission.polling || ''}</span><br>
        (c) Date of Birth <span class="var-field">${submission.dob2 || ''}</span><br>
        (d) EPIC Number (if any) <span class="var-field">${submission.epic || ''}</span>
      </p>

      <p><strong>Aadhaar Details:</strong><br>
        Aadhaar Number: <span class="var-field">${submission.aadhaar || ''}</span><br>
        <span class="checkbox">${submission.noAadhaar ? '☑' : '☐'}</span> I am not able to furnish my Aadhaar Number because I don't have Aadhaar Number.
      </p>

      <p>Mobile No. (optional): <span class="var-field">${submission.mobile || ''}</span>  
         Landline: <span class="var-field">${submission.landline || ''}</span></p>
      <p>Email ID (if any): <span class="var-field">${submission.email || ''}</span></p>

      <p>"I am a graduate of the year <span class="var-field">${submission.gradyear || ''}</span> from <span class="var-field">${submission.university || ''}</span> University, having passed the degree/diploma examination in <span class="var-field">${submission.degree || ''}</span>"</p>

      <p>"OR I am in possession of a diploma/certificate <span class="var-field">${submission.diploma || ''}</span> which is a qualification equivalent to that of a graduate in India, having passed in the year <span class="var-field">${submission.dipyear || ''}</span>"</p>

      <p>3. In support of my claim as being a graduate in possession of the above diploma/certificate, I submit herewith <span class="var-field">${submission.supportdoc || ''}</span></p>

      <p>4. <span class="checkbox">${submission.notIncluded ? '☑' : '☐'}</span> My name has not been included in the electoral roll for this or any other graduates' constituency.<br>
      OR<br>
      <span class="checkbox">${submission.includedElsewhere ? '☑' : '☐'}</span> My name has been included in the electoral roll for the address given below and I request that it be deleted from that roll.</p>

      <p>Graduates' constituency under the <span class="var-field">${submission.gradconst || ''}</span></p>
    </div>

    <!-- DECLARATION -->
    <div class="declaration">
      <p>5. I declare that I am a citizen of India and that all the particulars given above are true to the best of my knowledge and belief.</p>
      <div class="signature">
        <div>Place: <span class="var-field">${submission.place || ''}</span></div>
        <div>Date: <span class="var-field">${submission.date || currentDate}</span></div>
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
      <p>The application in Form 18 of Shri/Smt/Kumari <span class="var-field">${submission.applicant || submission.fullname || ''}</span> (address) has been:</p>
      <p><span class="checkbox">☐</span> accepted and the name of Shri/Smt/Kumari included in Part No. <span class="var-field">${submission.partno || ''}</span><br>
      <span class="checkbox">☐</span> rejected for the reason <span class="var-field">${submission.reason || ''}</span></p>
      <p>Date: <span class="var-field">${submission.officedate || currentDate}</span></p>

      <hr>

      <p>(Perforation) Receipt of application</p>
      <p>Received the application in Form 18 from Shri/Smt/Kumari <span class="var-field">${submission.recapp || submission.fullname || ''}</span> (address)</p>
      <p>Date: <span class="var-field">${submission.recdate || currentDate}</span></p>
      <p>* To be filled in by the applicant</p>
      <p>Has been registered at Serial No. <span class="var-field">${submission.serial || submission.id}</span></p>
      <p>Electoral Registration Officer (Address) <span class="var-field">${submission.officer || ''}</span></p>
    </div>
  </div>
</body>
</html>`
}
