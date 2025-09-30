// Test script for Thank You PDF generation
const { generateThankYouPDF } = require('./lib/thank-you-pdf-generator.ts')

async function testThankYouPDFGeneration() {
  console.log('🧪 Testing Thank You PDF generation...')
  
  const testData = {
    name: 'अमोलजी पांडुरंग शिंदे',
    phone: '9876543210',
    address: 'पाचोरा, जिल्हा - नाशिक',
    district: 'नाशिक',
    padvidhar: 'पाचोरा १८',
    pin: '422001',
    signupDate: new Date().toISOString()
  }
  
  try {
    console.log('📄 Generating Thank You PDF with Marathi content...')
    const pdfPath = await generateThankYouPDF(testData)
    console.log('✅ Thank You PDF generated successfully:', pdfPath)
    console.log('📄 You can find the PDF at:', pdfPath)
    console.log('')
    console.log('🎯 Key Features:')
    console.log('✅ Marathi text content')
    console.log('✅ BJP header with logo')
    console.log('✅ Professional thank you message')
    console.log('✅ Signature section')
    console.log('✅ Proper formatting and borders')
  } catch (error) {
    console.error('❌ Thank You PDF generation failed:', error)
  }
}

// Run the test
testThankYouPDFGeneration().catch(console.error)
