#!/bin/bash

# Enhanced Ubuntu VPS Setup Script for Election Management System
# Integrates with data recovery and environment management systems

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check system requirements
check_system_requirements() {
    print_status "Checking system requirements..."
    
    # Check Ubuntu version
    if ! command_exists lsb_release; then
        print_error "lsb_release not found. Please install: sudo apt install lsb-release"
        exit 1
    fi
    
    UBUNTU_VERSION=$(lsb_release -rs)
    print_status "Ubuntu version: $UBUNTU_VERSION"
    
    # Check if version is supported (20.04+)
    if [[ $(echo "$UBUNTU_VERSION < 20.04" | bc -l) -eq 1 ]]; then
        print_warning "Ubuntu $UBUNTU_VERSION detected. Recommended: 20.04 LTS or higher"
    fi
    
    # Check memory
    MEMORY_GB=$(free -g | awk '/^Mem:/{print $2}')
    print_status "Available memory: ${MEMORY_GB}GB"
    
    if [ "$MEMORY_GB" -lt 2 ]; then
        print_warning "Low memory detected (${MEMORY_GB}GB). Recommended: 4GB+"
    fi
    
    # Check disk space
    DISK_SPACE=$(df -h / | awk 'NR==2{print $4}' | sed 's/G//')
    print_status "Available disk space: ${DISK_SPACE}GB"
    
    if [ "${DISK_SPACE%.*}" -lt 20 ]; then
        print_warning "Low disk space detected (${DISK_SPACE}GB). Recommended: 50GB+"
    fi
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        print_error "Please don't run this script as root. Use a regular user with sudo access."
        exit 1
    fi
    
    print_success "System requirements check completed"
}

# Function to update system packages
update_system_packages() {
    print_status "Updating system packages..."
    
    sudo apt update
    sudo apt upgrade -y
    
    # Install essential packages
    sudo apt install -y curl wget git build-essential software-properties-common \
        htop nano vim unzip zip jq bc postgresql-client-common
    
    print_success "System packages updated"
}

# Function to install Node.js
install_nodejs() {
    print_status "Installing Node.js 18.x LTS..."
    
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            print_status "Node.js $NODE_VERSION already installed"
            return
        fi
    fi
    
    # Add NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Verify installation
    print_success "Node.js $(node --version) installed"
    print_success "npm $(npm --version) installed"
}

# Function to install PostgreSQL
install_postgresql() {
    print_status "Installing PostgreSQL..."
    
    if command_exists psql; then
        print_status "PostgreSQL already installed"
        return
    fi
    
    sudo apt install -y postgresql postgresql-contrib postgresql-client
    
    # Start and enable PostgreSQL
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    print_success "PostgreSQL installed and started"
}

# Function to configure PostgreSQL
configure_postgresql() {
    print_status "Configuring PostgreSQL for high concurrency..."
    
    # Detect PostgreSQL version
    PG_VERSION=$(psql -V | awk '{print $3}' | cut -d. -f1)
    PG_CONF_DIR="/etc/postgresql/$PG_VERSION/main"
    
    print_status "PostgreSQL version: $PG_VERSION"
    print_status "Config directory: $PG_CONF_DIR"
    
    # Backup original configuration
    sudo cp "$PG_CONF_DIR/postgresql.conf" "$PG_CONF_DIR/postgresql.conf.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Create optimized configuration
    sudo tee -a "$PG_CONF_DIR/postgresql.conf" << EOF

# High Concurrency Configuration - Election Management System
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

# Logging Configuration
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

    # Configure authentication
    sudo tee -a "$PG_CONF_DIR/pg_hba.conf" << EOF

# Election Management System - Application access
local   election_enrollment   voter_app                    md5
host    election_enrollment   voter_app    127.0.0.1/32   md5
host    election_enrollment   voter_app    ::1/128        md5
EOF

    # Restart PostgreSQL
    sudo systemctl restart postgresql
    
    print_success "PostgreSQL configured for high concurrency"
}

# Function to setup database and user
setup_database() {
    print_status "Setting up database and user..."
    
    # Create database
    sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='election_enrollment'" | grep -q 1 || \
        sudo -u postgres psql -c "CREATE DATABASE election_enrollment;"
    
    # Create application user
    sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='voter_app'" | grep -q 1 || \
        sudo -u postgres psql -c "CREATE USER voter_app WITH PASSWORD 'HiveTech@8180';"
    
    # Grant privileges
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE election_enrollment TO voter_app;"
    sudo -u postgres psql -c "ALTER USER voter_app CREATEDB;"
    sudo -u postgres psql -c "ALTER USER voter_app WITH SUPERUSER;"  # For development
    
    # Test connection
    psql -h localhost -U voter_app -d election_enrollment -c "SELECT version();" > /dev/null
    
    print_success "Database and user setup completed"
}

# Function to install PM2
install_pm2() {
    print_status "Installing PM2 process manager..."
    
    if command_exists pm2; then
        print_status "PM2 already installed"
        return
    fi
    
    sudo npm install -g pm2
    
    # Setup PM2 startup
    pm2 startup systemd -u "$USER" --hp "/home/$USER" > /dev/null 2>&1 || true
    
    print_success "PM2 installed and configured"
}

# Function to install Nginx
install_nginx() {
    print_status "Installing Nginx..."
    
    if command_exists nginx; then
        print_status "Nginx already installed"
        return
    fi
    
    sudo apt install -y nginx
    
    # Start and enable Nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    
    # Configure firewall
    sudo ufw allow 'Nginx Full' 2>/dev/null || true
    sudo ufw allow OpenSSH 2>/dev/null || true
    sudo ufw --force enable 2>/dev/null || true
    
    print_success "Nginx installed and configured"
}

# Function to setup application
setup_application() {
    print_status "Setting up application..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the application root directory."
        exit 1
    fi
    
    # Install dependencies
    npm install
    
    # Create logs directory
    mkdir -p logs data/backups data/uploads data/pdfs
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'election-app',
    script: 'npm',
    args: 'start',
    cwd: '$(pwd)',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=4096',
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'data'],
    max_restarts: 10,
    min_uptime: '10s'
  }]
}
EOF

    print_success "Application setup completed"
}

# Function to create environment file
create_environment_file() {
    print_status "Creating environment configuration..."
    
    # Generate secure secrets
    JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | base64)
    SESSION_SECRET=$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | base64)
    
    cat > .env.local << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=election_enrollment
DB_USER=voter_app
DB_PASSWORD=HiveTech@8180

# Twilio WhatsApp Configuration (Update with your credentials)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Application Configuration
NODE_ENV=production
PORT=3000

# Security (Auto-generated)
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=24h
SESSION_SECRET=$SESSION_SECRET

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./data/uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Additional Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EOF

    print_success "Environment file created: .env.local"
    print_warning "Please update Twilio credentials in .env.local for WhatsApp functionality"
}

# Function to setup monitoring
setup_monitoring() {
    print_status "Setting up monitoring..."
    
    # Create monitoring script
    cat > monitor.sh << 'EOF'
#!/bin/bash
# System monitoring script for Election Management System

LOG_FILE="./logs/monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "=== System Status $DATE ===" >> "$LOG_FILE"

# Memory usage
echo "Memory Usage:" >> "$LOG_FILE"
free -h >> "$LOG_FILE"

# Disk usage
echo "Disk Usage:" >> "$LOG_FILE"
df -h >> "$LOG_FILE"

# PM2 status
echo "PM2 Status:" >> "$LOG_FILE"
pm2 status >> "$LOG_FILE"

# Database connections (if available)
if command -v psql >/dev/null 2>&1; then
    echo "Database Connections:" >> "$LOG_FILE"
    psql -h localhost -U voter_app -d election_enrollment -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null >> "$LOG_FILE" || echo "Database connection failed" >> "$LOG_FILE"
fi

# Application health check
echo "Application Health:" >> "$LOG_FILE"
curl -s http://localhost:3000/api/health >> "$LOG_FILE" 2>&1 || echo "Application health check failed" >> "$LOG_FILE"

echo "================================" >> "$LOG_FILE"
EOF

    chmod +x monitor.sh
    
    # Setup log rotation
    sudo tee /etc/logrotate.d/election-app << EOF
/home/$USER/election-app/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF

    print_success "Monitoring setup completed"
}

# Function to create backup script
create_backup_script() {
    print_status "Creating backup script..."
    
    cat > backup.sh << 'EOF'
#!/bin/bash
# Database backup script for Election Management System

BACKUP_DIR="./data/backups"
DATE=$(date '+%Y%m%d_%H%M%S')
BACKUP_FILE="$BACKUP_DIR/election_backup_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create database backup
pg_dump -h localhost -U voter_app -d election_enrollment -f "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Backup created: $BACKUP_FILE"
    
    # Compress backup
    gzip "$BACKUP_FILE"
    echo "Backup compressed: $BACKUP_FILE.gz"
    
    # Remove backups older than 7 days
    find "$BACKUP_DIR" -name "election_backup_*.sql.gz" -mtime +7 -delete
    echo "Old backups cleaned up"
else
    echo "Backup failed!"
    exit 1
fi
EOF

    chmod +x backup.sh
    
    print_success "Backup script created: backup.sh"
}

# Function to run final tests
run_final_tests() {
    print_status "Running final tests..."
    
    # Test database connection
    if psql -h localhost -U voter_app -d election_enrollment -c "SELECT 1;" > /dev/null 2>&1; then
        print_success "Database connection test passed"
    else
        print_error "Database connection test failed"
        return 1
    fi
    
    # Test Node.js
    if node --version > /dev/null 2>&1; then
        print_success "Node.js test passed"
    else
        print_error "Node.js test failed"
        return 1
    fi
    
    # Test PM2
    if pm2 --version > /dev/null 2>&1; then
        print_success "PM2 test passed"
    else
        print_error "PM2 test failed"
        return 1
    fi
    
    print_success "All tests passed"
}

# Main function
main() {
    echo "🚀 Enhanced Ubuntu Setup for Election Management System"
    echo "======================================================"
    echo ""
    
    # Check system requirements
    check_system_requirements
    
    # Update system packages
    update_system_packages
    
    # Install Node.js
    install_nodejs
    
    # Install PostgreSQL
    install_postgresql
    
    # Configure PostgreSQL
    configure_postgresql
    
    # Setup database
    setup_database
    
    # Install PM2
    install_pm2
    
    # Install Nginx
    install_nginx
    
    # Setup application
    setup_application
    
    # Create environment file
    create_environment_file
    
    # Setup monitoring
    setup_monitoring
    
    # Create backup script
    create_backup_script
    
    # Run final tests
    run_final_tests
    
    echo ""
    print_success "🎉 Ubuntu setup completed successfully!"
    echo ""
    print_status "Next steps:"
    print_status "  1. Update Twilio credentials in .env.local"
    print_status "  2. Run: ./scripts/quick-recovery-setup.sh --setup-only"
    print_status "  3. Run: ./scripts/quick-recovery-setup.sh --recover-only (if you have data)"
    print_status "  4. Run: pm2 start ecosystem.config.js"
    print_status "  5. Check: pm2 status"
    echo ""
    print_status "Useful commands:"
    print_status "  pm2 status              # Check application status"
    print_status "  pm2 logs election-app   # View application logs"
    print_status "  ./monitor.sh            # Run system monitoring"
    print_status "  ./backup.sh             # Create database backup"
    echo ""
    print_warning "Remember to:"
    print_warning "  - Update .env.local with your Twilio credentials"
    print_warning "  - Configure your domain in Nginx if needed"
    print_warning "  - Set up SSL certificates for production"
}

# Run main function
main "$@"
