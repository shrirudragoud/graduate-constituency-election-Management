module.exports = {
  apps: [{
    name: 'voter-app',
    script: 'npm',
    args: 'start',
    cwd: './',
    instances: 1, // Start with 1 instance, can scale up
    autorestart: true,
    watch: false, // Don't watch files in production
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Advanced PM2 features
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    
    // Health monitoring
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true
  }]
}
