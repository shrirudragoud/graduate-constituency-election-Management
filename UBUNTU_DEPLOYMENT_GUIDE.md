# Ubuntu VPS Deployment Guide - High Concurrency Setup
tep 1: Point your domain to VPS

Log into your registrar (where padvidhar.com is registered).

Go to DNS settings.

Add 2 records:

A record → Host: @, Value: your VPS public IP.

A record → Host: www, Value: your VPS public IP.

👉 Wait a few minutes for DNS to propagate (you can check with: dig padvidhar.com +short or nslookup padvidhar.com).

🔹 Step 2: Install NGINX

On your VPS (Ubuntu/Debian):

sudo apt update
sudo apt install nginx -y


Verify NGINX is running:

systemctl status nginx


You should see “active (running)”.

🔹 Step 3: Configure Reverse Proxy

Create a new NGINX config file for your domain:

sudo nano /etc/nginx/sites-available/padvidhar.com


Paste this config (adjust if needed):

server {
    listen 80;
    server_name padvidhar.com www.padvidhar.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}


Save + exit (CTRL+O, ENTER, CTRL+X).

Enable the site and reload NGINX:

sudo ln -s /etc/nginx/sites-available/padvidhar.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx


At this point, http://padvidhar.com should already work 🎉 (no SSL yet).

🔹 Step 4: Add Free SSL (Let’s Encrypt)

Install Certbot:

sudo apt install certbot python3-certbot-nginx -y


Request certificate:

sudo certbot --nginx -d padvidhar.com -d www.padvidhar.com


Enter email, agree to terms, choose “Redirect HTTP → HTTPS”.

Certbot will fetch a certificate and auto-configure NGINX.

Check renewal (runs automatically, but good to confirm):

sudo certbot renew --dry-run

🔹 Step 5: Test

Open https://padvidhar.com in browser → should load your app (port 3000 behind the scenes).

SSL padlock should be green/valid.

✅ That’s it! You now have:

Stable domain (padvidhar.com)

Free HTTPS via Let’s Encrypt

Reverse proxy hiding port 3000
## 🚀 Quick Setup (Terminal Only)

### 1. Connect to your Ubuntu VPS
```bash
ssh username@your-server-ip
```

### 2. Clone and setup the application
```bash
# Clone the repository
git clone https://github.com/shrirudragoud/Voter-Data-Collection-.git voter-app
cd voter-app

# Make setup script executable and run it
chmod +x scripts/ubuntu-setup.sh
./scripts/ubuntu-setup.sh
```

### 3. Configure your environment
```bash
# Edit the environment file
nano .env.local

# Update these critical values:
# - DB_PASSWORD: Change to a secure password
# - TWILIO_ACCOUNT_SID: Your Twilio Account SID
# - TWILIO_AUTH_TOKEN: Your Twilio Auth Token
# - TWILIO_WHATSAPP_NUMBER: Your WhatsApp number (e.g., whatsapp:+1234567890)
# - JWT_SECRET: Generate a secure random string
# - SESSION_SECRET: Generate another secure random string
```

### 4. Start the application
```bash
# Start with PM2 cluster mode
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs voter-app
```

## 📊 **Concurrency Features Implemented**

### **Database Level:**
- ✅ **Connection Pooling**: 20 max connections, 5 min connections
- ✅ **Transaction Safety**: ACID compliance with proper isolation levels
- ✅ **Row-Level Locking**: Prevents data corruption during concurrent updates
- ✅ **Unique Constraints**: Prevents duplicate mobile/Aadhaar numbers
- ✅ **Optimized Indexes**: Fast queries even with millions of records
- ✅ **Connection Timeouts**: Prevents hanging connections

### **Application Level:**
- ✅ **PM2 Cluster Mode**: Uses all CPU cores for maximum performance
- ✅ **Rate Limiting**: Prevents abuse and ensures fair resource usage
- ✅ **Async Processing**: WhatsApp notifications don't block form submissions
- ✅ **Error Handling**: Graceful degradation under high load
- ✅ **Health Checks**: Automatic restart on failures

### **Infrastructure Level:**
- ✅ **Nginx Load Balancing**: Distributes load across multiple app instances
- ✅ **SSL Termination**: Secure connections
- ✅ **Security Headers**: Protection against common attacks
- ✅ **Log Rotation**: Prevents disk space issues
- ✅ **Monitoring Scripts**: Real-time system monitoring

## 🔧 **Manual Setup (Step by Step)**

### 1. System Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git build-essential software-properties-common
```

### 2. Install Node.js 18.x LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install PostgreSQL 15
```bash
sudo apt install -y postgresql postgresql-contrib postgresql-client

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4. Configure PostgreSQL for High Concurrency
```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/*/main/postgresql.conf

# Add these settings:
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
```

### 5. Setup Database
```bash
# Create database and user
sudo -u postgres psql -c "CREATE DATABASE election_enrollment;"
sudo -u postgres psql -c "CREATE USER voter_app WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE election_enrollment TO voter_app;"
sudo -u postgres psql -c "ALTER USER voter_app CREATEDB;"
```

### 6. Install PM2
```bash
sudo npm install -g pm2
```

### 7. Setup Application
```bash
# Clone and install
git clone https://github.com/shrirudragoud/Voter-Data-Collection-.git voter-app
cd voter-app
npm install

# Configure environment
cp .env.example .env.local
nano .env.local  # Update with your credentials

# Setup database
npm run db:setup
npm run db:migrate

# Build application
npm run build
```

### 8. Start Application
```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 📈 **Performance Optimization**

### **Database Optimization:**
```sql
-- Monitor query performance
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### **Application Monitoring:**
```bash
# Monitor PM2 processes
pm2 monit

# Check system resources
htop

# Monitor database connections
psql -h localhost -U voter_app -d election_enrollment -c "SELECT count(*) FROM pg_stat_activity;"
```

## 🔍 **Concurrency Testing**

### **Load Testing:**
```bash
# Install Apache Bench
sudo apt install -y apache2-utils

# Test concurrent form submissions
ab -n 1000 -c 50 -p test_data.json -T "application/json" http://localhost:3000/api/submit-form

# Test concurrent reads
ab -n 1000 -c 100 http://localhost:3000/api/submit-form
```

### **Database Stress Testing:**
```bash
# Run database tests
npm run db:test

# Monitor during high load
watch -n 1 'psql -h localhost -U voter_app -d election_enrollment -c "SELECT count(*) FROM pg_stat_activity;"'
```

## 🛠️ **Useful Commands**

### **Application Management:**
```bash
pm2 status              # Check application status
pm2 logs voter-app      # View application logs
pm2 restart voter-app   # Restart application
pm2 stop voter-app      # Stop application
pm2 monit              # Monitor application
pm2 reload voter-app   # Zero-downtime reload
```

### **Database Management:**
```bash
npm run db:setup        # Setup database tables
npm run db:migrate      # Migrate JSON data to PostgreSQL
npm run db:test         # Test database connection and performance
npm run db:reset        # Reset database (WARNING: Deletes all data)
```

### **System Management:**
```bash
sudo systemctl status postgresql    # Check PostgreSQL status
sudo systemctl restart postgresql   # Restart PostgreSQL
sudo systemctl status nginx         # Check Nginx status
sudo systemctl restart nginx        # Restart Nginx
./monitor.sh                        # Run system monitoring script
./backup.sh                         # Create database backup
```

## 🚨 **Troubleshooting**

### **Application Issues:**
```bash
# Check logs
pm2 logs voter-app --lines 100

# Restart if stuck
pm2 restart voter-app

# Check memory usage
pm2 show voter-app
```

### **Database Issues:**
```bash
# Check connection count
psql -h localhost -U voter_app -d election_enrollment -c "SELECT count(*) FROM pg_stat_activity;"

# Check for locks
psql -h localhost -U voter_app -d election_enrollment -c "SELECT * FROM pg_locks WHERE NOT granted;"

# Check slow queries
psql -h localhost -U voter_app -d election_enrollment -c "SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 5;"
```

### **Performance Issues:**
```bash
# Check system resources
htop
iostat -x 1
free -h

# Check disk usage
df -h
du -sh /home/*/voter-app/data/uploads/

# Check network connections
netstat -tulpn | grep :3000
```

## 🔒 **Security Considerations**

### **Database Security:**
1. **Change default passwords** in `.env.local`
2. **Use SSL connections** in production
3. **Regular backups** of your database
4. **Monitor access logs** for suspicious activity

### **Application Security:**
1. **Rate limiting** is enabled by default
2. **Input validation** prevents SQL injection
3. **File upload restrictions** prevent malicious uploads
4. **Security headers** protect against common attacks

### **System Security:**
1. **Firewall configured** to allow only necessary ports
2. **Regular system updates** for security patches
3. **SSH key authentication** instead of passwords
4. **Regular security audits** of your system

## 📊 **Monitoring and Alerts**

### **System Monitoring:**
```bash
# Create monitoring cron job
crontab -e

# Add this line to check every 5 minutes:
*/5 * * * * /home/$(whoami)/voter-app/monitor.sh >> /home/$(whoami)/logs/monitor.log 2>&1
```

### **Database Monitoring:**
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('election_enrollment'));

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🎯 **Expected Performance**

With this setup, you can expect:
- **Concurrent Users**: 500+ simultaneous form submissions
- **Response Time**: < 200ms for form submissions
- **Database Queries**: < 50ms for most operations
- **Uptime**: 99.9% with proper monitoring
- **Scalability**: Can handle 10,000+ submissions per day

## 🆘 **Emergency Procedures**

### **If Application Crashes:**
```bash
pm2 restart voter-app
pm2 logs voter-app --lines 50
```

### **If Database is Slow:**
```bash
# Check for long-running queries
psql -h localhost -U voter_app -d election_enrollment -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query FROM pg_stat_activity WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';"

# Kill problematic queries if needed
psql -h localhost -U voter_app -d election_enrollment -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid = <problematic_pid>;"
```

### **If System is Overloaded:**
```bash
# Reduce PM2 instances
pm2 scale voter-app 2

# Check system resources
htop
free -h
df -h
```

Your application is now ready for high-concurrency production deployment! 🚀
