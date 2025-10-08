# Data Recovery & Setup Guide

## Overview

This guide explains how to recover, restore, and set up the Graduate Constituency Election Management System with proper database connections and data integrity.

## System Architecture & Connection Flow

### 1. Database Connection Sequence

```
Environment Variables → Connection Pool → Database Schema → Data Operations
     ↓                      ↓                ↓              ↓
.env.local → PostgreSQL Pool → Tables/Indexes → CRUD Operations
```

### 2. Setup Scripts Sequence

1. **Environment Setup** → `setup-environment-credentials.js`
2. **Database Creation** → `setup-database.js`
3. **Connection Testing** → `setup-connection-sequence.js`
4. **Data Migration** → `migrate-json-to-postgres.js`
5. **Data Recovery** → `data-recovery-restore.js`

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm/pnpm package manager

### 1. Environment Configuration

```bash
# Interactive setup wizard
node scripts/setup-environment-credentials.js setup

# Or validate existing configuration
node scripts/setup-environment-credentials.js validate
```

**Required Environment Variables:**
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=election_enrollment
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Security
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=24h

# Twilio WhatsApp (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Application
NODE_ENV=development
PORT=3000
```

### 2. Database Setup

```bash
# Create database and schema
node scripts/setup-database.js

# Test connection sequence
node scripts/setup-connection-sequence.js
```

### 3. Data Recovery & Migration

#### From SQL Backup
```bash
# Create backup
node scripts/data-recovery-restore.js --mode=backup

# Restore from backup
node scripts/data-recovery-restore.js --mode=restore --source=sql --file=backup-file.sql
```

#### From JSON Data
```bash
# Restore from JSON
node scripts/data-recovery-restore.js --mode=restore --source=json --file=data/submissions.json
```

#### From CSV Data
```bash
# Restore from CSV
node scripts/data-recovery-restore.js --mode=restore --source=csv --file=data/submissions.csv
```

## Detailed Setup Process

### Step 1: Environment Setup

The system uses a hierarchical configuration approach:

1. **Default Values** (hardcoded fallbacks)
2. **Environment Variables** (.env.local)
3. **Runtime Configuration** (command line args)

```javascript
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'election_enrollment',
  password: process.env.DB_PASSWORD || 'HiveTech',
  port: parseInt(process.env.DB_PORT || '5432'),
  
  // High-concurrency pool settings
  max: 100,
  min: 20,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  acquireTimeoutMillis: 30000,
  createTimeoutMillis: 10000,
  destroyTimeoutMillis: 2000,
  reapIntervalMillis: 500,
  createRetryIntervalMillis: 100,
  
  // SSL for production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
}
```

### Step 2: Database Schema Creation

The system creates a comprehensive schema with:

#### Core Tables
- **`users`** - User management (admin, volunteer, supervisor)
- **`submissions`** - Voter registration data
- **`file_attachments`** - File management
- **`audit_logs`** - Change tracking
- **`statistics`** - Cached metrics

#### Performance Optimizations
- **Composite indexes** for common queries
- **Full-text search** capabilities
- **Geographical indexes** for district/taluka filtering
- **Status-based indexes** for workflow management

#### Data Integrity
- **Foreign key constraints**
- **Check constraints** for data validation
- **Unique constraints** for duplicate prevention
- **Trigger functions** for automatic updates

### Step 3: Connection Pool Management

The system uses PostgreSQL connection pooling for high concurrency:

```javascript
// Connection pool with retry logic
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
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  return false
}
```

### Step 4: Data Recovery Process

#### Backup Creation
```bash
# Automatic backup with timestamp
pg_dump -h localhost -U postgres -d election_enrollment -f "backup-2025-01-15T10-30-00.sql"
```

#### Data Validation
The recovery process includes comprehensive validation:

1. **Schema Validation** - Ensure all tables exist
2. **Data Type Validation** - Check field types and constraints
3. **Referential Integrity** - Validate foreign key relationships
4. **Duplicate Detection** - Prevent duplicate records
5. **Data Cleaning** - Sanitize and normalize data

#### Rollback Capability
```bash
# Rollback to previous state
node scripts/data-recovery-restore.js --mode=rollback --backup=backup-file.sql
```

## Data Migration Patterns

### JSON to PostgreSQL Migration

```javascript
// Map JSON record to database format
mapJSONRecord(record) {
  return {
    surname: record.surname || 'N/A',
    firstName: record.firstName || record.first_name || 'N/A',
    fathersHusbandName: record.fathersHusbandName || record.fathers_husband_name || 'N/A',
    // ... comprehensive field mapping
    status: record.status || 'pending',
    files: record.files || {},
    source: record.source || 'migration'
  }
}
```

### CSV to PostgreSQL Migration

```javascript
// CSV parsing with field mapping
const csvMapping = {
  'Surname': 'surname',
  'First Name': 'firstName',
  'Mobile Number': 'mobileNumber',
  'Aadhaar Number': 'aadhaarNumber',
  // ... complete field mapping
}
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection manually
psql -h localhost -U postgres -d postgres
```

#### 2. Permission Denied
```bash
# Grant database permissions
sudo -u postgres psql
CREATE USER election_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE election_enrollment TO election_user;
```

#### 3. SSL Connection Issues
```bash
# For production environments
export PGSSLMODE=require
export PGSSLROOTCERT=/path/to/ca-certificate.crt
```

#### 4. Memory Issues
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 scripts/setup-database.js
```

### Recovery Procedures

#### Complete System Recovery
```bash
# 1. Stop application
pm2 stop voter-app

# 2. Backup current state
node scripts/data-recovery-restore.js --mode=backup

# 3. Reset database
node scripts/reset-database.js

# 4. Restore from backup
node scripts/data-recovery-restore.js --mode=restore --source=sql

# 5. Verify data integrity
node scripts/data-recovery-restore.js --mode=verify

# 6. Restart application
pm2 start voter-app
```

#### Partial Data Recovery
```bash
# Restore specific data types
node scripts/data-recovery-restore.js --mode=restore --source=json --file=users.json
node scripts/data-recovery-restore.js --mode=restore --source=json --file=submissions.json
```

## Production Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
DB_HOST=your-production-host
DB_PASSWORD=your-secure-production-password
JWT_SECRET=your-production-jwt-secret
SSL=true
```

### Database Configuration
```bash
# Production database settings
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

### Monitoring & Maintenance
```bash
# Health check
curl http://localhost:3000/api/health

# Database monitoring
node scripts/setup-connection-sequence.js

# Performance testing
npm run test:performance
```

## Security Considerations

### Credential Management
- Use environment variables for sensitive data
- Implement credential rotation
- Use SSL/TLS for database connections
- Encrypt sensitive data at rest

### Data Protection
- Regular automated backups
- Data encryption in transit and at rest
- Access control and audit logging
- Secure file upload validation

### Network Security
- Firewall configuration
- VPN access for database
- Rate limiting and DDoS protection
- Regular security updates

## Performance Optimization

### Database Optimization
- Proper indexing strategy
- Query optimization
- Connection pooling
- Read replicas for scaling

### Application Optimization
- Caching strategies
- Asynchronous processing
- File compression
- CDN integration

### Monitoring
- Database performance metrics
- Application performance monitoring
- Error tracking and alerting
- Resource utilization monitoring

## Support & Maintenance

### Regular Maintenance Tasks
1. **Daily**: Monitor system health and performance
2. **Weekly**: Review logs and error reports
3. **Monthly**: Update dependencies and security patches
4. **Quarterly**: Performance optimization and capacity planning

### Backup Strategy
- **Full backups**: Daily at 2 AM
- **Incremental backups**: Every 6 hours
- **Point-in-time recovery**: Available for 30 days
- **Offsite storage**: Encrypted backups in cloud storage

### Disaster Recovery
- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 1 hour
- **Automated failover**: Available for critical systems
- **Data replication**: Real-time to standby server

This comprehensive guide ensures reliable data recovery and system setup for the Election Management System.
