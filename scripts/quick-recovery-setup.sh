#!/bin/bash

# Quick Recovery & Setup Script
# Comprehensive data recovery and system setup for Election Management System

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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check PostgreSQL
    if ! command_exists psql; then
        print_warning "PostgreSQL client (psql) not found. Please install PostgreSQL first."
        print_status "You can install PostgreSQL with:"
        print_status "  Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
        print_status "  CentOS/RHEL: sudo yum install postgresql postgresql-server"
        print_status "  macOS: brew install postgresql"
    fi
    
    print_success "Prerequisites check completed"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_success "Dependencies installed"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f ".env.local" ]; then
        print_status "No .env.local found. Running environment setup wizard..."
        node scripts/setup-environment-credentials.js setup
    else
        print_status "Found existing .env.local. Validating configuration..."
        node scripts/setup-environment-credentials.js validate
    fi
    
    print_success "Environment configuration completed"
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    # Test database connection first
    print_status "Testing database connection..."
    node scripts/setup-connection-sequence.js
    
    if [ $? -eq 0 ]; then
        print_success "Database connection successful"
    else
        print_warning "Database connection failed. Attempting to create database..."
        node scripts/setup-database.js
    fi
    
    print_success "Database setup completed"
}

# Function to recover data
recover_data() {
    print_status "Starting data recovery process..."
    
    # Check for available data sources
    if [ -f "data/submissions.json" ]; then
        print_status "Found JSON data. Migrating to PostgreSQL..."
        node scripts/data-recovery-restore.js --mode=restore --source=json --file=data/submissions.json
    elif [ -f "data/submissions.csv" ]; then
        print_status "Found CSV data. Migrating to PostgreSQL..."
        node scripts/data-recovery-restore.js --mode=restore --source=csv --file=data/submissions.csv
    elif [ -d "data/backups" ] && [ "$(ls -A data/backups/*.sql 2>/dev/null)" ]; then
        print_status "Found SQL backups. Restoring from backup..."
        node scripts/data-recovery-restore.js --mode=restore --source=sql
    else
        print_warning "No data sources found. Creating sample data..."
        node scripts/import-data.js
    fi
    
    print_success "Data recovery completed"
}

# Function to verify system
verify_system() {
    print_status "Verifying system integrity..."
    
    # Verify database
    node scripts/data-recovery-restore.js --mode=verify
    
    # Test API endpoints
    print_status "Testing API endpoints..."
    if command_exists curl; then
        curl -s http://localhost:3000/api/health > /dev/null && print_success "API health check passed" || print_warning "API health check failed (server may not be running)"
    fi
    
    print_success "System verification completed"
}

# Function to start application
start_application() {
    print_status "Starting application..."
    
    # Check if PM2 is available
    if command_exists pm2; then
        print_status "Starting with PM2..."
        npm run pm2:start
    else
        print_status "Starting with npm..."
        print_warning "For production, consider installing PM2: npm install -g pm2"
        npm run dev &
    fi
    
    print_success "Application started"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --setup-only     Only setup environment and database"
    echo "  --recover-only   Only recover data from available sources"
    echo "  --verify-only    Only verify system integrity"
    echo "  --start-only     Only start the application"
    echo "  --full           Complete setup and recovery (default)"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Complete setup and recovery"
    echo "  $0 --setup-only       # Setup environment and database only"
    echo "  $0 --recover-only     # Recover data only"
    echo "  $0 --verify-only      # Verify system only"
}

# Main function
main() {
    echo "🚀 Election Management System - Quick Recovery & Setup"
    echo "====================================================="
    echo ""
    
    # Parse command line arguments
    SETUP_ONLY=false
    RECOVER_ONLY=false
    VERIFY_ONLY=false
    START_ONLY=false
    FULL_SETUP=true
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --setup-only)
                SETUP_ONLY=true
                FULL_SETUP=false
                shift
                ;;
            --recover-only)
                RECOVER_ONLY=true
                FULL_SETUP=false
                shift
                ;;
            --verify-only)
                VERIFY_ONLY=true
                FULL_SETUP=false
                shift
                ;;
            --start-only)
                START_ONLY=true
                FULL_SETUP=false
                shift
                ;;
            --full)
                FULL_SETUP=true
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Execute based on options
    if [ "$FULL_SETUP" = true ]; then
        print_status "Running complete setup and recovery process..."
        check_prerequisites
        install_dependencies
        setup_environment
        setup_database
        recover_data
        verify_system
        start_application
        
        echo ""
        print_success "🎉 Complete setup and recovery process finished!"
        echo ""
        print_status "Next steps:"
        print_status "  1. Access the application at http://localhost:3000"
        print_status "  2. Login with admin@election.com / admin123"
        print_status "  3. Test form submissions"
        print_status "  4. Monitor system performance"
        
    elif [ "$SETUP_ONLY" = true ]; then
        print_status "Running setup only..."
        check_prerequisites
        install_dependencies
        setup_environment
        setup_database
        
    elif [ "$RECOVER_ONLY" = true ]; then
        print_status "Running data recovery only..."
        recover_data
        
    elif [ "$VERIFY_ONLY" = true ]; then
        print_status "Running verification only..."
        verify_system
        
    elif [ "$START_ONLY" = true ]; then
        print_status "Starting application only..."
        start_application
    fi
    
    echo ""
    print_success "Operation completed successfully!"
}

# Run main function with all arguments
main "$@"
