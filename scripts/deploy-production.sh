#!/bin/bash

echo "🚀 PRODUCTION VPS DEPLOYMENT SCRIPT"
echo "=================================="

# Configuration
VPS_IP="YOUR_VPS_IP"
VPS_USER="root"  # or your VPS username
APP_DIR="/var/www/voter-app"
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

# Check if VPS IP is provided
if [ -z "$VPS_IP" ] || [ "$VPS_IP" = "YOUR_VPS_IP" ]; then
    error "Please set VPS_IP in the script first!"
    exit 1
fi

log "Starting production deployment to $VPS_IP..."

# Step 1: Prepare local files
log "📦 Preparing deployment package..."
tar -czf voter-app-deployment.tar.gz \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    --exclude=*.log \
    --exclude=data/uploads \
    --exclude=data/pdfs \
    .

# Step 2: Upload to VPS
log "📤 Uploading to VPS..."
scp voter-app-deployment.tar.gz $VPS_USER@$VPS_IP:/tmp/

# Step 3: Deploy on VPS
log "🔧 Deploying on VPS..."
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    set -e
    
    echo "🔄 Starting VPS deployment..."
    
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
    
    # Extract application
    tar -xzf /tmp/voter-app-deployment.tar.gz
    rm /tmp/voter-app-deployment.tar.gz
    
    # Install dependencies
    npm install
    
    # Create production environment file
    cat > .env.local << 'ENVEOF'
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=election_enrollment
DB_USER=postgres
DB_PASSWORD=your_secure_production_password_here

# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Application Configuration
NODE_ENV=production
PORT=3000

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_minimum_32_characters
JWT_EXPIRES_IN=24h
ENCRYPTION_KEY=your_encryption_key_for_sensitive_data

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
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
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="election_enrollment_$DATE.sql"

mkdir -p $BACKUP_DIR
sudo -u postgres pg_dump election_enrollment | gzip > $BACKUP_DIR/$BACKUP_FILE.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "✅ Production backup created: $BACKUP_FILE.gz"
BACKUPEOF
    
    chmod +x scripts/production-backup.sh
    
    # Create production restore script
    cat > scripts/production-restore.sh << 'RESTOREEOF'
#!/bin/bash
BACKUP_DIR="/var/backups/voter-app"
LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.sql.gz | head -n1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ No backup found"
    exit 1
fi

echo "🔄 Restoring from: $LATEST_BACKUP"

# Stop application
pkill -f "next" 2>/dev/null || true

# Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS election_enrollment;"
sudo -u postgres psql -c "CREATE DATABASE election_enrollment;"

# Restore from backup
gunzip -c $LATEST_BACKUP | sudo -u postgres psql election_enrollment

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
    
    # Create Nginx config
    cat > /etc/nginx/sites-available/voter-app << 'NGINXEOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF
    
    # Enable site
    ln -s /etc/nginx/sites-available/voter-app /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload Nginx
    nginx -t
    systemctl reload nginx
    
    # Setup SSL with Let's Encrypt (optional)
    # apt install -y certbot python3-certbot-nginx
    # certbot --nginx -d your-domain.com -d www.your-domain.com
    
    echo "✅ Production deployment completed!"
    echo "🌐 Your app should be available at: http://$VPS_IP"
    echo "📊 Check status with: pm2 status"
    echo "📝 View logs with: pm2 logs voter-app"
ENDSSH

# Step 4: Cleanup
log "🧹 Cleaning up..."
rm voter-app-deployment.tar.gz

log "✅ Production deployment completed!"
log "🌐 Your app is now running on: http://$VPS_IP"
log "📊 To check status: ssh $VPS_USER@$VPS_IP 'pm2 status'"
log "📝 To view logs: ssh $VPS_USER@$VPS_IP 'pm2 logs voter-app'"