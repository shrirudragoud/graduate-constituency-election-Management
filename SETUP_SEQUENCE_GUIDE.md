# Complete Setup Sequence Guide

## 🎯 **OPTIMAL SETUP SEQUENCE**

Based on the system architecture analysis, here's the **recommended order** for setting up the Election Management System:

### **Phase 1: Ubuntu System Setup (FIRST)**
```bash
# 1. Connect to your Ubuntu VPS
ssh username@your-server-ip

# 2. Clone the repository
git clone https://github.com/shrirudragoud/Voter-Data-Collection-.git election-app
cd election-app

# 3. Run Ubuntu system setup (Infrastructure)
chmod +x scripts/ubuntu-setup-enhanced.sh
./scripts/ubuntu-setup-enhanced.sh
```

**Why First?** This sets up the foundational infrastructure:
- Ubuntu system updates
- Node.js 18.x LTS installation
- PostgreSQL 15 with high-concurrency configuration
- PM2 process manager
- Nginx reverse proxy
- System monitoring and backup scripts

### **Phase 2: Environment & Credentials Setup (SECOND)**
```bash
# 4. Configure environment and credentials
node scripts/setup-environment-credentials.js setup
```

**Why Second?** This configures the application environment:
- Database connection parameters
- Twilio WhatsApp credentials
- JWT secrets and security settings
- File upload configurations
- Rate limiting settings

### **Phase 3: Database & Application Setup (THIRD)**
```bash
# 5. Setup database schema and application
./scripts/quick-recovery-setup.sh --setup-only

# 6. Recover/migrate existing data (if any)
./scripts/quick-recovery-setup.sh --recover-only

# 7. Start the application
./scripts/quick-recovery-setup.sh --start-only
```

**Why Third?** This completes the application setup:
- Database schema creation
- Indexes and constraints setup
- Data migration from various sources
- Application build and deployment

## 🔄 **Alternative Setup Options**

### **Option A: Complete Automated Setup (Recommended)**
```bash
# One-command complete setup
./scripts/ubuntu-setup-enhanced.sh && \
node scripts/setup-environment-credentials.js setup && \
./scripts/quick-recovery-setup.sh --full
```

### **Option B: Step-by-Step Manual Setup**
```bash
# 1. Ubuntu system only
./scripts/ubuntu-setup-enhanced.sh

# 2. Environment configuration
node scripts/setup-environment-credentials.js setup

# 3. Database setup only
./scripts/quick-recovery-setup.sh --setup-only

# 4. Data recovery only
./scripts/quick-recovery-setup.sh --recover-only

# 5. Start application only
./scripts/quick-recovery-setup.sh --start-only
```

### **Option C: Development Setup (Local)**
```bash
# For local development
node scripts/setup-environment-credentials.js setup
node scripts/setup-connection-sequence.js
node scripts/setup-database.js
node scripts/import-data.js
npm run dev
```

## 📋 **Detailed Setup Process**

### **Step 1: Ubuntu System Setup**

The enhanced Ubuntu setup script (`ubuntu-setup-enhanced.sh`) performs:

#### **System Requirements Check**
- Ubuntu version validation (20.04+ recommended)
- Memory check (2GB+ recommended)
- Disk space check (20GB+ recommended)
- Root user validation

#### **Package Installation**
```bash
# System packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential software-properties-common \
    htop nano vim unzip zip jq bc postgresql-client-common

# Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL 15
sudo apt install -y postgresql postgresql-contrib postgresql-client

# PM2 Process Manager
sudo npm install -g pm2

# Nginx (Optional)
sudo apt install -y nginx
```

#### **PostgreSQL Configuration**
```bash
# High-concurrency settings
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
# ... additional optimizations
```

#### **Database Setup**
```bash
# Create database and user
sudo -u postgres psql -c "CREATE DATABASE election_enrollment;"
sudo -u postgres psql -c "CREATE USER voter_app WITH PASSWORD 'HiveTech@8180';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE election_enrollment TO voter_app;"
```

### **Step 2: Environment Configuration**

The environment setup script (`setup-environment-credentials.js`) provides:

#### **Interactive Configuration**
- Database connection parameters
- Twilio WhatsApp credentials
- Security settings (JWT secrets)
- Application configuration
- Service integration testing

#### **Environment File Creation**
```bash
# .env.local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=election_enrollment
DB_USER=voter_app
DB_PASSWORD=HiveTech@8180
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
JWT_SECRET=auto_generated_secure_key
# ... additional settings
```

### **Step 3: Database & Application Setup**

The quick recovery setup script (`quick-recovery-setup.sh`) handles:

#### **Database Schema Creation**
- Users table with role-based access
- Submissions table with comprehensive fields
- File attachments table
- Audit logs table
- Statistics table
- Indexes and constraints

#### **Data Recovery Options**
- SQL backup restoration
- JSON data migration
- CSV data import
- Data validation and cleaning

#### **Application Deployment**
- PM2 ecosystem configuration
- Process management
- Health monitoring
- Performance optimization

## 🔧 **Setup Scripts Overview**

### **1. Ubuntu System Setup**
- **File**: `scripts/ubuntu-setup-enhanced.sh`
- **Purpose**: Infrastructure setup
- **Dependencies**: None
- **Run First**: Yes

### **2. Environment Configuration**
- **File**: `scripts/setup-environment-credentials.js`
- **Purpose**: Application configuration
- **Dependencies**: Node.js
- **Run Second**: Yes

### **3. Connection Testing**
- **File**: `scripts/setup-connection-sequence.js`
- **Purpose**: Validate connections
- **Dependencies**: Database, Environment
- **Run Third**: Optional (for testing)

### **4. Database Setup**
- **File**: `scripts/setup-database.js`
- **Purpose**: Create schema
- **Dependencies**: Database, Environment
- **Run Fourth**: Yes

### **5. Data Recovery**
- **File**: `scripts/data-recovery-restore.js`
- **Purpose**: Migrate/restore data
- **Dependencies**: Database, Schema
- **Run Fifth**: If you have data

### **6. Quick Setup**
- **File**: `scripts/quick-recovery-setup.sh`
- **Purpose**: Orchestrate setup
- **Dependencies**: All above
- **Run Last**: Yes

## 🚨 **Common Setup Issues & Solutions**

### **Issue 1: Database Connection Failed**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check logs
sudo journalctl -u postgresql -f

# Test connection
psql -h localhost -U voter_app -d election_enrollment
```

### **Issue 2: Node.js Version Issues**
```bash
# Check Node.js version
node --version

# Reinstall if needed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### **Issue 3: Permission Denied**
```bash
# Check file permissions
ls -la scripts/

# Make scripts executable
chmod +x scripts/*.sh
chmod +x scripts/*.js
```

### **Issue 4: Environment Variables Not Loaded**
```bash
# Check .env.local exists
ls -la .env.local

# Verify environment loading
node -e "require('dotenv').config({path: '.env.local'}); console.log(process.env.DB_HOST);"
```

## 📊 **Setup Validation Checklist**

### **System Level**
- [ ] Ubuntu 20.04+ installed
- [ ] Node.js 18.x installed
- [ ] PostgreSQL 15 installed
- [ ] PM2 installed
- [ ] Nginx installed (optional)
- [ ] System packages updated

### **Database Level**
- [ ] PostgreSQL running
- [ ] Database created
- [ ] User created with privileges
- [ ] Connection tested
- [ ] Schema created
- [ ] Indexes created

### **Application Level**
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Database connected
- [ ] Application built
- [ ] PM2 configured
- [ ] Application running

### **Data Level**
- [ ] Data migrated (if applicable)
- [ ] Data validated
- [ ] Duplicates handled
- [ ] Integrity verified

## 🎯 **Production Deployment Sequence**

### **For Production Servers**
```bash
# 1. Ubuntu system setup
./scripts/ubuntu-setup-enhanced.sh

# 2. Environment configuration (with production values)
node scripts/setup-environment-credentials.js setup

# 3. Database setup
./scripts/quick-recovery-setup.sh --setup-only

# 4. Data recovery (if migrating from existing system)
./scripts/quick-recovery-setup.sh --recover-only

# 5. SSL certificate setup
sudo certbot --nginx -d your-domain.com

# 6. Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **For Development Environment**
```bash
# 1. Environment setup
node scripts/setup-environment-credentials.js setup

# 2. Database setup
node scripts/setup-database.js

# 3. Sample data
node scripts/import-data.js

# 4. Start development server
npm run dev
```

## 🔍 **Post-Setup Verification**

### **System Health Check**
```bash
# Check all services
sudo systemctl status postgresql
pm2 status
sudo systemctl status nginx

# Check resources
htop
free -h
df -h
```

### **Application Health Check**
```bash
# Test API endpoints
curl http://localhost:3000/api/health

# Check logs
pm2 logs election-app

# Monitor performance
pm2 monit
```

### **Database Health Check**
```bash
# Check connections
psql -h localhost -U voter_app -d election_enrollment -c "SELECT count(*) FROM pg_stat_activity;"

# Check tables
psql -h localhost -U voter_app -d election_enrollment -c "\dt"

# Check data
psql -h localhost -U voter_app -d election_enrollment -c "SELECT COUNT(*) FROM submissions;"
```

## 📈 **Performance Optimization**

### **Database Optimization**
- Connection pooling configured
- Indexes created for common queries
- Query optimization enabled
- Logging configured for monitoring

### **Application Optimization**
- PM2 cluster mode enabled
- Memory limits configured
- Process monitoring enabled
- Automatic restarts configured

### **System Optimization**
- Nginx reverse proxy configured
- SSL termination enabled
- Firewall configured
- Monitoring scripts installed

This comprehensive setup sequence ensures a robust, scalable, and secure deployment of your Election Management System! 🚀
