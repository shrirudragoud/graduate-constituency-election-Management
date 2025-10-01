import { readFile } from 'fs/promises'
import { join } from 'path'

export interface TeamSignupPDFData {
  name: string
  phone: string
  address: string
  district: string
  pin: string
  padvidhar: string
  submittedAt: Date
}

export async function generateTeamSignupPDF(data: TeamSignupPDFData): Promise<string> {
  try {
    console.log('📄 Generating Team Signup Thank You PDF for:', data.name)
    
    // Read header image and convert to base64
    const headerPath = join(process.cwd(), 'header.png')
    const headerBuffer = await readFile(headerPath)
    const headerBase64 = `data:image/png;base64,${headerBuffer.toString('base64')}`
    
    // Format the date in Marathi format
    const currentDate = new Date()
    const day = currentDate.getDate().toString().padStart(2, '0')
    const month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()
    
    const marathiMonths = [
      'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
      'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
    ]
    
    const formattedDate = `दिनांक : ${day} ${marathiMonths[month - 1]} ${year}`
    
    // Create HTML content for the PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="mr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Team Signup Thank You Letter</title>
        <style>
            @page {
                margin: 0.5in;
                size: A4;
            }
            
            body {
                font-family: 'Arial Unicode MS', 'Noto Sans Devanagari', Arial, sans-serif;
                line-height: 1.6;
                color: #000;
                margin: 0;
                padding: 0;
                background: #fff;
            }
            
            .letter-container {
                max-width: 100%;
                margin: 0 auto;
                background: #fff;
            }
            
            .header-section {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .header-image {
                max-width: 100%;
                height: auto;
                margin-bottom: 20px;
            }
            
            .date-section {
                text-align: right;
                margin-bottom: 20px;
                font-size: 14px;
                font-weight: bold;
            }
            
            .recipient-section {
                margin-bottom: 20px;
                font-size: 14px;
                line-height: 1.8;
            }
            
            .recipient-name {
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 5px;
            }
            
            .recipient-designation {
                font-size: 14px;
                margin-bottom: 3px;
            }
            
            .salutation {
                font-size: 14px;
                margin-bottom: 20px;
                font-weight: bold;
            }
            
            .letter-body {
                font-size: 14px;
                line-height: 1.8;
                text-align: justify;
                margin-bottom: 20px;
            }
            
            .paragraph {
                margin-bottom: 15px;
                text-indent: 0;
            }
            
            .congratulations {
                font-weight: bold;
                margin-bottom: 15px;
            }
            
            .closing-section {
                margin-top: 30px;
                text-align: right;
            }
            
            .closing-text {
                font-size: 14px;
                margin-bottom: 20px;
            }
            
            .signature-section {
                text-align: right;
                margin-top: 30px;
            }
            
            .signature-name {
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 5px;
            }
            
            .signature-title {
                font-size: 14px;
                font-style: italic;
            }
            
            .footer-section {
                margin-top: 40px;
                font-size: 10px;
                text-align: center;
                color: #666;
                border-top: 1px solid #ccc;
                padding-top: 10px;
            }
            
            .highlight {
                font-weight: bold;
                color: #d32f2f;
            }
        </style>
    </head>
    <body>
        <div class="letter-container">
            <!-- Header Section -->
            <div class="header-section">
                <img src="${headerBase64}" alt="BJP Header" class="header-image">
            </div>
            
            <!-- Date -->
            <div class="date-section">
                ${formattedDate}
            </div>
            
            <!-- Recipient Information -->
            <div class="recipient-section">
                <div class="recipient-name">श्री. ${data.name}</div>
                <div class="recipient-designation">${data.padvidhar}</div>
                <div class="recipient-designation">${data.address}</div>
                <div class="recipient-designation">${data.district} - ${data.pin}</div>
            </div>
            
            <!-- Salutation -->
            <div class="salutation">सप्रेम नमस्कार</div>
            
            <!-- Letter Body -->
            <div class="letter-body">
                <div class="paragraph">
                    भारतीय जनता पार्टी संघटन पर्व अंतर्गत राज्यभरात सुरू असणाऱ्या प्राथमिक सदस्यता नोंदणी अभियानामध्ये आपण <span class="highlight">१००० वैयक्तिक सदस्य नोंदणीची उद्दिष्ट पूर्ण केले</span>, त्याबद्दल आपले मनःपूर्वक अभिनंदन !
                </div>
                
                <div class="paragraph">
                    "राष्ट्र प्रथम, त्यानंतर पक्ष आणि शेवटी स्वतः" हा आपला भाजप परिवाराचा मूलमंत्र मनात बाळगून अंतःकरणातून दिलेले सूक्ष्म अरण्याचा आपला प्रामाणिक कटिबद्धपणा आणि अभिमानास्पद आहे.
                </div>
                
                <div class="paragraph">
                    आदरणीय पंतप्रधान नरेंद्र मोदीजींच्या नेतृत्वात भारत विश्वगुरु होण्याच्या दिशेने वाटचाल करीत आहे. तसेच आदरणीय मुख्यमंत्री देवेंद्र फडणवीसजींच्या नेतृत्वात महाराष्ट्र राज्यातील विकासाचा वेग वाढवण्याच्या दृष्टीने पायाभूत कामे होत आहेत. या पार्श्वभूमीवर आपण संघटन पर्व सदस्यता अभियानात केलेल्या अथक परिश्रमामुळे भारतीय जनता पार्टी महाराष्ट्र राज्यात सशक्त आणि बळकट होत आहे.
                </div>
                
                <div class="paragraph">
                    संघटन पर्वात <span class="highlight">१००० प्राथमिक सदस्यांना</span> आपल्या भाजप परिवारामध्ये सहभागी करून घेऊन आपण केलेल्या कार्याची नोंद सोनेरी अक्षरांनी नोंदली जाईल. हे राष्ट्रहिताचे काम आहेच त्याबरोबर संघटनेला बळकट करण्याचे काम आहे.
                </div>
                
                <div class="congratulations">
                    आपल्या या योगदानाबद्दल आपले पुन्हा एकदा सहर्ष अभिनंदन !
                </div>
            </div>
            
            <!-- Closing and Signature -->
            <div class="closing-section">
                <div class="closing-text">आपलाच,</div>
                <div class="signature-section">
                    <div class="signature-name">रविंद्र चव्हाण</div>
                    <div class="signature-title">भाजपा महाराष्ट्र प्रदेश कार्यकरी अध्यक्ष</div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer-section">
                <div>Form ID: ${data.phone}-${data.submittedAt.getTime()}</div>
                <div>Generated on: ${data.submittedAt.toLocaleString('en-GB')}</div>
                <div>This is a computer-generated thank you letter. Please keep this for your records.</div>
            </div>
        </div>
    </body>
    </html>
    `
    
    // Create PDF using Puppeteer
    const puppeteer = await import('puppeteer')
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
    
    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'data', 'pdfs')
    await import('fs').then(fs => fs.promises.mkdir(uploadsDir, { recursive: true }))
    
    // Generate unique filename
    const timestamp = Date.now()
    const filename = `team-thank-you-${data.phone}-${timestamp}.pdf`
    const filepath = join(uploadsDir, filename)
    
    // Generate PDF
    await page.pdf({
      path: filepath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    })
    
    await browser.close()
    
    console.log('✅ Team Signup Thank You PDF generated successfully:', filepath)
    return filepath
    
  } catch (error) {
    console.error('❌ Team Signup PDF generation failed:', error)
    throw error
  }
}
