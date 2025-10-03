#!/bin/bash

echo "🚀 GIT-BASED VPS DEPLOYMENT SCRIPT"
echo "=================================="

# Configuration - UPDATE THESE VALUES
VPS_IP="72.60.200.12"
VPS_USER="root"
GODADDY_DOMAIN="padvidhar.com"
APP_DIR="/var/www/voter-app"
GIT_REPO="https://github.com/yourusername/voter-app.git"  # Update with your actual repo
BACKUP_DIR="/var/backups/voter-app"
DB_NAME="election_enrollment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Check if Git repo is configured
if [ -z "$GIT_REPO" ] || [ "$GIT_REPO" = "https://github.com/yourusername/voter-app.git" ]; then
    error "Please update GIT_REPO in the script with your actual GitHub repository!"
    exit 1
fi

log "Starting Git-based deployment to $VPS_IP with domain $GODADDY_DOMAIN..."

# Step 1: Deploy on VPS via SSH
log "🔧 Deploying on VPS with Git..."
ssh $VPS_USER@$VPS_IP << ENDSSH
    set -e
    
    echo "🔄 Starting Git-based VPS deployment with domain: $GODADDY_DOMAIN"
    
    # Update system
    apt update -y
    
    # Install required packages
    apt install -y curl wget git build-essential software-properties-common
    
    # Install Node.js 18.x
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    
    # Install PostgreSQL
    apt install -y postgresql postgresql-contrib postgresql-client
    
    # Start and enable PostgreSQL
    systemctl start postgresql
    systemctl enable postgresql
    
    # Create application directory
    mkdir -p $APP_DIR
    cd $APP_DIR
    
    # Clone or update repository
    if [ -d ".git" ]; then
        echo "📥 Updating existing repository..."
        git pull origin main
    else
        echo "📥 Cloning repository for first time..."
        git clone $GIT_REPO .
    fi
    
    # Install dependencies
    npm install
    
    # Create production environment file with domain configuration
    cat > .env.local << ENVEOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=election_enrollment
DB_USER=postgres
DB_PASSWORD=your_secure_production_password_here

# Domain Configuration - GoDaddy Domain
NEXT_PUBLIC_BASE_URL=https://$GODADDY_DOMAIN

# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Application Configuration
NODE_ENV=production
PORT=3000

# Security (CRITICAL - Change these in production)
JWT_SECRET=your_super_secret_jwt_key_minimum_64_characters_for_production_security
JWT_EXPIRES_IN=24h
ENCRYPTION_KEY=your_encryption_key_for_sensitive_data_minimum_32_characters

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Load Balancer Configuration
TRUST_PROXY=true
FORWARDED_FOR_HEADER=x-forwarded-for
ENVEOF
    
    # Setup database with persistent storage
    echo "🗄️ Setting up database with persistent storage..."
    
    # Create persistent directory
    mkdir -p /var/lib/postgresql-persistent
    chown postgres:postgres /var/lib/postgresql-persistent
    
    # Stop PostgreSQL
    systemctl stop postgresql
    
    # Move data to persistent location
    cp -r /var/lib/postgresql /var/lib/postgresql-persistent
    rm -rf /var/lib/postgresql
    ln -s /var/lib/postgresql-persistent /var/lib/postgresql
    
    # Start PostgreSQL
    systemctl start postgresql
    
    # Setup database
    npm run setup
    npm run import
    
    # Create backup directory
    mkdir -p $BACKUP_DIR
    
    # Create production backup script
    cat > scripts/production-backup.sh << 'BACKUPEOF'
#!/bin/bash
BACKUP_DIR="/var/backups/voter-app"
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="election_enrollment_\$DATE.sql"

mkdir -p \$BACKUP_DIR
sudo -u postgres pg_dump election_enrollment | gzip > \$BACKUP_DIR/\$BACKUP_FILE.gz

# Keep only last 30 days of backups
find \$BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "✅ Production backup created: \$BACKUP_FILE.gz"
BACKUPEOF
    
    chmod +x scripts/production-backup.sh
    
    # Create production restore script
    cat > scripts/production-restore.sh << 'RESTOREEOF'
#!/bin/bash
BACKUP_DIR="/var/backups/voter-app"
LATEST_BACKUP=\$(ls -t \$BACKUP_DIR/*.sql.gz | head -n1)

if [ -z "\$LATEST_BACKUP" ]; then
    echo "❌ No backup found"
    exit 1
fi

echo "🔄 Restoring from: \$LATEST_BACKUP"

# Stop application
pkill -f "next" 2>/dev/null || true

# Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS election_enrollment;"
sudo -u postgres psql -c "CREATE DATABASE election_enrollment;"

# Restore from backup
gunzip -c \$LATEST_BACKUP | sudo -u postgres psql election_enrollment

echo "✅ Database restored successfully"
RESTOREEOF
    
    chmod +x scripts/production-restore.sh
    
    # Setup automated backups (daily at 2 AM)
    (crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/scripts/production-backup.sh") | crontab -
    
    # Install PM2 for process management
    npm install -g pm2
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << 'PM2EOF'
module.exports = {
  apps: [{
    name: 'voter-app',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/voter-app-error.log',
    out_file: '/var/log/voter-app-out.log',
    log_file: '/var/log/voter-app.log',
    time: true,
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}
PM2EOF
    
    # Start application with PM2
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    
    # Install and configure Nginx
    apt install -y nginx
    
    # Create Nginx config for GoDaddy domain
    cat > /etc/nginx/sites-available/voter-app << 'NGINXEOF'
server {
    listen 80;
    server_name $GODADDY_DOMAIN www.$GODADDY_DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINXEOF
    
    # Enable site
    ln -s /etc/nginx/sites-available/voter-app /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload Nginx
    nginx -t
    systemctl reload nginx
    
    # Install Certbot for SSL
    apt install -y certbot python3-certbot-nginx
    
    # Setup SSL with Let's Encrypt
    certbot --nginx -d $GODADDY_DOMAIN -d www.$GODADDY_DOMAIN --non-interactive --agree-tos --email admin@$GODADDY_DOMAIN
    
    echo "✅ Git-based production deployment completed!"
    echo "🌐 Your app should be available at: https://$GODADDY_DOMAIN"
    echo "📊 Check status with: pm2 status"
    echo "📝 View logs with: pm2 logs voter-app"
ENDSSH

log "✅ Git-based deployment completed!"
log "🌐 Your app is now running on: https://$GODADDY_DOMAIN"
log "📊 To check status: ssh $VPS_USER@$VPS_IP 'pm2 status'"
log "📝 To view logs: ssh $VPS_USER@$VPS_IP 'pm2 logs voter-app'"
log ""
log "🔧 Next steps:"
log "1. Update DNS records in GoDaddy to point to $VPS_IP"
log "2. Wait for DNS propagation (5-30 minutes)"
log "3. Test your domain: https://$GODADDY_DOMAIN"
log "4. Update Twilio webhook URLs to use your domain"
log ""
log "🔄 For future updates:"
log "1. Push changes to GitHub: git push origin main"
log "2. Update on VPS: ssh $VPS_USER@$VPS_IP 'cd $APP_DIR && git pull && npm install && pm2 restart voter-app'"
