import { Pool, PoolClient } from 'pg'
import { v4 as uuidv4 } from 'uuid'

// Professional database configuration with connection pooling
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'election_enrollment',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
  
  // Connection pool settings for high concurrency (100-200 users)
  max: 100, // Maximum number of clients in the pool (5x increase)
  min: 20,  // Minimum number of clients in the pool (4x increase)
  idleTimeoutMillis: 10000, // Close idle clients after 10 seconds (faster cleanup)
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds (more time for high load)
  acquireTimeoutMillis: 30000, // Maximum time to wait for a connection (reduced from 60s)
  createTimeoutMillis: 10000, // Maximum time to create a connection (faster creation)
  destroyTimeoutMillis: 2000, // Maximum time to destroy a connection (faster cleanup)
  reapIntervalMillis: 500, // How often to check for idle clients (more frequent)
  createRetryIntervalMillis: 100, // How long to wait before retrying connection creation (faster retry)
  
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
}

// Create a connection pool with proper concurrency handling
export const pool = new Pool(dbConfig)

// Connection pool event handlers
pool.on('connect', (client) => {
  console.log('🔗 New client connected to database')
})

pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle client:', err)
})

pool.on('remove', (client) => {
  console.log('🔌 Client removed from pool')
})

// Test database connection with retry logic
export async function testConnection(retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT NOW() as current_time, version() as version')
      console.log('✅ Database connected successfully:', {
        time: result.rows[0].current_time,
        version: result.rows[0].version.split(' ')[0]
      })
      client.release()
      return true
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, error)
      if (i === retries - 1) {
        console.error('❌ All database connection attempts failed')
        return false
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  return false
}

// Generic query function with proper error handling
export async function query(text: string, params?: any[]): Promise<any> {
  const client = await pool.connect()
  try {
    const start = Date.now()
    const result = await client.query(text, params)
    const duration = Date.now() - start
    console.log(`📊 Query executed in ${duration}ms: ${text.substring(0, 50)}...`)
    return result
  } catch (error) {
    console.error('❌ Database query error:', error)
    throw error
  } finally {
    client.release()
  }
}

// Transaction function with proper error handling
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    
    // Use default isolation level (READ COMMITTED) - no need to set explicitly
    // This avoids SQL syntax issues and is sufficient for this application
    
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Transaction rolled back:', error)
    throw error
  } finally {
    client.release()
  }
}

// Generate unique ID with collision prevention
export function generateUniqueId(): string {
  return uuidv4()
}

// Generate submission ID with timestamp and random component
export function generateSubmissionId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `SUB_${timestamp}_${random}`
}

// Health check function with detailed monitoring
export async function healthCheck(): Promise<{
  status: 'healthy' | 'unhealthy'
  details: {
    poolSize: number
    idleConnections: number
    waitingClients: number
    totalConnections: number
    connectionUtilization: number
    averageWaitTime: number
  }
}> {
  try {
    const result = await query('SELECT 1 as health_check')
    const utilization = (pool.totalCount - pool.idleCount) / pool.totalCount * 100
    
    return {
      status: 'healthy',
      details: {
        poolSize: pool.totalCount,
        idleConnections: pool.idleCount,
        waitingClients: pool.waitingCount,
        totalConnections: pool.totalCount,
        connectionUtilization: Math.round(utilization * 100) / 100,
        averageWaitTime: pool.waitingCount > 0 ? 1000 : 0 // Mock wait time
      }
    }
  } catch (error) {
    console.error('❌ Health check failed:', error)
    return {
      status: 'unhealthy',
      details: {
        poolSize: 0,
        idleConnections: 0,
        waitingClients: 0,
        totalConnections: 0,
        connectionUtilization: 0,
        averageWaitTime: 0
      }
    }
  }
}

// Graceful shutdown
export async function closePool(): Promise<void> {
  try {
    await pool.end()
    console.log('🔌 Database pool closed gracefully')
  } catch (error) {
    console.error('❌ Error closing database pool:', error)
  }
}

// Process termination handlers
process.on('SIGINT', closePool)
process.on('SIGTERM', closePool)
