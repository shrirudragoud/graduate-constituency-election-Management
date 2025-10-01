import { writeFile, mkdir, readFile } from 'fs/promises'
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
    console.log('🔄 Generating Improved Student Form PDF for submission:', submission.id)
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'data', 'pdfs')
    await mkdir(outputDir, { recursive: true })
    
    // Get ECI logo as base64
    const eciLogoBase64 = await getECILogoBase64()
    
    // Process uploaded photos
    const processedPhotos = await processUploadedPhotos(submission.files)
    
    // Generate HTML content
    const htmlContent = generateImprovedStudentFormHTML(submission, eciLogoBase64, processedPhotos)
    
    // Launch Puppeteer
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
      timeout: 60000
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
    page.setDefaultTimeout(30000)
    
    // Set content
    await page.setContent(htmlContent, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000
    })
    
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 2000))
    
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
    
    console.log('✅ Improved Student Form PDF generated successfully:', pdfPath)
    return pdfPath
    
  } catch (error) {
    console.error('❌ Error generating Improved Student Form PDF:', error)
    
    // Try fallback method
    try {
      console.log('🔄 Attempting fallback PDF generation...')
      const outputDir = join(process.cwd(), 'data', 'pdfs')
      await mkdir(outputDir, { recursive: true })
      
      const eciLogoBase64 = await getECILogoBase64()
      const processedPhotos = await processUploadedPhotos(submission.files)
      const htmlContent = generateImprovedStudentFormHTML(submission, eciLogoBase64, processedPhotos)
      
      const htmlPath = join(outputDir, `student-form-${submission.id}.html`)
      await writeFile(htmlPath, htmlContent)
      
      console.log('✅ Fallback HTML file created:', htmlPath)
      return htmlPath
    } catch (fallbackError) {
      console.error('❌ Fallback PDF generation also failed:', fallbackError)
      throw new Error('Failed to generate Student Form PDF: ' + (error as Error).message)
    }
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

async function getECILogoBase64(): Promise<string> {
  try {
    const eciLogoPath = join(process.cwd(), 'ECI.png')
    const logoBuffer = await readFile(eciLogoPath)
    return `data:image/png;base64,${logoBuffer.toString('base64')}`
  } catch (error) {
    console.log('⚠️ Could not load ECI logo:', error)
    return ''
  }
}

async function processUploadedPhotos(files: Record<string, any>): Promise<Record<string, string>> {
  const processedPhotos: Record<string, string> = {}
  
  for (const [fieldName, fileInfo] of Object.entries(files)) {
    if (fileInfo && fileInfo.path && fileInfo.originalName) {
      try {
        const fileBuffer = await readFile(fileInfo.path)
        const base64 = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`
        processedPhotos[fieldName] = base64
        console.log(`✅ Processed photo: ${fieldName}`)
      } catch (error) {
        console.log(`⚠️ Could not process photo ${fieldName}:`, error)
      }
    }
  }
  
  return processedPhotos
}

function generateImprovedStudentFormHTML(
  submission: StudentSubmissionData, 
  eciLogoBase64: string, 
  processedPhotos: Record<string, string>
): string {
  const currentDate = new Date().toLocaleDateString('en-GB')
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Form-18 | ECI - ${submission.firstName} ${submission.surname}</title>
  <style>
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: "Times New Roman", serif;
      margin: 0;
      padding: 15px;
      background: #fff;
      font-size: 11px;
      line-height: 1.3;
      color: #000;
    }
    
    .form-container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border: 3px solid #000;
      padding: 20px;
      position: relative;
    }
    
    .header {
      text-align: center;
      margin-bottom: 25px;
      position: relative;
      border-bottom: 2px solid #000;
      padding-bottom: 15px;
    }
    
    .eci-logo {
      position: absolute;
      left: 0;
      top: 0;
      width: 60px;
      height: 60px;
      border: 2px solid #000;
      background: #fff;
    }
    
    .eci-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .header h1 {
      margin: 5px 0;
      font-size: 18px;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .header h2 {
      margin: 5px 0;
      font-size: 16px;
      font-weight: bold;
    }
    
    .header h3 {
      margin: 5px 0;
      font-size: 14px;
      font-weight: normal;
    }
    
    .photo-section {
      float: right;
      width: 100px;
      height: 120px;
      border: 2px solid #000;
      margin: 10px 0 20px 20px;
      text-align: center;
      font-size: 9px;
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
      font-size: 8px;
      line-height: 1.2;
    }
    
    .form-content {
      clear: both;
    }
    
    .section {
      margin: 12px 0;
      border: 1px solid #ddd;
      padding: 10px;
      background: #f9f9f9;
    }
    
    .section-title {
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 8px;
      text-decoration: underline;
      color: #000;
    }
    
    .field-row {
      display: flex;
      margin: 6px 0;
      align-items: center;
    }
    
    .field-label {
      font-weight: bold;
      min-width: 120px;
      margin-right: 10px;
    }
    
    .field-value {
      border-bottom: 1px solid #000;
      flex: 1;
      padding: 2px 5px;
      min-height: 18px;
      background: #fff;
    }
    
    .field-value-long {
      border-bottom: 1px solid #000;
      flex: 1;
      padding: 2px 5px;
      min-height: 18px;
      background: #fff;
      min-width: 300px;
    }
    
    .photos-section {
      margin-top: 20px;
      page-break-inside: avoid;
    }
    
    .supporting-doc-page {
      width: 100%;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      margin: 0;
      padding: 0;
    }
    
    .doc-page-content {
      width: 90%;
      height: 90%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .doc-title {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 30px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .doc-image-wrapper {
      flex: 1;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
    }
    
    .doc-full-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border: 1px solid #ddd;
    }
    
    .doc-signature-area {
      width: 100%;
      text-align: center;
    }
    
    .doc-signature-line {
      border-bottom: 2px solid #000;
      width: 200px;
      margin: 0 auto 10px auto;
    }
    
    .doc-signature-text {
      font-size: 12px;
      font-style: italic;
    }
    
    .signature-section {
      margin-top: 30px;
      text-align: right;
    }
    
    .signature-line {
      border-bottom: 1px solid #000;
      width: 200px;
      margin: 5px 0;
      display: inline-block;
    }
    
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 10px;
      border-top: 1px solid #000;
      padding-top: 10px;
    }
    
    @media print {
      body { margin: 0; padding: 10px; }
      .form-container { border: 2px solid #000; }
    }
  </style>
</head>
<body>
  <div class="form-container">
    <div class="header">
      ${eciLogoBase64 ? `<div class="eci-logo"><img src="${eciLogoBase64}" alt="ECI Logo"></div>` : ''}
      <h1>Election Commission of India</h1>
      <h2>Form-18</h2>
      <h3>Application for Inclusion of Name in Electoral Roll</h3>
    </div>
    
    <div class="photo-section">
      ${processedPhotos.idPhoto ? 
        `<img src="${processedPhotos.idPhoto}" alt="ID Photo">` : 
        `<div class="photo-placeholder">ID Photo<br>Not Provided</div>`
      }
    </div>
    
    <div class="form-content">
      <div class="section">
        <div class="section-title">Personal Details</div>
        <div class="field-row">
          <div class="field-label">Surname:</div>
          <div class="field-value">${submission.surname}</div>
        </div>
        <div class="field-row">
          <div class="field-label">First Name:</div>
          <div class="field-value">${submission.firstName}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Father's/Husband's Name:</div>
          <div class="field-value-long">${submission.fathersHusbandName}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Sex:</div>
          <div class="field-value">${submission.sex === 'M' ? 'Male' : 'Female'}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Date of Birth:</div>
          <div class="field-value">${submission.dateOfBirth}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Age:</div>
          <div class="field-value">${submission.ageYears} years ${submission.ageMonths} months</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Address Details</div>
        <div class="field-row">
          <div class="field-label">House No:</div>
          <div class="field-value">${submission.houseNo}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Street:</div>
          <div class="field-value-long">${submission.street}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Village/Town:</div>
          <div class="field-value-long">${submission.villageName}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Taluka:</div>
          <div class="field-value">${submission.taluka}</div>
        </div>
        <div class="field-row">
          <div class="field-label">District:</div>
          <div class="field-value">${submission.district}</div>
        </div>
        <div class="field-row">
          <div class="field-label">PIN Code:</div>
          <div class="field-value">${submission.pinCode}</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Contact & Identification</div>
        <div class="field-row">
          <div class="field-label">Mobile Number:</div>
          <div class="field-value">${submission.mobileNumber}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Email:</div>
          <div class="field-value-long">${submission.email || 'Not Provided'}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Aadhaar Number:</div>
          <div class="field-value-long">${submission.aadhaarNumber}</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Educational Details</div>
        <div class="field-row">
          <div class="field-label">Qualification:</div>
          <div class="field-value">${submission.qualification || 'Not Provided'}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Degree/Diploma:</div>
          <div class="field-value">${submission.degreeDiploma || 'Not Provided'}</div>
        </div>
        <div class="field-row">
          <div class="field-label">University:</div>
          <div class="field-value-long">${submission.nameOfUniversity || 'Not Provided'}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Year of Passing:</div>
          <div class="field-value">${submission.yearOfPassing || 'Not Provided'}</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Additional Information</div>
        <div class="field-row">
          <div class="field-label">Occupation:</div>
          <div class="field-value">${submission.occupation || 'Not Provided'}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Name Changed:</div>
          <div class="field-value">${submission.haveChangedName}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Place:</div>
          <div class="field-value">${submission.place}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Declaration Date:</div>
          <div class="field-value">${submission.declarationDate}</div>
        </div>
      </div>
      
      ${Object.keys(processedPhotos).length > 1 ? `
      ${Object.entries(processedPhotos)
        .filter(([key]) => key !== 'idPhoto')
        .map(([key, base64]) => `
          <div class="supporting-doc-page" style="page-break-before: always;">
            <div class="doc-page-content">
              <div class="doc-title">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
              <div class="doc-image-wrapper">
                <img src="${base64}" alt="${key}" class="doc-full-image">
              </div>
              <div class="doc-signature-area">
                <div class="doc-signature-line"></div>
                <div class="doc-signature-text">Signature</div>
              </div>
            </div>
          </div>
        `).join('')}
      ` : ''}
      
      <div class="signature-section">
        <div class="field-row">
          <div class="field-label">Applicant's Signature:</div>
          <div class="signature-line"></div>
        </div>
        <div class="field-row">
          <div class="field-label">Date:</div>
          <div class="field-value">${currentDate}</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Form ID:</strong> ${submission.id}</p>
      <p><strong>Submitted on:</strong> ${new Date(submission.submittedAt).toLocaleString('en-GB')}</p>
      <p>This is a computer-generated form. Please keep this for your records.</p>
    </div>
  </div>
</body>
</html>`
}
