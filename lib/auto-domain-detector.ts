import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

export interface DomainInfo {
  baseUrl: string
  isProduction: boolean
  isLocalhost: boolean
  detectedDomain?: string
  source: string
}

export class AutoDomainDetector {
  private static instance: AutoDomainDetector
  private domainInfo: DomainInfo | null = null
  private envFilePath: string

  private constructor() {
    this.envFilePath = join(process.cwd(), '.env.local')
  }

  public static getInstance(): AutoDomainDetector {
    if (!AutoDomainDetector.instance) {
      AutoDomainDetector.instance = new AutoDomainDetector()
    }
    return AutoDomainDetector.instance
  }

  /**
   * Detect domain from request headers (most reliable method)
   */
  public detectFromRequest(request: any): DomainInfo {
    const host = request.headers.get('host') || request.headers.host
    const protocol = request.headers.get('x-forwarded-proto') || 
                    request.headers.get('x-forwarded-protocol') || 
                    (request.secure ? 'https' : 'http')
    
    if (host) {
      const baseUrl = `${protocol}://${host}`
      const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
      
      const domainInfo: DomainInfo = {
        baseUrl,
        isProduction: !isLocalhost,
        isLocalhost,
        detectedDomain: host,
        source: 'request_headers'
      }
      
      console.log('🌐 Domain detected from request:', domainInfo)
      this.domainInfo = domainInfo
      this.saveDomainToEnv(domainInfo)
      return domainInfo
    }
    
    return this.getFallbackDomain()
  }

  /**
   * Detect domain from environment variables
   */
  public detectFromEnvironment(): DomainInfo {
    console.log('🔍 Detecting domain from environment...')
    
    // Check various environment variables
    const envSources = [
      { key: 'NEXT_PUBLIC_BASE_URL', prefix: '' },
      { key: 'VERCEL_URL', prefix: 'https://' },
      { key: 'RAILWAY_PUBLIC_DOMAIN', prefix: 'https://' },
      { key: 'LIGHTNING_CLOUDSPACE_HOST', prefix: 'https://' },
      { key: 'HOSTNAME', prefix: 'https://' }
    ]

    for (const source of envSources) {
      const value = process.env[source.key]
      if (value && !value.includes('localhost') && !value.includes('127.0.0.1')) {
        const baseUrl = value.startsWith('http') ? value : `${source.prefix}${value}`
        const domainInfo: DomainInfo = {
          baseUrl,
          isProduction: true,
          isLocalhost: false,
          detectedDomain: value,
          source: `env_${source.key}`
        }
        
        console.log(`✅ Domain detected from ${source.key}:`, domainInfo)
        this.domainInfo = domainInfo
        this.saveDomainToEnv(domainInfo)
        return domainInfo
      }
    }

    return this.getFallbackDomain()
  }

  /**
   * Detect domain from external services
   */
  public async detectFromExternal(): Promise<DomainInfo> {
    console.log('🔍 Detecting domain from external services...')
    
    try {
      // Try to get our external IP and construct a domain
      const response = await fetch('https://httpbin.org/ip', { timeout: 5000 })
      if (response.ok) {
        const data = await response.json()
        const externalIP = data.origin
        
        // Check if we're on a known cloud platform
        const cloudDomains = [
          `https://${process.env.HOSTNAME}.cloudspaces.litng.ai`,
          `https://${process.env.HOSTNAME}.railway.app`,
          `https://${process.env.HOSTNAME}.vercel.app`
        ]
        
        for (const domain of cloudDomains) {
          try {
            const testResponse = await fetch(`${domain}/api/health`, { timeout: 3000 })
            if (testResponse.ok) {
              const domainInfo: DomainInfo = {
                baseUrl: domain,
                isProduction: true,
                isLocalhost: false,
                detectedDomain: domain,
                source: 'external_detection'
              }
              
              console.log('✅ Domain detected from external service:', domainInfo)
              this.domainInfo = domainInfo
              this.saveDomainToEnv(domainInfo)
              return domainInfo
            }
          } catch (error) {
            // Continue to next domain
          }
        }
      }
    } catch (error) {
      console.log('⚠️ External domain detection failed:', error)
    }

    return this.getFallbackDomain()
  }

  /**
   * Get the best available domain
   */
  public async getBestDomain(request?: any): Promise<DomainInfo> {
    if (this.domainInfo) {
      return this.domainInfo
    }

    // Try request headers first (most reliable)
    if (request) {
      const requestDomain = this.detectFromRequest(request)
      if (!requestDomain.isLocalhost) {
        // Verify the domain is accessible
        const isAccessible = await this.verifyExternalAccessibility(requestDomain.baseUrl)
        if (isAccessible) {
          return requestDomain
        } else {
          console.log('⚠️ Request domain not accessible, trying other methods')
        }
      }
    }

    // Try environment variables
    const envDomain = this.detectFromEnvironment()
    if (!envDomain.isLocalhost) {
      // Verify the domain is accessible
      const isAccessible = await this.verifyExternalAccessibility(envDomain.baseUrl)
      if (isAccessible) {
        return envDomain
      } else {
        console.log('⚠️ Environment domain not accessible, trying other methods')
      }
    }

    // Try external detection
    const externalDomain = await this.detectFromExternal()
    if (!externalDomain.isLocalhost) {
      // Verify the domain is accessible
      const isAccessible = await this.verifyExternalAccessibility(externalDomain.baseUrl)
      if (isAccessible) {
        return externalDomain
      } else {
        console.log('⚠️ External domain not accessible, falling back to localhost')
      }
    }

    // Fallback to localhost
    return this.getFallbackDomain()
  }

  /**
   * Get fallback localhost domain
   */
  private getFallbackDomain(): DomainInfo {
    console.log('⚠️ Using fallback localhost domain')
    const domainInfo: DomainInfo = {
      baseUrl: 'http://localhost:3000',
      isProduction: false,
      isLocalhost: true,
      detectedDomain: 'localhost',
      source: 'fallback'
    }
    
    this.domainInfo = domainInfo
    return domainInfo
  }

  /**
   * Save detected domain to environment file
   */
  private async saveDomainToEnv(domainInfo: DomainInfo): Promise<void> {
    try {
      // Only save if it's not localhost (to avoid overwriting with localhost)
      if (domainInfo.isLocalhost) {
        console.log('⚠️ Skipping localhost domain save to avoid overwriting')
        return
      }

      let envContent = ''
      try {
        envContent = await readFile(this.envFilePath, 'utf-8')
      } catch (error) {
        // File doesn't exist, start fresh
        envContent = ''
      }

      // Remove existing NEXT_PUBLIC_BASE_URL if it exists
      const lines = envContent.split('\n')
      const filteredLines = lines.filter(line => 
        !line.startsWith('NEXT_PUBLIC_BASE_URL=') && 
        !line.startsWith('# Auto-detected domain')
      )

      // Add the new domain
      const newLines = [
        ...filteredLines,
        '',
        '# Auto-detected domain',
        `NEXT_PUBLIC_BASE_URL=${domainInfo.baseUrl}`,
        `# Detected from: ${domainInfo.source}`
      ]

      await writeFile(this.envFilePath, newLines.join('\n'))
      console.log('💾 Domain saved to .env.local:', domainInfo.baseUrl)
    } catch (error) {
      console.log('⚠️ Could not save domain to .env.local:', error)
    }
  }

  /**
   * Get current domain info
   */
  public getCurrentDomain(): DomainInfo | null {
    return this.domainInfo
  }

  /**
   * Verify if a domain is accessible externally
   */
  public async verifyExternalAccessibility(url: string): Promise<boolean> {
    try {
      // Test with a simple health check endpoint
      const testUrl = `${url}/api/health`
      const response = await fetch(testUrl, { 
        method: 'GET',
        timeout: 5000,
        headers: {
          'User-Agent': 'DomainDetector/1.0'
        }
      })
      
      if (response.ok) {
        console.log('✅ Domain is accessible:', url)
        return true
      } else {
        console.log('⚠️ Domain not accessible (status):', response.status, url)
        return false
      }
    } catch (error) {
      console.log('⚠️ Domain not accessible (error):', error.message, url)
      return false
    }
  }

  /**
   * Force refresh domain detection
   */
  public async refreshDomain(request?: any): Promise<DomainInfo> {
    this.domainInfo = null
    return await this.getBestDomain(request)
  }
}

// Export singleton instance
export const autoDomainDetector = AutoDomainDetector.getInstance()
