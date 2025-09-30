import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import puppeteer from 'puppeteer'

export interface ThankYouPDFData {
  name: string
  phone: string
  address: string
  district: string
  padvidhar: string
  pin: string
  signupDate: string
}

export async function generateThankYouPDF(data: ThankYouPDFData): Promise<string> {
  let browser;
  try {
    console.log('🔄 Generating Thank You PDF for team member:', data.name)
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'data', 'pdfs')
    await mkdir(outputDir, { recursive: true })
    
    // Generate HTML content with Marathi text
    const htmlContent = generateThankYouHTML(data)
    
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
    
    // Set content with simpler wait condition
    await page.setContent(htmlContent, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000
    })
    
    // Wait a bit for any dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate PDF
    const pdfPath = join(outputDir, `thank-you-${data.phone}-${Date.now()}.pdf`)
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
    
    console.log('✅ Thank You PDF generated successfully:', pdfPath)
    return pdfPath
    
  } catch (error) {
    console.error('❌ Error generating Thank You PDF:', error)
    
    // Try fallback method - generate a simple HTML file instead
    try {
      console.log('🔄 Attempting fallback PDF generation...')
      const outputDir = join(process.cwd(), 'data', 'pdfs')
      await mkdir(outputDir, { recursive: true })
      
      const htmlPath = join(outputDir, `thank-you-${data.phone}-${Date.now()}.html`)
      const htmlContent = generateThankYouHTML(data)
      await writeFile(htmlPath, htmlContent)
      
      console.log('✅ Fallback HTML file created:', htmlPath)
      return htmlPath
    } catch (fallbackError) {
      console.error('❌ Fallback PDF generation also failed:', fallbackError)
      throw new Error('Failed to generate Thank You PDF: ' + (error as Error).message)
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

function getHeaderLogoBase64(): string {
  try {
    const fs = require('fs')
    const path = require('path')
    const logoPath = path.join(process.cwd(), 'public', 'placeholder-logo.png')
    const logoBuffer = fs.readFileSync(logoPath)
    return logoBuffer.toString('base64')
  } catch (error) {
    console.log('⚠️ Could not load header logo, using placeholder')
    // Return a simple placeholder base64 image
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  }
}

function generateThankYouHTML(data: ThankYouPDFData): string {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <title>Thank You - ${data.name}</title>
  <style>
    body {
      font-family: "Times New Roman", serif;
      margin: 0;
      padding: 20px;
      background: #fff;
      font-size: 14px;
      line-height: 1.6;
    }
    .document-container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border: 2px solid #000;
      padding: 30px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #000;
      padding-bottom: 20px;
      position: relative;
    }
    .header-logo {
      position: absolute;
      left: 0;
      top: 0;
      width: 100px;
      height: 100px;
      border: 2px solid #000;
    }
    .header-text {
      text-align: center;
      width: 100%;
    }
    .header-text h1 {
      margin: 5px 0;
      color: #000;
      font-size: 20px;
      font-weight: bold;
    }
    .header-text h2 {
      margin: 5px 0;
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
    .header-text h3 {
      margin: 5px 0;
      color: #666;
      font-size: 14px;
      font-weight: normal;
    }
    .content {
      margin: 20px 0;
      text-align: justify;
    }
    .content p {
      margin: 15px 0;
      text-indent: 0;
    }
    .signature-section {
      margin-top: 40px;
      text-align: right;
    }
    .signature-line {
      border-bottom: 1px solid #000;
      width: 200px;
      margin: 20px 0 5px auto;
      height: 30px;
    }
    .signature-text {
      text-align: right;
      font-weight: bold;
    }
    .date-section {
      margin-top: 20px;
      text-align: left;
    }
    .highlight {
      font-weight: bold;
      color: #000;
    }
    .marathi-text {
      font-family: "Times New Roman", serif;
      direction: ltr;
    }
  </style>
</head>
<body>
  <div class="document-container">
    <!-- HEADER -->
    <div class="header">
      <img src="data:image/png;base64,${getHeaderLogoBase64()}" alt="BJP Logo" class="header-logo" />
      <div class="header-text">
        <h1>भारतीय जनता पार्टी</h1>
        <h2>Bharatiya Janata Party</h2>
        <h3>महाराष्ट्र प्रदेश</h3>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="content marathi-text">
      <div class="date-section">
        <p><strong>दिनांक : ${currentDate}</strong></p>
      </div>

      <p><strong>श्री. ${data.name}</strong><br>
      <strong>पत्ता:</strong> ${data.address}<br>
      <strong>जिल्हा:</strong> ${data.district}<br>
      <strong>पिन कोड:</strong> ${data.pin}<br>
      <strong>मोबाइल:</strong> ${data.phone}</p>

      <p><strong>सप्रेम नमस्कार</strong></p>

      <p>भारतीय जनता पार्टी संघटन पर्व अंतर्गत राज्यभरात सुरू असणाऱ्या प्राथमिक सदस्यता नोंदणी अभियानामध्ये आपण १००० वैयक्तिक सदस्य नोंदणीची उद्दिष्ट पूर्ण केले, त्याबद्दल आपले मनःपूर्वक अभिनंदन !</p>

      <p>"राष्ट्र प्रथम, त्यानंतर पक्ष आणि शेवटी स्वतः" हा आपला भाजप परिवाराचा मूलमंत्र मनात बाळगून अंतःकरणातून दिलेले सूक्ष्म अरण्याचा आपला प्रामाणिक कटिबद्धपणा आणि अभिमानास्पद आहे.</p>

      <p>आदरणीय पंतप्रधान नरेंद्र मोदीजींच्या नेतृत्वात भारत विश्वगुरु होण्याच्या दिशेने वाटचाल करीत आहे. तसेच आदरणीय मुख्यमंत्री देवेंद्र फडणवीसजींच्या नेतृत्वात महाराष्ट्र राज्यातील विकासाचा वेग वाढवण्याच्या दृष्टीने पायाभूत कामे होत आहेत. या पार्श्वभूमीवर आपण संघटन पर्व सदस्यता अभियानात केलेल्या अथक परिश्रमामुळे भारतीय जनता पार्टी महाराष्ट्र राज्यात सशक्त आणि बळकट होत आहे.</p>

      <p>संघटन पर्वात १००० प्राथमिक सदस्यांना आपल्या भाजप परिवारामध्ये सहभागी करून घेऊन आपण केलेल्या कार्याची नोंद सोनेरी अक्षरांनी नोंदली जाईल. हे राष्ट्रहिताचे काम आहेच त्याबरोबर संघटनेला बळकट करण्याचे काम आहे.</p>

      <p>आपल्या या योगदानाबद्दल आपले पुन्हा एकदा सहर्ष अभिनंदन !</p>

      <div class="signature-section">
        <div class="signature-line"></div>
        <div class="signature-text">
          <p>आपलाच,</p>
          <p><strong>रविंद्र चव्हाण</strong></p>
          <p>भाजपा महाराष्ट्र प्रदेश कार्यकरी अध्यक्ष</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
}
