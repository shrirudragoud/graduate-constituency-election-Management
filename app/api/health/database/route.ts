import { NextRequest, NextResponse } from 'next/server'
import { databaseAutoSetup } from '@/lib/database-auto-setup'

/**
 * Database Health Check API
 * Provides real-time database status and health information
 */

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking database health...')
    
    const healthStatus = await databaseAutoSetup.getHealthStatus()
    
    const response = {
      timestamp: new Date().toISOString(),
      status: healthStatus.status,
      database: {
        connection: healthStatus.details.connection,
        tables: {
          total: healthStatus.details.tables.length,
          existing: healthStatus.details.tables,
          missing: healthStatus.details.missingTables
        },
        data: {
          totalSubmissions: healthStatus.details.totalSubmissions,
          lastSubmission: healthStatus.details.lastSubmission
        }
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    }

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503

    return NextResponse.json(response, { status: statusCode })

  } catch (error) {
    console.error('❌ Database health check failed:', error)
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      uptime: process.uptime()
    }, { status: 503 })
  }
}

/**
 * Initialize database endpoint
 * Safely initializes database tables and indexes
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Initializing database...')
    
    const result = await databaseAutoSetup.initializeDatabase()
    
    const response = {
      timestamp: new Date().toISOString(),
      success: result.success,
      message: result.message,
      details: {
        tablesCreated: result.tablesCreated,
        indexesCreated: result.indexesCreated.length,
        errors: result.errors
      }
    }

    const statusCode = result.success ? 200 : 500

    return NextResponse.json(response, { status: statusCode })

  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      success: false,
      message: 'Database initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

