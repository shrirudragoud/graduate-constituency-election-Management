# 📊 Data Handling Process Instructions

## Overview
This document provides comprehensive instructions for managing PostgreSQL data on the Voter Data Collection VPS, including backups, recovery, maintenance, and troubleshooting procedures.

## Table of Contents
1. [Database Architecture](#database-architecture)
2. [Daily Operations](#daily-operations)
3. [Backup Procedures](#backup-procedures)
4. [Recovery Procedures](#recovery-procedures)
5. [Data Maintenance](#data-maintenance)
6. [Monitoring & Health Checks](#monitoring--health-checks)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Emergency Procedures](#emergency-procedures)
9. [Security Best Practices](#security-best-practices)

---

## Database Architecture

### Core Tables Structure
```
election_enrollment/
├── users                    # User accounts & authentication
├── submissions             # Main voter registration data
├── file_attachments        # Document storage
├── audit_logs             # Change tracking
└── statistics             # Performance metrics
```

### Key Data Relationships
- **users** → **submissions** (one-to-many)
- **submissions** → **file_attachments** (one-to-many)
- **users** → **audit_logs** (one-to-many)

### Data Volume Estimates
- **Small deployment**: 1,000-10,000 submissions
- **Medium deployment**: 10,000-100,000 submissions
- **Large deployment**: 100,000+ submissions

---

## Daily Operations

### Morning Checklist (5 minutes)
```bash
# 1. Check system status
pm2 status
sudo systemctl status postgresql

# 2. Check disk space
df -h

# 3. Check application logs
pm2 logs voter-app --lines 20

# 4. Verify database connectivity
sudo -u postgres psql election_enrollment -c "SELECT COUNT(*) FROM submissions;"
```

### Evening Checklist (5 minutes)
```bash
# 1. Check backup status
ls -la /var/backups/voter-app/ | tail -5

# 2. Check error logs
sudo tail -20 /var/log/postgresql/postgresql-*.log

# 3. Monitor resource usage
htop
```

---

## Backup Procedures

### Automatic Backups
- **Schedule**: Daily at 2:00 AM (cron job)
- **Location**: `/var/backups/voter-app/`
- **Retention**: 30 days
- **Format**: Compressed SQL dumps (.sql.gz)

### Manual Backup Commands

#### Full Database Backup
```bash
# Create timestamped backup
BACKUP_FILE="election_enrollment_$(date +%Y%m%d_%H%M%S).sql.gz"
pg_dump election_enrollment | gzip > /var/backups/voter-app/$BACKUP_FILE

# Verify backup
ls -lh /var/backups/voter-app/$BACKUP_FILE
```

#### Table-Specific Backups
```bash
# Backup submissions table only
pg_dump -t submissions election_enrollment > submissions_backup_$(date +%Y%m%d).sql

# Backup users table only
pg_dump -t users election_enrollment > users_backup_$(date +%Y%m%d).sql
```

#### Custom Format Backup (Faster Restore)
```bash
# Create custom format backup
pg_dump -Fc election_enrollment > election_enrollment_$(date +%Y%m%d).dump

# Verify backup integrity
pg_restore --list election_enrollment_$(date +%Y%m%d).dump
```

### Backup Verification
```bash
# Test restore to temporary database
sudo -u postgres createdb test_restore
gunzip -c /var/backups/voter-app/latest_backup.sql.gz | sudo -u postgres psql test_restore
sudo -u postgres dropdb test_restore
```

---

## Recovery Procedures

### Complete Database Restore

#### From SQL Dump
```bash
# 1. Stop application
pm2 stop voter-app

# 2. Drop existing database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS election_enrollment;"

# 3. Create new database
sudo -u postgres psql -c "CREATE DATABASE election_enrollment;"

# 4. Restore from backup
gunzip -c /var/backups/voter-app/election_enrollment_YYYYMMDD_HHMMSS.sql.gz | sudo -u postgres psql election_enrollment

# 5. Restart application
pm2 start voter-app
```

#### From Custom Format
```bash
# 1. Stop application
pm2 stop voter-app

# 2. Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS election_enrollment;"
sudo -u postgres psql -c "CREATE DATABASE election_enrollment;"

# 3. Restore from custom format
pg_restore -d election_enrollment election_enrollment_YYYYMMDD.dump

# 4. Restart application
pm2 start voter-app
```

### Partial Data Recovery

#### Restore Specific Table
```bash
# Restore submissions table
psql election_enrollment < submissions_backup_YYYYMMDD.sql
```

#### Restore Specific Time Range
```bash
# Export data from specific date range
sudo -u postgres psql election_enrollment -c "
COPY (
    SELECT * FROM submissions 
    WHERE submitted_at BETWEEN '2024-01-01' AND '2024-01-31'
) TO '/tmp/january_submissions.csv' WITH CSV HEADER;"
```

---

## Data Maintenance

### Weekly Maintenance Tasks

#### Database Cleanup
```bash
# 1. Vacuum and analyze database
sudo -u postgres psql election_enrollment -c "VACUUM ANALYZE;"

# 2. Clean up old audit logs (older than 90 days)
sudo -u postgres psql election_enrollment -c "
DELETE FROM audit_logs 
WHERE changed_at < NOW() - INTERVAL '90 days';"

# 3. Clean up orphaned file attachments
sudo -u postgres psql election_enrollment -c "
DELETE FROM file_attachments 
WHERE submission_id NOT IN (SELECT id FROM submissions);"
```

#### Index Maintenance
```bash
# Reindex database for optimal performance
sudo -u postgres psql election_enrollment -c "REINDEX DATABASE election_enrollment;"
```

### Monthly Maintenance Tasks

#### Data Archiving
```bash
# Archive old submissions (older than 2 years)
sudo -u postgres psql election_enrollment -c "
CREATE TABLE submissions_archive AS 
SELECT * FROM submissions 
WHERE submitted_at < NOW() - INTERVAL '2 years';

DELETE FROM submissions 
WHERE submitted_at < NOW() - INTERVAL '2 years';"
```

#### Statistics Update
```bash
# Update database statistics
sudo -u postgres psql election_enrollment -c "ANALYZE;"
```

---

## Monitoring & Health Checks

### Database Health Monitoring

#### Connection Monitoring
```bash
# Check active connections
sudo -u postgres psql election_enrollment -c "
SELECT 
    state,
    COUNT(*) as connections,
    MAX(now() - state_change) as max_age
FROM pg_stat_activity 
WHERE datname = 'election_enrollment'
GROUP BY state;"
```

#### Performance Monitoring
```bash
# Check slow queries
sudo -u postgres psql election_enrollment -c "
SELECT 
    query,
    mean_time,
    calls,
    total_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;"
```

#### Storage Monitoring
```bash
# Check database size
sudo -u postgres psql -c "
SELECT 
    datname,
    pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database 
WHERE datname = 'election_enrollment';"

# Check table sizes
sudo -u postgres psql election_enrollment -c "
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename)) as size,
    pg_size_pretty(pg_relation_size(tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(tablename) - pg_relation_size(tablename)) as index_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename) DESC;"
```

### Application Health Monitoring

#### PM2 Monitoring
```bash
# Check application status
pm2 status

# Monitor resource usage
pm2 monit

# Check logs for errors
pm2 logs voter-app --lines 100 | grep -i error
```

#### System Resource Monitoring
```bash
# Check CPU and memory usage
htop

# Check disk usage
df -h

# Check disk I/O
iostat -x 1 5
```

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Database Connection Issues

**Problem**: "Connection refused" or "Authentication failed"

**Diagnosis**:
```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Check port availability
sudo netstat -tlnp | grep 5432

# Test connection
sudo -u postgres psql -c "SELECT version();"
```

**Solutions**:
```bash
# Restart PostgreSQL
sudo systemctl restart postgresql

# Check PostgreSQL logs
sudo tail -50 /var/log/postgresql/postgresql-*.log

# Reset password if needed
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'new_password';"
```

#### Application Crashes

**Problem**: Application stops responding or crashes

**Diagnosis**:
```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs voter-app --lines 100

# Check system resources
free -h
df -h
```

**Solutions**:
```bash
# Restart application
pm2 restart voter-app

# Check for memory leaks
pm2 monit

# Restart with fresh memory
pm2 stop voter-app
pm2 start voter-app
```

#### Data Corruption

**Problem**: Data inconsistencies or missing records

**Diagnosis**:
```bash
# Check database integrity
sudo -u postgres psql election_enrollment -c "
SELECT 
    schemaname,
    tablename,
    n_tup_ins,
    n_tup_upd,
    n_tup_del
FROM pg_stat_user_tables;"
```

**Solutions**:
```bash
# Reindex database
sudo -u postgres psql election_enrollment -c "REINDEX DATABASE election_enrollment;"

# Restore from backup if corruption is severe
./scripts/production-restore.sh
```

#### Performance Issues

**Problem**: Slow queries or high CPU usage

**Diagnosis**:
```bash
# Check active queries
sudo -u postgres psql election_enrollment -c "
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query,
    state
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';"
```

**Solutions**:
```bash
# Kill long-running queries
sudo -u postgres psql election_enrollment -c "SELECT pg_terminate_backend(pid);"

# Analyze and vacuum
sudo -u postgres psql election_enrollment -c "VACUUM ANALYZE;"

# Check for missing indexes
sudo -u postgres psql election_enrollment -c "
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public';"
```

---

## Emergency Procedures

### Complete System Failure

#### Step 1: Assess the Situation
```bash
# Check system status
sudo systemctl status postgresql
pm2 status
df -h
free -h
```

#### Step 2: Restore Database
```bash
# Stop all services
pm2 stop all
sudo systemctl stop postgresql

# Restore from latest backup
sudo systemctl start postgresql
./scripts/production-restore.sh
```

#### Step 3: Restart Services
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Start application
pm2 start voter-app

# Verify functionality
curl http://localhost:3000/api/health
```

### Data Loss Recovery

#### Step 1: Identify Data Loss
```bash
# Check submission count
sudo -u postgres psql election_enrollment -c "SELECT COUNT(*) FROM submissions;"

# Check recent submissions
sudo -u postgres psql election_enrollment -c "
SELECT COUNT(*) FROM submissions 
WHERE submitted_at > NOW() - INTERVAL '24 hours';"
```

#### Step 2: Restore from Backup
```bash
# Find latest backup
ls -la /var/backups/voter-app/ | tail -5

# Restore from specific backup
gunzip -c /var/backups/voter-app/election_enrollment_YYYYMMDD_HHMMSS.sql.gz | sudo -u postgres psql election_enrollment
```

#### Step 3: Verify Data Integrity
```bash
# Check data consistency
sudo -u postgres psql election_enrollment -c "
SELECT 
    COUNT(*) as total_submissions,
    COUNT(DISTINCT mobile_number) as unique_mobiles,
    COUNT(DISTINCT aadhaar_number) as unique_aadhaars
FROM submissions;"
```

### Security Breach Response

#### Step 1: Immediate Response
```bash
# Stop application
pm2 stop voter-app

# Change database password
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'new_secure_password';"

# Update application configuration
nano /var/www/voter-app/.env.local
```

#### Step 2: Security Audit
```bash
# Check for suspicious activity
sudo -u postgres psql election_enrollment -c "
SELECT 
    ip_address,
    COUNT(*) as attempts,
    MAX(submitted_at) as last_attempt
FROM submissions 
WHERE submitted_at > NOW() - INTERVAL '24 hours'
GROUP BY ip_address
ORDER BY attempts DESC;"
```

#### Step 3: Restore Secure State
```bash
# Restart with new credentials
pm2 start voter-app

# Monitor for continued issues
pm2 logs voter-app --lines 50
```

---

## Security Best Practices

### Database Security

#### Access Control
```bash
# Create application-specific user
sudo -u postgres psql -c "
CREATE USER voter_app WITH PASSWORD 'secure_app_password';
GRANT CONNECT ON DATABASE election_enrollment TO voter_app;
GRANT USAGE ON SCHEMA public TO voter_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO voter_app;"
```

#### Connection Security
```bash
# Configure PostgreSQL for SSL
sudo nano /etc/postgresql/*/main/postgresql.conf
# Set: ssl = on

# Configure client authentication
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Add: hostssl election_enrollment voter_app 127.0.0.1/32 md5
```

### Backup Security

#### Encrypted Backups
```bash
# Create encrypted backup
pg_dump election_enrollment | gzip | openssl enc -aes-256-cbc -salt -out backup_$(date +%Y%m%d).enc

# Restore encrypted backup
openssl enc -aes-256-cbc -d -in backup_YYYYMMDD.enc | gunzip | psql election_enrollment
```

#### Secure Backup Storage
```bash
# Copy backup to secure location
scp /var/backups/voter-app/latest_backup.sql.gz user@secure-server:/secure/backups/

# Verify backup integrity
md5sum /var/backups/voter-app/latest_backup.sql.gz
```

### Monitoring Security

#### Log Monitoring
```bash
# Monitor failed login attempts
sudo tail -f /var/log/postgresql/postgresql-*.log | grep -i "authentication failed"

# Monitor suspicious queries
sudo -u postgres psql election_enrollment -c "
SELECT 
    usename,
    client_addr,
    query,
    query_start
FROM pg_stat_activity 
WHERE state = 'active' 
AND query NOT LIKE '%pg_stat_activity%';"
```

---

## Maintenance Schedule

### Daily Tasks (5 minutes)
- [ ] Check system status
- [ ] Verify backup completion
- [ ] Monitor error logs
- [ ] Check disk space

### Weekly Tasks (30 minutes)
- [ ] Database vacuum and analyze
- [ ] Clean up old audit logs
- [ ] Check for orphaned records
- [ ] Review performance metrics

### Monthly Tasks (2 hours)
- [ ] Full system backup
- [ ] Archive old data
- [ ] Update system packages
- [ ] Security audit
- [ ] Performance optimization

### Quarterly Tasks (4 hours)
- [ ] Disaster recovery test
- [ ] Security penetration test
- [ ] Capacity planning review
- [ ] Documentation update

---

## Contact Information

### Emergency Contacts
- **System Administrator**: [Your Contact]
- **Database Administrator**: [Your Contact]
- **Security Team**: [Your Contact]

### Escalation Procedures
1. **Level 1**: Check logs and restart services
2. **Level 2**: Restore from backup
3. **Level 3**: Contact emergency support
4. **Level 4**: Activate disaster recovery plan

---

## Appendices

### Appendix A: Database Schema
```sql
-- Users table structure
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'volunteer',
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(20),
    district VARCHAR(255),
    taluka VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table structure
CREATE TABLE submissions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    surname VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    fathers_husband_name VARCHAR(255) NOT NULL,
    sex VARCHAR(10) NOT NULL CHECK (sex IN ('M', 'F')),
    date_of_birth DATE NOT NULL,
    age_years INTEGER NOT NULL,
    age_months INTEGER NOT NULL,
    district VARCHAR(255) NOT NULL,
    taluka VARCHAR(255) NOT NULL,
    village_name VARCHAR(255) NOT NULL,
    house_no VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    aadhaar_number VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Appendix B: Useful Commands Reference
```bash
# Database operations
sudo -u postgres psql election_enrollment
pg_dump election_enrollment > backup.sql
psql election_enrollment < backup.sql

# Application management
pm2 status
pm2 restart voter-app
pm2 logs voter-app

# System monitoring
htop
df -h
sudo systemctl status postgresql
```

### Appendix C: Troubleshooting Checklist
- [ ] Check PostgreSQL service status
- [ ] Verify database connectivity
- [ ] Check application logs
- [ ] Monitor system resources
- [ ] Verify backup integrity
- [ ] Check network connectivity
- [ ] Review security logs
- [ ] Test restore procedures

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 3 months]
