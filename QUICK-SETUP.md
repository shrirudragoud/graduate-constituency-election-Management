# 🚀 Quick Setup Guide

## Super Simple Setup - Just Works!

### Database Info (Same Every Time)
- **Database**: `election_enrollment`
- **User**: `postgres`
- **Password**: `password`
- **Admin**: `admin@election.com` / `admin123`

### 3 Commands to Get Everything Working

```bash
# 1. Setup database (creates tables)
npm run setup

# 2. Import sample data (so you can see it in webapp)
npm run import

# 3. Start the app
npm run dev
```

### Or Do Everything at Once
```bash
npm run quick-start
```

### What You Get
- ✅ Database tables created
- ✅ Sample data imported
- ✅ Webapp running at http://localhost:3000
- ✅ Admin panel with data
- ✅ Form submission working
- ✅ PDF generation working

### For VPS/Production
Same commands work on VPS - just make sure PostgreSQL is running first.

### If Something Breaks
```bash
# Reset everything
npm run setup
npm run import
```

That's it! No complex configuration needed. 🎉
