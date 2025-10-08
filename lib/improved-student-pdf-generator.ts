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
    console.log('🔄 Generating Improved Voter Form PDF for submission:', submission.id)
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'data', 'pdfs')
    await mkdir(outputDir, { recursive: true })
    
    // Get ECI logo as base64
    const eciLogoBase64 = await getECILogoBase64()
    
    // Process uploaded photos
    console.log('🔍 Files received for PDF generation:', submission.files)
    const processedPhotos = await processUploadedPhotos(submission.files)
    console.log('🔍 Processed photos result:', Object.keys(processedPhotos))
    
    // Generate HTML content
    const htmlContent = generateImprovedStudentFormHTML(submission, eciLogoBase64, processedPhotos)
    
    // Launch Puppeteer
    const launchOptions: any = {
      headless: 'new',
      executablePath: '/usr/bin/google-chrome', // Use system Chrome
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--font-render-hinting=none',
        '--disable-font-subpixel-positioning'
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
      waitUntil: 'networkidle0',
      timeout: 30000
    })
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Ensure fonts are loaded
    try {
      await page.evaluateHandle('document.fonts.ready')
      console.log('✅ Fonts loaded successfully')
    } catch (error) {
      console.log('⚠️ Font loading check failed, continuing with fallback fonts')
    }
    
    // Generate PDF
    const pdfPath = join(outputDir, `student-form-${submission.id}.pdf`)
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      timeout: 30000
    })
    
    console.log('✅ Improved Voter Form PDF generated successfully:', pdfPath)
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
      try {
        await browser.close()
        console.log('✅ Browser closed successfully')
      } catch (closeError) {
        console.error('❌ Error closing browser:', closeError)
      }
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
  
  console.log('🔍 Processing uploaded photos. Files received:', Object.keys(files))
  
  for (const [fieldName, fileInfo] of Object.entries(files)) {
    console.log(`🔍 Processing field: ${fieldName}`, fileInfo)
    
    if (fileInfo && fileInfo.path && fileInfo.originalName) {
      try {
        const fileBuffer = await readFile(fileInfo.path)
        
        // Determine MIME type based on file extension
        const fileExtension = fileInfo.originalName.split('.').pop()?.toLowerCase()
        let mimeType = 'image/jpeg' // default
        if (fileExtension === 'png') {
          mimeType = 'image/png'
        } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
          mimeType = 'image/jpeg'
        }
        
        const base64 = `data:${mimeType};base64,${fileBuffer.toString('base64')}`
        processedPhotos[fieldName] = base64
        console.log(`✅ Processed photo: ${fieldName} (${mimeType})`)
      } catch (error) {
        console.log(`⚠️ Could not process photo ${fieldName}:`, error)
      }
    } else {
      console.log(`⚠️ Skipping ${fieldName}: missing path or originalName`, fileInfo)
    }
  }
  
  console.log('🔍 Final processed photos:', Object.keys(processedPhotos))
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
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: "Roboto", "Arial", "Helvetica", "sans-serif", "Times New Roman", serif;
      margin: 0;
      padding: 0;
      background: #fff;
      font-size: 10px;
      line-height: 1.2;
      color: #000;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .marathi {
      font-family: "Noto Sans", "Arial", "sans-serif";
      font-size: 9px;
    }
    
    .form-container {
      width: 100%;
      max-width: 21cm;
      margin: 0 auto;
      background: #fff;
      border: 1px solid #000;
      padding: 15px;
      position: relative;
    }
    
    .header {
      text-align: center;
      margin-bottom: 20px;
      position: relative;
      border-bottom: 1px solid #000;
      padding-bottom: 10px;
    }
    
    .eci-logo {
      position: absolute;
      left: 0;
      top: 0;
      width: 50px;
      height: 50px;
      border: 1px solid #000;
      background: #fff;
    }
    
    .eci-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .header h1 {
      margin: 2px 0;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .header h2 {
      margin: 2px 0;
      font-size: 12px;
      font-weight: bold;
    }
    
    .header h3 {
      margin: 2px 0;
      font-size: 10px;
      font-weight: normal;
    }
    
    .photo-section {
      float: right;
      width: 45mm;
      height: 35mm;
      border: 1px solid #000;
      margin: 5px 0 10px 10px;
      text-align: center;
      font-size: 8px;
      padding: 2px;
      background: #fff;
      display: flex;
      flex-direction: column;
    }
    
    .photo-section img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      max-width: 100%;
      max-height: 100%;
    }
    
    .photo-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #666;
      font-size: 7px;
      line-height: 1.1;
      text-align: center;
    }
    
    .form-content {
      clear: both;
    }
    
    .section {
      margin: 8px 0;
      padding: 5px;
    }
    
    .section-title {
      font-weight: bold;
      font-size: 10px;
      margin-bottom: 5px;
      color: #000;
    }
    
    .field-row {
      display: flex;
      margin: 3px 0;
      align-items: center;
      min-height: 15px;
    }
    
    .field-label {
      font-weight: bold;
      min-width: 80px;
      margin-right: 5px;
      font-size: 9px;
    }
    
    .field-value {
      border-bottom: 1px solid #000;
      flex: 1;
      padding: 1px 3px;
      min-height: 15px;
      background: #fff;
      font-size: 9px;
    }
    
    .field-value-long {
      border-bottom: 1px solid #000;
      flex: 1;
      padding: 1px 3px;
      min-height: 15px;
      background: #fff;
      min-width: 200px;
      font-size: 9px;
    }
    
    .checkbox-field {
      display: flex;
      align-items: center;
      margin: 2px 0;
    }
    
    .checkbox {
      width: 10px;
      height: 10px;
      border: 1px solid #000;
      margin-right: 5px;
      display: inline-block;
    }
    
    .checkbox.checked {
      background: #000;
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
      <h1>ELECTION COMMISSION OF INDIA</h1>
      <h2>Form-18 (See Rule 31)</h2>
      <h3>Claim for inclusion of name in the electoral roll for a Graduates' Constituency</h3>
    </div>
    
    <div class="photo-section">
      <div style="font-size: 6px; margin-bottom: 2px; line-height: 1.1;"><br><br><br><br><br><br><br></div>
      ${processedPhotos.idPhoto ? 
        `<img src="${processedPhotos.idPhoto}" alt="ID Photo" style="max-width: 100%; height: auto;">` : 
        `<div class="photo-placeholder">Photo<br>Not Provided</div>`
      }
    </div>
    
    <div class="form-content">
      <div style="margin-bottom: 10px;">
        <div style="font-size: 9px; margin-bottom: 5px;">
          <strong>To.<br>
          The Electoral Registration Officer,<br>
          (Graduates) Constituency.<br><br>
          Sir,<br>
          I request that my name be registered in the Electoral Roll for the<br>
          (Graduates') Constituency.</strong>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">1. The particulars are :-</div>
        <div class="field-row">
          <div class="field-label">Full Name</div>
          <div class="field-value">${submission.firstName} ${submission.surname}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Father's/Mother's/Husband's Name (in full)</div>
          <div class="field-value-long">${submission.fathersHusbandName}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Qualification</div>
          <div class="field-value">${submission.qualification || 'Not Provided'}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Occupation</div>
          <div class="field-value">${submission.occupation || 'Not Provided'}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Sex</div>
          <div class="field-value">${submission.sex === 'M' ? 'Male' : 'Female'}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Date of Birth</div>
          <div class="field-value">${submission.dateOfBirth}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Age</div>
          <div class="field-value">${submission.ageYears} Years ${submission.ageMonths} Months</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">House Address (Place of ordinary residence)</div>
        <div class="field-row">
          <div class="field-label">House/Building/Apartment No.</div>
          <div class="field-value">${submission.houseNo}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Street/Mohalla</div>
          <div class="field-value-long">${submission.street}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Town/Village</div>
          <div class="field-value-long">${submission.villageName}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Police Station/Tehsil/Taluqa/Mouza</div>
          <div class="field-value">${submission.taluka}</div>
        </div>
        <div class="field-row">
          <div class="field-label">District</div>
          <div class="field-value">${submission.district}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Post Office</div>
          <div class="field-value">${submission.pinCode}</div>
        </div>
        <div class="field-row">
          <div class="field-label">State</div>
          <div class="field-value">Maharashtra</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Contact Number :-</div>
        <div class="field-row">
          <div class="field-label">Mobile No. (optional)</div>
          <div class="field-value">${submission.mobileNumber}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Email Id (if any)</div>
          <div class="field-value-long">${submission.email || 'Not Provided'}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Aadhaar Number</div>
          <div class="field-value-long">${submission.aadhaarNumber}</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">2. Educational Qualification:</div>
        <div style="font-size: 9px; margin: 5px 0;">
          I am a graduate of the ${submission.nameOfUniversity || 'University'} having passed the degree/diploma examination in ${submission.degreeDiploma || 'Graduation'} in the year ${submission.yearOfPassing || 'Not Provided'}.
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">3. Supporting Documents:</div>
        <div style="font-size: 9px; margin: 5px 0;">
          In support of my claim as being a graduate/in possession of the above diploma/certificate. I submit herewith the following documents:
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">4. Declaration:</div>
        <div style="font-size: 9px; margin: 5px 0;">
          My name has not been included in the electoral roll for this or any other graduates' constituency.
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">5. Final Declaration:</div>
        <div style="font-size: 9px; margin: 5px 0;">
          I declare that I am a citizen of India and that all the particulars given above are true to the best of my knowledge and belief.
        </div>
      </div>
      
      <div class="signature-section" style="margin-top: 20px;">
        <div style="margin: 10px 0;">
          <span style="font-size: 9px;">Place</span>
          <div style="display: inline-block; width: 100px; border-bottom: 1px solid #000; margin: 0 10px;"></div>
          <span style="font-size: 9px;">Date</span>
          <div style="display: inline-block; width: 100px; border-bottom: 1px solid #000; margin: 0 10px;"></div>
        </div>
        <div style="margin: 10px 0;">
          <span style="font-size: 9px;">Signature of claimant</span>
        </div>
      </div>
      
      <!-- NOTE and Form ID section - at bottom of ECI Form-18 -->
      <div class="footer" style="margin-top: 30px; font-size: 8px; text-align: left; border-top: 1px solid #000; padding-top: 10px;">
        <div style="margin-bottom: 5px;">
          <strong>NOTE:</strong> Any person who makes a statement or declaration which is false and which he either knows or believes to be false or does not believe to be true is punishable under section 31 of the Representation of the People Act, 1950
        </div>
        <div style="margin-top: 10px; font-size: 7px; text-align: center;">
          <strong>Form ID:</strong> ${submission.id} | <strong>Generated:</strong> ${new Date(submission.submittedAt).toLocaleString('en-GB')}
        </div>
      </div>
      
      ${Object.keys(processedPhotos).length > 1 ? `
      ${Object.entries(processedPhotos)
        .filter(([key]) => key !== 'idPhoto')
        .map(([key, base64]) => `
          <div style="page-break-before: always; width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; margin: 0; padding: 20px;">
            <div style="width: 90%; height: 90%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 20px; text-transform: uppercase;">
                ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
              <div style="flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <img src="${base64}" alt="${key}" style="max-width: 100%; max-height: 100%; object-fit: contain; border: 1px solid #ddd;">
              </div>
              <div style="width: 100%; text-align: center;">
                <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 10px auto;"></div>
                <div style="font-size: 12px; font-style: italic;">Signature</div>
              </div>
            </div>
          </div>
        `).join('')}
      ` : ''}
    </div>
  </div>
</body>
</html>`
}
