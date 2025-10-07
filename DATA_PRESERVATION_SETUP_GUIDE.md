# 🛡️ Data Preservation Setup Guide

## Enhanced Ubuntu Setup with Data Preservation

This guide explains how to use the enhanced Ubuntu setup script that **preserves existing data** instead of creating a fresh database every time.

## 🚀 Quick Start

```bash
# Make the script executable
chmod +x scripts/ubuntu-setup-enhanced-with-data-preservation.sh

# Run the enhanced setup
./scripts/ubuntu-setup-enhanced-with-data-preservation.sh
```

## 🔍 What the Enhanced Script Does

### 1. **Database Detection**
- Automatically scans for existing PostgreSQL databases
- Identifies databases that contain election data (users, submissions tables)
- Shows you detailed information about each database

### 2. **Interactive Choices**
When existing data is found, you'll be asked:
```
Found existing election databases with data!

What would you like to do?
1) Connect to existing database (preserve all data)
2) Create new database (will lose existing data)
3) Show me the databases first
4) Exit setup
```

### 3. **Data Preservation**
- **Option 1**: Connects to your existing database and preserves ALL data
- **Option 2**: Creates a fresh database (loses existing data)
- **Option 3**: Shows detailed information about each database before deciding

## 📊 Database Information Display

The script shows you:
- **Database name**
- **Table count** (how many election-related tables exist)
- **Row counts** for each table
- **Database size**
- **Recent activity** (submissions in last 7 days)

Example output:
```
Database: election_enrollment_old
  Tables:
    - submissions (1,250 rows)
    - users (15 rows)
    - file_attachments (89 rows)
  Size: 45 MB
```

## 🔧 How It Works

### Step 1: Detection
```bash
# The script automatically runs this detection
sudo -u postgres psql -t -c "SELECT datname FROM pg_database WHERE datistemplate = false;"
```

### Step 2: Analysis
```bash
# Checks each database for election tables
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'submissions');
```

### Step 3: User Choice
- If election data found → Ask user what to do
- If no election data found → Create new database automatically

## 🛡️ Data Safety Features

### 1. **No Data Loss by Default**
- Script **never** deletes existing data without explicit user confirmation
- Always asks before creating new database when data exists

### 2. **Database Validation**
- Tests connection to existing database before proceeding
- Verifies user permissions and table structure
- Shows data summary so you know what you're working with

### 3. **Environment Configuration**
- Automatically updates `.env.local` with correct database name
- Preserves existing database credentials
- Maintains all existing configurations

## 📋 Usage Scenarios

### Scenario 1: First Time Setup
```bash
./scripts/ubuntu-setup-enhanced-with-data-preservation.sh
# → No existing databases found
# → Creates new database automatically
# → Sets up everything from scratch
```

### Scenario 2: Re-running Setup (Data Exists)
```bash
./scripts/ubuntu-setup-enhanced-with-data-preservation.sh
# → Found existing database: election_enrollment
# → Shows data summary
# → Asks: Connect to existing or create new?
# → You choose: Connect to existing
# → Preserves all data, continues setup
```

### Scenario 3: Multiple Databases
```bash
./scripts/ubuntu-setup-enhanced-with-data-preservation.sh
# → Found multiple databases:
#     1) election_enrollment_old (1,250 submissions)
#     2) election_enrollment_backup (500 submissions)
# → Asks which one to use
# → You choose database 1
# → Connects to chosen database
```

## 🔄 Migration Scenarios

### From Old Setup to New Setup
1. **Old database exists** with data
2. **Run enhanced script**
3. **Choose "Connect to existing"**
4. **All data preserved** ✅
5. **New features added** ✅

### Fresh Start (No Data Loss)
1. **Backup existing data first**:
   ```bash
   pg_dump -h localhost -U postgres election_enrollment > backup.sql
   ```
2. **Run enhanced script**
3. **Choose "Create new database"**
4. **Restore data later** if needed

## 🚨 Important Notes

### ⚠️ Before Running
- **Always backup** your data before major changes
- **Test on a copy** of your database first
- **Verify credentials** are correct

### ✅ After Running
- **Check data integrity** in the web application
- **Verify all tables** are accessible
- **Test form submissions** work correctly
- **Check user authentication** still works

## 🔧 Troubleshooting

### Database Not Found
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check available databases
sudo -u postgres psql -l
```

### Connection Failed
```bash
# Check user permissions
sudo -u postgres psql -c "\du"

# Test connection manually
psql -h localhost -U voter_app -d your_database_name
```

### Data Missing
```bash
# Check table contents
sudo -u postgres psql -d your_database_name -c "SELECT COUNT(*) FROM submissions;"

# Check table structure
sudo -u postgres psql -d your_database_name -c "\dt"
```

## 📞 Support

If you encounter issues:
1. **Check the logs** in `./logs/` directory
2. **Verify database connection** manually
3. **Check file permissions** on the script
4. **Review the error messages** carefully

## 🎯 Benefits

✅ **No Data Loss** - Preserves existing data by default  
✅ **User Control** - You decide what to do with existing data  
✅ **Smart Detection** - Automatically finds election databases  
✅ **Detailed Info** - Shows you exactly what data exists  
✅ **Safe Defaults** - Never deletes data without asking  
✅ **Easy Recovery** - Can connect to any existing database  

---

**Remember**: This enhanced script is designed to be **safe by default**. It will never delete your data without explicit confirmation!
