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
