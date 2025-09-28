#!/bin/bash

# High Concurrency Deployment Script for 100-200 Users
# This script optimizes the system for high concurrent load

echo "🚀 Deploying Voter Data Collection System for High Concurrency (100-200 users)"
echo "=================================================================="

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please do not run this script as root"
    exit 1
fi

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+ (required for Next.js 14)
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
echo "📦 Installing PM2 process manager..."
sudo npm install -g pm2

# Install PostgreSQL 14+ with optimizations
echo "🗄️ Installing PostgreSQL with high concurrency optimizations..."
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configure PostgreSQL for high concurrency
echo "⚙️ Configuring PostgreSQL for high concurrency..."

# Backup original config
sudo cp /etc/postgresql/*/main/postgresql.conf /etc/postgresql/*/main/postgresql.conf.backup

# Create optimized PostgreSQL configuration
sudo tee -a /etc/postgresql/*/main/postgresql.conf > /dev/null <<EOF

# High Concurrency Optimizations for 100-200 Users
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
max_worker_processes = 8
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
max_parallel_maintenance_workers = 4

# Connection and Query Optimizations
tcp_keepalives_idle = 600
tcp_keepalives_interval = 30
tcp_keepalives_count = 3
statement_timeout = 30000
idle_in_transaction_session_timeout = 300000

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

# Restart PostgreSQL to apply changes
echo "🔄 Restarting PostgreSQL with new configuration..."
sudo systemctl restart postgresql

# Create database and user
echo "🗄️ Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE election_enrollment;"
sudo -u postgres psql -c "CREATE USER election_user WITH PASSWORD 'secure_password_123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE election_enrollment TO election_user;"
sudo -u postgres psql -c "ALTER USER election_user CREATEDB;"

# Install application dependencies
echo "📦 Installing application dependencies..."
npm install --production

# Build the application
echo "🏗️ Building the application..."
npm run build

# Create PM2 ecosystem file for high concurrency
echo "⚙️ Creating PM2 configuration for high concurrency..."
cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [{
    name: 'voter-data-collection',
    script: 'npm',
    args: 'start',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // High concurrency optimizations
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    // Auto-restart on crashes
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}
EOF

# Create systemd service for PM2
echo "⚙️ Creating systemd service for PM2..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/voter-data-collection > /dev/null <<EOF
/home/$USER/.pm2/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Create monitoring script
echo "📊 Creating monitoring script..."
cat > monitor.sh <<'EOF'
#!/bin/bash
echo "📊 Voter Data Collection System Monitor"
echo "======================================"
echo "🕐 $(date)"
echo ""

echo "🔗 PM2 Process Status:"
pm2 status
echo ""

echo "💾 Memory Usage:"
free -h
echo ""

echo "💽 Disk Usage:"
df -h /
echo ""

echo "🗄️ Database Connections:"
sudo -u postgres psql -d election_enrollment -c "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';"
echo ""

echo "📈 System Load:"
uptime
echo ""

echo "🔍 Recent Logs (last 10 lines):"
pm2 logs --lines 10
EOF

chmod +x monitor.sh

# Create health check endpoint
echo "🏥 Setting up health check..."
cat > health-check.js <<'EOF'
const http = require('http');
const { healthCheck } = require('./lib/database');

const server = http.createServer(async (req, res) => {
  if (req.url === '/health') {
    try {
      const health = await healthCheck();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(health, null, 2));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: error.message }));
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3001, () => {
  console.log('Health check server running on port 3001');
});
EOF

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 3000
sudo ufw allow 3001
sudo ufw --force enable

# Create backup script
echo "💾 Creating backup script..."
cat > backup.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/home/$USER/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -h localhost -U election_user -d election_enrollment > $BACKUP_DIR/database_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz --exclude=node_modules --exclude=.next .

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x backup.sh

# Setup cron job for backups
echo "⏰ Setting up automated backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * /home/$USER/backup.sh") | crontab -

echo ""
echo "🎉 High Concurrency Deployment Complete!"
echo "========================================"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env.local with your production database credentials"
echo "2. Run: npm run db:setup"
echo "3. Test the application: curl http://localhost:3000"
echo "4. Monitor with: ./monitor.sh"
echo "5. Health check: curl http://localhost:3001/health"
echo ""
echo "🔧 Management Commands:"
echo "• Start: pm2 start ecosystem.config.js"
echo "• Stop: pm2 stop all"
echo "• Restart: pm2 restart all"
echo "• Logs: pm2 logs"
echo "• Monitor: pm2 monit"
echo ""
echo "📊 System is optimized for 100-200 concurrent users!"
