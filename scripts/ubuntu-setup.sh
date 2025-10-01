#!/bin/bash

# Ubuntu VPS Setup Script for Voter Data Collection System
# This script sets up PostgreSQL, Node.js, and the application for high-concurrency deployment

set -e  # Exit on any error

echo "🚀 Setting up Voter Data Collection System on Ubuntu for High Concurrency..."
echo "========================================================================"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
  echo "❌ Please don't run this script as root. Use a regular user with sudo access."
  exit 1
fi

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "📦 Installing essential packages..."
sudo apt install -y curl wget git build-essential software-properties-common

# Install Node.js 18.x LTS
echo "📦 Installing Node.js 18.x LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib postgresql-client

# Start and enable PostgreSQL
echo "🔄 Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Detect PostgreSQL version dynamically
PG_VERSION=$(psql -V | awk '{print $3}' | cut -d. -f1)
PG_CONF_DIR="/etc/postgresql/$PG_VERSION/main"

echo "📂 Detected PostgreSQL version: $PG_VERSION"
echo "📂 Using config directory: $PG_CONF_DIR"

# Configure PostgreSQL for better performance
echo "⚙️ Configuring PostgreSQL for high concurrency..."

# Backup original config
sudo cp "$PG_CONF_DIR/postgresql.conf" "$PG_CONF_DIR/postgresql.conf.backup"

# Update PostgreSQL configuration for concurrency
sudo tee -a "$PG_CONF_DIR/postgresql.conf" << EOF

# Custom configuration for high concurrency
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 8
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
max_parallel_maintenance_workers = 4

# Logging for monitoring
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB
log_min_duration_statement = 1000
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on
log_temp_files = 0
log_autovacuum_min_duration = 0
log_error_verbosity = default
EOF

# Update pg_hba.conf for application access
echo "🔐 Configuring PostgreSQL authentication..."
sudo tee -a "$PG_CONF_DIR/pg_hba.conf" << EOF

# Application access
local   election_enrollment   voter_app                    md5
host    election_enrollment   voter_app    127.0.0.1/32   md5
host    election_enrollment   voter_app    ::1/128        md5
EOF

# Restart PostgreSQL to apply changes
echo "🔄 Restarting PostgreSQL with new configuration..."
sudo systemctl restart postgresql

# Create database and user
echo "🗄️ Setting up database and user..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='election_enrollment'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE election_enrollment;"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='voter_app'" | grep -q 1 || sudo -u postgres psql -c "CREATE USER voter_app WITH PASSWORD 'HiveTech';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE election_enrollment TO voter_app;"
sudo -u postgres psql -c "ALTER USER voter_app CREATEDB;"
sudo -u postgres psql -c "ALTER USER voter_app WITH SUPERUSER;" # For development only

# Install PM2 for process management
echo "📦 Installing PM2 for process management..."
sudo npm install -g pm2

# Install application dependencies
echo "📦 Installing application dependencies..."
npm install

# Create environment file
echo "⚙️ Creating environment configuration..."
cat > .env.local << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=election_enrollment
DB_USER=voter_app
DB_PASSWORD=HiveTech

# Twilio WhatsApp Configuration (Add your credentials)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Application Configuration
NODE_ENV=production
PORT=3000

# Security
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_key_here

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./data/uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Setup database tables
echo "🗄️ Setting up database tables..."
npm run db:setup || true

# Migrate existing JSON data (if any)
echo "🔄 Migrating existing data..."
npm run db:migrate || true

# Build the application
echo "🔨 Building application..."
npm run build

# (Rest of your script remains the same: PM2 ecosystem, Nginx, firewall, logs, monitor, backup scripts...)
