// Client-side authentication utilities
export interface User {
  id: number
  email: string
  role: 'admin' | 'volunteer' | 'supervisor'
  firstName?: string
  lastName?: string
  phone?: string
  district?: string
  taluka?: string
  isActive: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// Get auth state from localStorage
export function getAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false }
  }

  const token = localStorage.getItem('authToken')
  const userStr = localStorage.getItem('user')
  
  if (!token || !userStr) {
    return { user: null, token: null, isAuthenticated: false }
  }

  try {
    const user = JSON.parse(userStr)
    return { user, token, isAuthenticated: true }
  } catch (error) {
    console.error('Error parsing user data:', error)
    return { user: null, token: null, isAuthenticated: false }
  }
}

// Set auth state in localStorage
export function setAuthState(user: User, token: string): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('authToken', token)
  localStorage.setItem('user', JSON.stringify(user))
}

// Clear auth state
export function clearAuthState(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

// Get auth headers for API requests
export function getAuthHeaders(): Record<string, string> {
  const { token } = getAuthState()
  
  if (!token) {
    return {}
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

// Check if user has required role
export function hasRole(requiredRole: 'admin' | 'volunteer' | 'supervisor'): boolean {
  const { user } = getAuthState()
  
  if (!user) return false
  
  const roleHierarchy = {
    'volunteer': 1,
    'supervisor': 2,
    'admin': 3
  }
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getAuthState().isAuthenticated
}

// Get current user
export function getCurrentUser(): User | null {
  return getAuthState().user
}

// Logout function
export function logout(): void {
  clearAuthState()
  window.location.href = '/auth/login'
}

// API request helper with auth
export async function apiRequest(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const authHeaders = getAuthHeaders()
  
  return fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers
    }
  })
}
