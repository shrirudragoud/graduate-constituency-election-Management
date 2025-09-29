import { readFile } from 'fs/promises'
import { join } from 'path'

export interface DomainInfo {
  baseUrl: string
  isProduction: boolean
  isLocalhost: boolean
  detectedDomain?: string
}

export class DomainDetector {
  private static instance: DomainDetector
  private domainInfo: DomainInfo | null = null

  private constructor() {}

  public static getInstance(): DomainDetector {
    if (!DomainDetector.instance) {
      DomainDetector.instance = new DomainDetector()
    }
    return DomainDetector.instance
  }

  /**
   * Detect the best available domain/URL for the application
   */
  public async detectBestDomain(): Promise<DomainInfo> {
    if (this.domainInfo) {
      return this.domainInfo
    }

    console.log('🔍 Detecting best domain for file sharing...')

    // Strategy 1: Check environment variables
    const envUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || process.env.RAILWAY_PUBLIC_DOMAIN
    if (envUrl && !envUrl.includes('localhost')) {
      console.log('✅ Using environment URL:', envUrl)
      this.domainInfo = {
        baseUrl: envUrl.startsWith('http') ? envUrl : `https://${envUrl}`,
        isProduction: true,
        isLocalhost: false,
        detectedDomain: envUrl
      }
      return this.domainInfo
    }

    // Strategy 2: Check for ngrok tunnel
    const ngrokUrl = await this.detectNgrokTunnel()
    if (ngrokUrl) {
      console.log('✅ Using ngrok tunnel:', ngrokUrl)
      this.domainInfo = {
        baseUrl: ngrokUrl,
        isProduction: false,
        isLocalhost: false,
        detectedDomain: ngrokUrl
      }
      return this.domainInfo
    }

    // Strategy 3: Check for other tunnel services
    const tunnelUrl = await this.detectOtherTunnels()
    if (tunnelUrl) {
      console.log('✅ Using tunnel service:', tunnelUrl)
      this.domainInfo = {
        baseUrl: tunnelUrl,
        isProduction: false,
        isLocalhost: false,
        detectedDomain: tunnelUrl
      }
      return this.domainInfo
    }

    // Strategy 4: Fallback to localhost with warning
    console.log('⚠️ No external domain detected, using localhost (PDF sharing will be limited)')
    this.domainInfo = {
      baseUrl: 'http://localhost:3000',
      isProduction: false,
      isLocalhost: true,
      detectedDomain: 'localhost'
    }
    return this.domainInfo
  }

  /**
   * Detect ngrok tunnel
   */
  private async detectNgrokTunnel(): Promise<string | null> {
    try {
      // Check common ngrok API endpoints
      const ngrokUrls = [
        'http://127.0.0.1:4040/api/tunnels',
        'http://localhost:4040/api/tunnels'
      ]

      for (const url of ngrokUrls) {
        try {
          const response = await fetch(url, { timeout: 2000 })
          if (response.ok) {
            const data = await response.json()
            const tunnels = data.tunnels || []
            const httpsTunnel = tunnels.find((tunnel: any) => 
              tunnel.proto === 'https' && tunnel.public_url
            )
            if (httpsTunnel) {
              return httpsTunnel.public_url
            }
          }
        } catch (error) {
          // Continue to next URL
        }
      }
    } catch (error) {
      console.log('🔍 Ngrok detection failed:', error)
    }
    return null
  }

  /**
   * Detect other tunnel services
   */
  private async detectOtherTunnels(): Promise<string | null> {
    try {
      // Check for common tunnel services
      const tunnelServices = [
        'https://api.tunnelmole.com/tunnels',
        'https://api.loca.lt/tunnels'
      ]

      for (const url of tunnelServices) {
        try {
          const response = await fetch(url, { timeout: 3000 })
          if (response.ok) {
            const data = await response.json()
            // Parse response based on service
            if (data.url || data.public_url) {
              return data.url || data.public_url
            }
          }
        } catch (error) {
          // Continue to next service
        }
      }
    } catch (error) {
      console.log('🔍 Tunnel detection failed:', error)
    }
    return null
  }

  /**
   * Get the current domain info
   */
  public getDomainInfo(): DomainInfo | null {
    return this.domainInfo
  }

  /**
   * Force refresh domain detection
   */
  public async refreshDomain(): Promise<DomainInfo> {
    this.domainInfo = null
    return await this.detectBestDomain()
  }

  /**
   * Check if a URL is accessible from external sources
   */
  public async verifyExternalAccessibility(url: string): Promise<boolean> {
    try {
      // Use a public service to check if our URL is accessible
      const checkUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      const response = await fetch(checkUrl, { timeout: 10000 })
      
      if (response.ok) {
        const data = await response.json()
        return data.status?.http_code === 200
      }
      return false
    } catch (error) {
      console.log('🔍 External accessibility check failed:', error)
      return false
    }
  }

  /**
   * Get file URL for a given filename
   */
  public async getFileUrl(filename: string): Promise<string> {
    const domainInfo = await this.detectBestDomain()
    return `${domainInfo.baseUrl}/api/files/${filename}`
  }
}

// Export singleton instance
export const domainDetector = DomainDetector.getInstance()

