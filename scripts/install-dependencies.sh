#!/bin/bash

# Install Dependencies Script
# This script installs the new security dependencies

echo "🔧 Installing security dependencies..."

# Install new packages
npm install bcryptjs jsonwebtoken

# Install type definitions
npm install --save-dev @types/bcryptjs @types/jsonwebtoken

echo "✅ Dependencies installed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy env-template.txt to .env.local"
echo "2. Update the JWT_SECRET in .env.local"
echo "3. Run: npm run db:setup"
echo "4. Run: npm run dev"
echo ""
echo "🔐 Security features added:"
echo "  ✅ CORS middleware"
echo "  ✅ JWT authentication"
echo "  ✅ File upload security"
echo "  ✅ Rate limiting"
echo "  ✅ Security headers"
echo "  ✅ Input validation"
