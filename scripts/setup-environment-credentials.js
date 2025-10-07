#!/usr/bin/env node

/**
 * Environment Setup & Credential Management Script
 * Manages environment variables, credentials, and system configuration
 * 
 * Features:
 * - Interactive environment setup
 * - Credential validation and testing
 * - Secure credential storage
 * - Environment-specific configurations
 * - Database connection testing
 * - Service integration testing
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { Pool } = require('pg')
const crypto = require('crypto')

class EnvironmentManager {
  constructor() {
    this.envFile = path.join(process.cwd(), '.env.local')
    this.envTemplate = path.join(process.cwd(), 'env-template.txt')
    this.configurations = {
      development: {
        DB_HOST: 'localhost',
        DB_PORT: '5432',
        DB_NAME: 'election_enrollment',
        DB_USER: 'postgres',
        DB_PASSWORD: 'password',
        NODE_ENV: 'development',
        JWT_SECRET: this.generateJWTSecret(),
        JWT_EXPIRES_IN: '24h'
      },
      production: {
        DB_HOST: 'your-production-host',
        DB_PORT: '5432',
        DB_NAME: 'election_enrollment_prod',
        DB_USER: 'election_user',
        DB_PASSWORD: 'your-secure-password',
        NODE_ENV: 'production',
        JWT_SECRET: this.generateJWTSecret(),
        JWT_EXPIRES_IN: '24h',
        SSL: 'true'
      }
    }
  }

  generateJWTSecret() {
    return crypto.randomBytes(32).toString('hex')
  }

  async createInterface() {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }

  async askQuestion(rl, question) {
    return new Promise((resolve) => {
      rl.question(question, resolve)
    })
  }

  async askPassword(rl, question) {
    return new Promise((resolve) => {
      rl.question(question, resolve)
    })
  }

  // Load existing environment
  loadExistingEnv() {
    if (fs.existsSync(this.envFile)) {
      const envContent = fs.readFileSync(this.envFile, 'utf8')
      const envVars = {}
      
      envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim()
        }
      })
      
      return envVars
    }
    return {}
  }

  // Save environment configuration
  saveEnvironment(config) {
    const envContent = Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')
    
    fs.writeFileSync(this.envFile, envContent)
    console.log(`✅ Environment saved to ${this.envFile}`)
  }

  // Interactive database setup
  async setupDatabase(rl) {
    console.log('\n🗄️ Database Configuration')
    console.log('=========================')
    
    const config = {}
    
    config.DB_HOST = await this.askQuestion(rl, 'Database Host (localhost): ') || 'localhost'
    config.DB_PORT = await this.askQuestion(rl, 'Database Port (5432): ') || '5432'
    config.DB_NAME = await this.askQuestion(rl, 'Database Name (election_enrollment): ') || 'election_enrollment'
    config.DB_USER = await this.askQuestion(rl, 'Database User (postgres): ') || 'postgres'
    config.DB_PASSWORD = await this.askPassword(rl, 'Database Password: ')
    
    return config
  }

  // Interactive Twilio setup
  async setupTwilio(rl) {
    console.log('\n📱 Twilio WhatsApp Configuration')
    console.log('=================================')
    
    const config = {}
    
    const useTwilio = await this.askQuestion(rl, 'Do you want to configure Twilio WhatsApp? (y/n): ')
    
    if (useTwilio.toLowerCase() === 'y') {
      config.TWILIO_ACCOUNT_SID = await this.askQuestion(rl, 'Twilio Account SID: ')
      config.TWILIO_AUTH_TOKEN = await this.askPassword(rl, 'Twilio Auth Token: ')
      config.TWILIO_WHATSAPP_NUMBER = await this.askQuestion(rl, 'Twilio WhatsApp Number (whatsapp:+14155238886): ') || 'whatsapp:+14155238886'
    } else {
      console.log('⚠️ Twilio WhatsApp will be disabled (mock mode)')
    }
    
    return config
  }

  // Interactive security setup
  async setupSecurity(rl) {
    console.log('\n🔒 Security Configuration')
    console.log('=========================')
    
    const config = {}
    
    const generateJWT = await this.askQuestion(rl, 'Generate new JWT secret? (y/n): ')
    
    if (generateJWT.toLowerCase() === 'y') {
      config.JWT_SECRET = this.generateJWTSecret()
      console.log('✅ New JWT secret generated')
    } else {
      config.JWT_SECRET = await this.askQuestion(rl, 'JWT Secret (leave empty to generate): ') || this.generateJWTSecret()
    }
    
    config.JWT_EXPIRES_IN = await this.askQuestion(rl, 'JWT Expiration (24h): ') || '24h'
    
    return config
  }

  // Test database connection
  async testDatabaseConnection(config) {
    console.log('\n🔌 Testing Database Connection')
    console.log('==============================')
    
    try {
      const pool = new Pool({
        user: config.DB_USER,
        host: config.DB_HOST,
        database: 'postgres', // Test with default database first
        password: config.DB_PASSWORD,
        port: parseInt(config.DB_PORT),
        ssl: config.SSL === 'true' ? { rejectUnauthorized: false } : false
      })
      
      const client = await pool.connect()
      const result = await client.query('SELECT NOW() as current_time, version() as version')
      client.release()
      await pool.end()
      
      console.log('✅ Database connection successful')
      console.log(`   Time: ${result.rows[0].current_time}`)
      console.log(`   Version: ${result.rows[0].version.split(' ')[0]}`)
      
      return true
    } catch (error) {
      console.log('❌ Database connection failed:', error.message)
      console.log('🔧 Troubleshooting:')
      console.log('   1. Check if PostgreSQL is running')
      console.log('   2. Verify host and port settings')
      console.log('   3. Check username and password')
      console.log('   4. Ensure database server is accessible')
      return false
    }
  }

  // Test Twilio connection
  async testTwilioConnection(config) {
    if (!config.TWILIO_ACCOUNT_SID || !config.TWILIO_AUTH_TOKEN) {
      console.log('⚠️ Twilio not configured - skipping test')
      return true
    }
    
    console.log('\n📱 Testing Twilio Connection')
    console.log('============================')
    
    try {
      const twilio = require('twilio')
      const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)
      
      // Test by fetching account info
      const account = await client.api.accounts(config.TWILIO_ACCOUNT_SID).fetch()
      
      console.log('✅ Twilio connection successful')
      console.log(`   Account: ${account.friendlyName}`)
      console.log(`   Status: ${account.status}`)
      
      return true
    } catch (error) {
      console.log('❌ Twilio connection failed:', error.message)
      console.log('🔧 Troubleshooting:')
      console.log('   1. Check Account SID and Auth Token')
      console.log('   2. Verify Twilio account is active')
      console.log('   3. Check network connectivity')
      return false
    }
  }

  // Create application database
  async createApplicationDatabase(config) {
    console.log('\n🏗️ Creating Application Database')
    console.log('=================================')
    
    try {
      const pool = new Pool({
        user: config.DB_USER,
        host: config.DB_HOST,
        database: 'postgres',
        password: config.DB_PASSWORD,
        port: parseInt(config.DB_PORT),
        ssl: config.SSL === 'true' ? { rejectUnauthorized: false } : false
      })
      
      await pool.query(`CREATE DATABASE ${config.DB_NAME}`)
      console.log(`✅ Database '${config.DB_NAME}' created successfully`)
      await pool.end()
      
      return true
    } catch (error) {
      if (error.code === '42P04') {
        console.log(`⚠️ Database '${config.DB_NAME}' already exists`)
        return true
      } else {
        console.log('❌ Database creation failed:', error.message)
        return false
      }
    }
  }

  // Interactive setup wizard
  async runSetupWizard() {
    console.log('🚀 Environment Setup Wizard')
    console.log('============================')
    console.log('This wizard will help you configure the Election Management System')
    console.log('')
    
    const rl = await this.createInterface()
    
    try {
      // Load existing configuration
      const existingConfig = this.loadExistingEnv()
      console.log('📋 Existing configuration found')
      
      const useExisting = await this.askQuestion(rl, 'Use existing configuration as base? (y/n): ')
      let config = useExisting.toLowerCase() === 'y' ? existingConfig : {}
      
      // Environment type
      const envType = await this.askQuestion(rl, 'Environment type (development/production): ') || 'development'
      config.NODE_ENV = envType
      
      // Database setup
      const dbConfig = await this.setupDatabase(rl)
      Object.assign(config, dbConfig)
      
      // Test database connection
      const dbTest = await this.testDatabaseConnection(config)
      if (!dbTest) {
        const continueAnyway = await this.askQuestion(rl, 'Continue anyway? (y/n): ')
        if (continueAnyway.toLowerCase() !== 'y') {
          console.log('❌ Setup cancelled')
          return false
        }
      }
      
      // Create application database
      await this.createApplicationDatabase(config)
      
      // Twilio setup
      const twilioConfig = await this.setupTwilio(rl)
      Object.assign(config, twilioConfig)
      
      // Test Twilio if configured
      if (twilioConfig.TWILIO_ACCOUNT_SID) {
        await this.testTwilioConnection(config)
      }
      
      // Security setup
      const securityConfig = await this.setupSecurity(rl)
      Object.assign(config, securityConfig)
      
      // Additional configuration
      config.PORT = await this.askQuestion(rl, 'Application Port (3000): ') || '3000'
      config.MAX_FILE_SIZE = await this.askQuestion(rl, 'Max File Size in bytes (10485760): ') || '10485760'
      
      // Save configuration
      this.saveEnvironment(config)
      
      console.log('\n🎉 Environment Setup Complete!')
      console.log('==============================')
      console.log('✅ Configuration saved to .env.local')
      console.log('✅ Database connection tested')
      console.log('✅ Security settings configured')
      
      console.log('\n🔧 Next Steps:')
      console.log('   1. Run: npm run db:setup')
      console.log('   2. Run: npm run dev')
      console.log('   3. Test the application')
      
      return true
      
    } catch (error) {
      console.error('❌ Setup failed:', error.message)
      return false
    } finally {
      rl.close()
    }
  }

  // Validate current environment
  async validateEnvironment() {
    console.log('🔍 Validating Current Environment')
    console.log('=================================')
    
    const config = this.loadExistingEnv()
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET']
    const missingVars = []
    
    requiredVars.forEach(varName => {
      if (!config[varName]) {
        missingVars.push(varName)
      }
    })
    
    if (missingVars.length > 0) {
      console.log('❌ Missing required variables:', missingVars.join(', '))
      return false
    }
    
    console.log('✅ All required variables present')
    
    // Test database connection
    const dbTest = await this.testDatabaseConnection(config)
    if (!dbTest) {
      console.log('❌ Database connection failed')
      return false
    }
    
    // Test Twilio if configured
    if (config.TWILIO_ACCOUNT_SID) {
      const twilioTest = await this.testTwilioConnection(config)
      if (!twilioTest) {
        console.log('⚠️ Twilio connection failed (optional)')
      }
    }
    
    console.log('✅ Environment validation complete')
    return true
  }

  // Reset environment
  async resetEnvironment() {
    console.log('🔄 Resetting Environment')
    console.log('========================')
    
    if (fs.existsSync(this.envFile)) {
      fs.unlinkSync(this.envFile)
      console.log('✅ Environment file removed')
    }
    
    console.log('✅ Environment reset complete')
    console.log('🔧 Run setup wizard to reconfigure')
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'setup'
  
  const manager = new EnvironmentManager()
  
  try {
    switch (command) {
      case 'setup':
        await manager.runSetupWizard()
        break
        
      case 'validate':
        await manager.validateEnvironment()
        break
        
      case 'reset':
        await manager.resetEnvironment()
        break
        
      default:
        console.log('Usage: node setup-environment-credentials.js [setup|validate|reset]')
        process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { EnvironmentManager }
