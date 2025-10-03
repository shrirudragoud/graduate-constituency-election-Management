// District and Taluka data service for dropdown functionality

export interface DistrictTalukaData {
  district: string
  talukas: string[]
}

export interface DistrictOption {
  value: string
  label: string
}

export interface TalukaOption {
  value: string
  label: string
}

class DistrictTalukaService {
  private static data: DistrictTalukaData[] | null = null
  private static loading = false

  /**
   * Load district-taluka data from JSON file
   */
  private static async loadData(): Promise<DistrictTalukaData[]> {
    if (this.data) {
      return this.data
    }

    if (this.loading) {
      // Wait for ongoing load to complete
      while (this.loading) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return this.data || []
    }

    this.loading = true
    try {
      const response = await fetch('/districts-talukas.json')
      if (!response.ok) {
        throw new Error(`Failed to load districts data: ${response.statusText}`)
      }
      this.data = await response.json()
      return this.data
    } catch (error) {
      console.error('Error loading districts data:', error)
      return []
    } finally {
      this.loading = false
    }
  }

  /**
   * Get all districts as options for dropdown
   */
  static async getDistricts(): Promise<DistrictOption[]> {
    const data = await this.loadData()
    return data.map(item => ({
      value: item.district,
      label: item.district
    }))
  }

  /**
   * Get talukas for a specific district
   */
  static async getTalukasByDistrict(districtName: string): Promise<TalukaOption[]> {
    const data = await this.loadData()
    const district = data.find(item => item.district === districtName)
    
    if (!district) {
      console.warn(`District not found: ${districtName}`)
      return []
    }

    return district.talukas.map(taluka => ({
      value: taluka,
      label: taluka
    }))
  }

  /**
   * Validate if a district exists
   */
  static async isValidDistrict(districtName: string): Promise<boolean> {
    const data = await this.loadData()
    return data.some(item => item.district === districtName)
  }

  /**
   * Validate if a taluka exists in a district
   */
  static async isValidTaluka(districtName: string, talukaName: string): Promise<boolean> {
    const data = await this.loadData()
    const district = data.find(item => item.district === districtName)
    return district ? district.talukas.includes(talukaName) : false
  }

  /**
   * Get all data (for debugging or admin purposes)
   */
  static async getAllData(): Promise<DistrictTalukaData[]> {
    return await this.loadData()
  }

  /**
   * Search districts by name (case-insensitive)
   */
  static async searchDistricts(query: string): Promise<DistrictOption[]> {
    const districts = await this.getDistricts()
    const lowerQuery = query.toLowerCase()
    return districts.filter(district => 
      district.label.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Search talukas by name within a district (case-insensitive)
   */
  static async searchTalukas(districtName: string, query: string): Promise<TalukaOption[]> {
    const talukas = await this.getTalukasByDistrict(districtName)
    const lowerQuery = query.toLowerCase()
    return talukas.filter(taluka => 
      taluka.label.toLowerCase().includes(lowerQuery)
    )
  }
}

export default DistrictTalukaService

