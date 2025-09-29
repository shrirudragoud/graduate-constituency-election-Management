#!/bin/bash

# Comprehensive setup script for PDF generation and WhatsApp sharing
echo "🚀 Setting up PDF generation and WhatsApp sharing..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing system dependencies for Puppeteer..."
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils

echo "✅ System dependencies installed!"

# Install Google Chrome
echo "🌐 Installing Google Chrome..."
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

echo "✅ Google Chrome installed!"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p data/pdfs
mkdir -p data/uploads
mkdir -p scripts

echo "✅ Directories created!"

# Set environment variables
echo "🔧 Setting up environment variables..."
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
# PDF Generation and WhatsApp Sharing Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Twilio WhatsApp Configuration (optional)
# TWILIO_ACCOUNT_SID=your_account_sid
# TWILIO_AUTH_TOKEN=your_auth_token
# TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# For production, set NEXT_PUBLIC_BASE_URL to your actual domain
# NEXT_PUBLIC_BASE_URL=https://yourdomain.com
EOF
    echo "✅ .env.local created!"
else
    echo "⚠️  .env.local already exists, skipping creation"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. If you want to use ngrok for public access:"
echo "   - Install ngrok: https://ngrok.com/download"
echo "   - Run: ngrok http 3000"
echo "   - Copy the https URL and update NEXT_PUBLIC_BASE_URL in .env.local"
echo ""
echo "2. If you want to use Twilio WhatsApp:"
echo "   - Get credentials from https://console.twilio.com/"
echo "   - Update the Twilio variables in .env.local"
echo ""
echo "3. Test the setup:"
echo "   - Run: node scripts/check-domain.js"
echo "   - Start your app: npm run dev"
echo "   - Submit a form to test PDF generation"
echo ""
echo "🔧 Troubleshooting:"
echo "   - If PDF generation fails, check: node scripts/check-domain.js"
echo "   - If WhatsApp fails, check Twilio credentials"
echo "   - For localhost issues, use ngrok or deploy to a public domain"

