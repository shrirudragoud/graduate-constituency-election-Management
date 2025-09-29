// Script to check and detect the best domain for file sharing
const { domainDetector } = require('../lib/domain-detector.ts')

async function checkDomain() {
  console.log('🔍 Checking domain configuration...')
  
  try {
    const domainInfo = await domainDetector.detectBestDomain()
    
    console.log('\n📊 Domain Detection Results:')
    console.log('================================')
    console.log('Base URL:', domainInfo.baseUrl)
    console.log('Is Production:', domainInfo.isProduction)
    console.log('Is Localhost:', domainInfo.isLocalhost)
    console.log('Detected Domain:', domainInfo.detectedDomain)
    
    if (domainInfo.isLocalhost) {
      console.log('\n⚠️  WARNING: Using localhost URL')
      console.log('   PDF sharing via WhatsApp will be limited')
      console.log('   Consider using ngrok or deploying to get a public URL')
      console.log('\n💡 To use ngrok:')
      console.log('   1. Install ngrok: https://ngrok.com/download')
      console.log('   2. Run: ngrok http 3000')
      console.log('   3. Copy the https URL and set NEXT_PUBLIC_BASE_URL')
    } else {
      console.log('\n✅ Good! Using public domain')
      console.log('   PDF sharing should work properly')
    }
    
    // Test file URL
    const testFileUrl = await domainDetector.getFileUrl('test-file.pdf')
    console.log('\n📁 Test file URL:', testFileUrl)
    
    // Check external accessibility
    console.log('\n🔍 Checking external accessibility...')
    const isAccessible = await domainDetector.verifyExternalAccessibility(domainInfo.baseUrl)
    console.log('External accessibility:', isAccessible ? '✅ Yes' : '❌ No')
    
  } catch (error) {
    console.error('❌ Domain detection failed:', error)
  }
}

// Run the check
checkDomain().catch(console.error)

