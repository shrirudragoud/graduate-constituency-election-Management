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

# Install PostgreSQL 15
echo "🐘 Installing PostgreSQL 15..."
sudo apt install -y postgresql postgresql-contrib postgresql-client

# Start and enable PostgreSQL
echo "🔄 Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configure PostgreSQL for better performance
echo "⚙️ Configuring PostgreSQL for high concurrency..."

# Backup original config
sudo cp /etc/postgresql/*/main/postgresql.conf /etc/postgresql/*/main/postgresql.conf.backup

# Update PostgreSQL configuration for concurrency
sudo tee -a /etc/postgresql/*/main/postgresql.conf << EOF

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
sudo tee -a /etc/postgresql/*/main/pg_hba.conf << EOF

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
sudo -u postgres psql -c "CREATE DATABASE election_enrollment;"
sudo -u postgres psql -c "CREATE USER voter_app WITH PASSWORD 'voter_password_2024';"
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
DB_PASSWORD=voter_password_2024

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
npm run db:setup

# Migrate existing JSON data (if any)
echo "🔄 Migrating existing data..."
npm run db:migrate

# Build the application
echo "🔨 Building application..."
npm run build

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'voter-app',
    script: 'npm',
    args: 'start',
    cwd: '/home/\$(whoami)/voter-app',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // Health check
    health_check_grace_period: 3000,
    // Restart policy
    min_uptime: '10s',
    max_restarts: 10,
    // Advanced options
    kill_timeout: 5000,
    listen_timeout: 3000,
    // Process management
    increment_var: 'PORT',
    // Logging
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
EOF

# Create logs directory
mkdir -p logs

# Setup Nginx for load balancing and SSL termination
echo "🌐 Setting up Nginx..."
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/voter-app << EOF
# Rate limiting
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=form:10m rate=5r/s;

# Upstream for load balancing
upstream voter_app {
    least_conn;
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3002 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3003 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # API routes with rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://voter_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Form submission with stricter rate limiting
    location /api/submit-form {
        limit_req zone=form burst=5 nodelay;
        proxy_pass http://voter_app;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 30s;
    }

    # Static files
    location / {
        proxy_pass http://voter_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # File uploads
    location /data/uploads/ {
        alias /home/\$(whoami)/voter-app/data/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/voter-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw --force enable

# Setup log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/voter-app << EOF
/home/\$(whoami)/voter-app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 \$(whoami) \$(whoami)
    postrotate
        pm2 reload voter-app
    endscript
}
EOF

# Setup monitoring script
echo "📊 Creating monitoring script..."
cat > monitor.sh << 'EOF'
#!/bin/bash

# Voter App Monitoring Script
echo "=== Voter App Status ==="
echo "Date: $(date)"
echo ""

echo "=== PM2 Status ==="
pm2 status
echo ""

echo "=== Database Status ==="
psql -h localhost -U voter_app -d election_enrollment -c "SELECT COUNT(*) as total_submissions FROM submissions;" 2>/dev/null || echo "Database connection failed"
echo ""

echo "=== System Resources ==="
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')"
echo "Memory Usage: $(free | grep Mem | awk '{printf "%.2f%%", $3/$2 * 100.0}')"
echo "Disk Usage: $(df -h / | awk 'NR==2{printf "%s", $5}')"
echo ""

echo "=== Recent Logs ==="
tail -n 10 logs/combined.log 2>/dev/null || echo "No logs found"
EOF

chmod +x monitor.sh

# Create backup script
echo "💾 Creating backup script..."
cat > backup.sh << 'EOF'
#!/bin/bash

# Backup script for Voter App
BACKUP_DIR="/home/$(whoami)/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "Creating backup for $DATE..."

# Backup database
pg_dump -h localhost -U voter_app election_enrollment > $BACKUP_DIR/db_backup_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz --exclude=node_modules --exclude=logs .

echo "Backup completed: $BACKUP_DIR"
EOF

chmod +x backup.sh

echo "✅ Setup complete!"
echo ""
echo "📋 Configuration Summary:"
echo "   Database: PostgreSQL 15 with optimized settings"
echo "   Application: Node.js 18.x with PM2 cluster mode"
echo "   Web Server: Nginx with load balancing and rate limiting"
echo "   Security: Firewall configured, security headers enabled"
echo "   Monitoring: Log rotation and monitoring scripts created"
echo ""
echo "🔧 Next steps:"
echo "   1. Update .env.local with your Twilio credentials"
echo "   2. Update Nginx configuration with your domain"
echo "   3. Start the application: pm2 start ecosystem.config.js"
echo "   4. Check status: pm2 status"
echo "   5. View logs: pm2 logs voter-app"
echo "   6. Monitor: ./monitor.sh"
echo ""
echo "🌐 Your application will be available at:"
echo "   - Direct: http://your-server-ip:3000"
echo "   - Via Nginx: http://your-domain.com"
echo ""
echo "🔧 Management commands:"
echo "   - Restart app: pm2 restart voter-app"
echo "   - Stop app: pm2 stop voter-app"
echo "   - View logs: pm2 logs voter-app"
echo "   - Monitor: pm2 monit"
echo "   - System status: ./monitor.sh"
echo "   - Backup: ./backup.sh"
echo ""
echo "🚀 Your application is ready for high-concurrency production deployment!"
