#!/bin/bash

echo "🔧 Fixing Puppeteer/Chrome dependencies for PDF generation..."

# Install missing Chrome dependencies
echo "📦 Installing Chrome dependencies..."
sudo apt-get update
sudo apt-get install -y \
    libnspr4 \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libasound2 \
    libgtk-3-0 \
    libgconf-2-4 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libasound2

echo "✅ Chrome dependencies installed!"

# Install Chrome if not present
if ! command -v google-chrome &> /dev/null; then
    echo "📦 Installing Google Chrome..."
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
    sudo apt-get update
    sudo apt-get install -y google-chrome-stable
    echo "✅ Google Chrome installed!"
else
    echo "✅ Google Chrome already installed!"
fi

echo "🎉 Puppeteer/Chrome setup complete!"
echo "📝 You can now restart your application with: npm run dev"
