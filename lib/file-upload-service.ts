import { readFile } from 'fs/promises'
import { join } from 'path'

export interface FileUploadResult {
  success: boolean
  url?: string
  error?: string
  service?: string
}

export class FileUploadService {
  private baseUrl: string

  constructor() {
    // Use URL from environment variable
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    console.log('🌐 Using base URL from .env:', this.baseUrl)
  }

  /**
   * Get the best available public URL for a file
   * Simple approach: use URL from .env
   */
  public async getBestPublicUrl(filePath: string, request?: any): Promise<FileUploadResult> {
    console.log('📤 Getting public URL for file:', filePath)
    
    // Extract filename from path
    const fileName = filePath.split('/').pop() || filePath
    
    // Use the base URL from environment
    const publicUrl = `${this.baseUrl}/api/files/${fileName}`
    
    console.log('✅ Using URL from .env:', publicUrl)
    return {
      success: true,
      url: publicUrl,
      service: 'env_url'
    }
  }

  /**
   * Try to serve file locally via API endpoint
   */
  private async tryLocalFileServing(fileName: string): Promise<FileUploadResult> {
    try {
      // Check for Lightning Cloud domain first
      const lightningHost = process.env.LIGHTNING_CLOUDSPACE_HOST
      let baseUrl = this.domainInfo.baseUrl
      
      if (lightningHost && !lightningHost.includes('localhost')) {
        baseUrl = `https://${lightningHost}`
        console.log('🌩️ Using Lightning Cloud domain:', baseUrl)
      }
      
      const publicUrl = `${baseUrl}/api/files/${fileName}`
      
      // Verify file is accessible
      const response = await fetch(publicUrl, { method: 'HEAD' })
      
      if (response.ok) {
        return {
          success: true,
          url: publicUrl,
          service: 'local'
        }
      }
      
      return {
        success: false,
        error: `Local file not accessible: ${response.status}`
      }
    } catch (error) {
      return {
        success: false,
        error: `Local file serving failed: ${error}`
      }
    }
  }

  /**
   * Try external upload services with priority order
   */
  private async tryExternalUploadServices(filePath: string): Promise<FileUploadResult> {
    // Try services in order of preference (best first) - only working services
    const uploadServices = [
      { name: '0x0.st', fn: () => this.uploadTo0x0(filePath) },
      { name: 'transfer.sh', fn: () => this.uploadToTransferSh(filePath) }
    ]

    // Try each service sequentially for better reliability
    for (const service of uploadServices) {
      try {
        console.log(`📤 Trying ${service.name}...`)
        const result = await service.fn()
        
        if (result.success) {
          console.log(`✅ ${service.name} upload succeeded!`)
          return result
        } else {
          console.log(`❌ ${service.name} failed:`, result.error)
        }
      } catch (error) {
        console.log(`❌ ${service.name} error:`, error)
      }
    }
    
    return {
      success: false,
      error: 'All external upload services failed'
    }
  }

  /**
   * Upload to 0x0.st service
   */
  private async uploadTo0x0(filePath: string): Promise<FileUploadResult> {
    try {
      console.log('📤 Uploading to 0x0.st...')
      
      const fileBuffer = await readFile(filePath)
      const formData = new FormData()
      formData.append('file', new Blob([fileBuffer]), filePath.split('/').pop())
      
      const response = await fetch('https://0x0.st', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const url = await response.text()
        const cleanUrl = url.trim()
        
        // Validate URL format
        if (cleanUrl.startsWith('http')) {
          return {
            success: true,
            url: cleanUrl,
            service: '0x0.st'
          }
        }
      }
      
      return {
        success: false,
        error: `0x0.st upload failed: ${response.status} ${response.statusText}`
      }
    } catch (error) {
      console.error('❌ 0x0.st upload error:', error)
      return {
        success: false,
        error: `0x0.st upload error: ${error}`
      }
    }
  }

  /**
   * Upload to file.io service
   */
  private async uploadToFileIo(filePath: string): Promise<FileUploadResult> {
    try {
      console.log('📤 Uploading to file.io...')
      
      const fileBuffer = await readFile(filePath)
      const formData = new FormData()
      formData.append('file', new Blob([fileBuffer]), filePath.split('/').pop())
      
      const response = await fetch('https://file.io', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.link) {
          return {
            success: true,
            url: result.link,
            service: 'file.io'
          }
        }
      }
      
      return {
        success: false,
        error: `file.io upload failed: ${response.status}`
      }
    } catch (error) {
      console.error('❌ file.io upload error:', error)
      return {
        success: false,
        error: `file.io upload error: ${error}`
      }
    }
  }

  /**
   * Upload to transfer.sh service
   */
  private async uploadToTransferSh(filePath: string): Promise<FileUploadResult> {
    try {
      console.log('📤 Uploading to transfer.sh...')
      
      const fileBuffer = await readFile(filePath)
      const fileName = filePath.split('/').pop() || 'file.pdf'
      
      const response = await fetch(`https://transfer.sh/${fileName}`, {
        method: 'PUT',
        body: fileBuffer,
        headers: {
          'Content-Type': 'application/pdf'
        },
        timeout: 10000 // 10 second timeout
      })
      
      if (response.ok) {
        const url = await response.text()
        const cleanUrl = url.trim()
        
        // Validate URL format
        if (cleanUrl.startsWith('http')) {
          return {
            success: true,
            url: cleanUrl,
            service: 'transfer.sh'
          }
        }
      }
      
      return {
        success: false,
        error: `transfer.sh upload failed: ${response.status} ${response.statusText}`
      }
    } catch (error) {
      console.error('❌ transfer.sh upload error:', error)
      return {
        success: false,
        error: `transfer.sh upload error: ${error}`
      }
    }
  }

  /**
   * Upload to tmpfiles.org service
   */
  private async uploadToTmpFiles(filePath: string): Promise<FileUploadResult> {
    try {
      console.log('📤 Uploading to tmpfiles.org...')
      
      const fileBuffer = await readFile(filePath)
      const formData = new FormData()
      formData.append('file', new Blob([fileBuffer]), filePath.split('/').pop())
      
      const response = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.status === 'success' && result.data.url) {
          // Ensure HTTPS URL for better compatibility
          let url = result.data.url
          if (url.startsWith('http://')) {
            url = url.replace('http://', 'https://')
          }
          return {
            success: true,
            url: url,
            service: 'tmpfiles.org'
          }
        }
      }
      
      return {
        success: false,
        error: `tmpfiles.org upload failed: ${response.status}`
      }
    } catch (error) {
      console.error('❌ tmpfiles.org upload error:', error)
      return {
        success: false,
        error: `tmpfiles.org upload error: ${error}`
      }
    }
  }

  /**
   * Check if a URL is accessible
   */
  public async verifyUrlAccessibility(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      console.error('❌ URL accessibility check failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const fileUploadService = new FileUploadService()
