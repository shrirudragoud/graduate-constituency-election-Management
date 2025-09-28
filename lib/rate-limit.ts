import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export function rateLimit(config: RateLimitConfig) {
  return (request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } => {
    const identifier = getClientIdentifier(request)
    const now = Date.now()
    const windowMs = config.windowMs
    const maxRequests = config.maxRequests

    const entry = rateLimitStore.get(identifier)
    
    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      })
      
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      }
    }

    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }

    // Increment count
    entry.count++
    rateLimitStore.set(identifier, entry)

    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }
}

function getClientIdentifier(request: NextRequest): string {
  // Use IP address as identifier
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  
  // Add user agent for additional uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  return `${ip}-${userAgent.slice(0, 50)}`
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // General API requests
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  },
  
  // Form submissions - relaxed for high concurrency
  formSubmission: {
    windowMs: 15 * 60 * 1000, // 15 minutes (reduced from 1 hour)
    maxRequests: 50 // Increased from 10 for high concurrency
  },
  
  // Authentication attempts
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5
  },
  
  // File uploads
  fileUpload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20
  }
}

// Rate limit middleware
export function withRateLimit(
  config: RateLimitConfig,
  handler: (request: NextRequest) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const rateLimitCheck = rateLimit(config)
    const result = rateLimitCheck(request)

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString()
          }
        }
      )
    }

    // Add rate limit headers to successful responses
    const response = await handler(request)
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString())

    return response
  }
}
