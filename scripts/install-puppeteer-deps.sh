#!/bin/bash

# Script to install Puppeteer dependencies for PDF generation
echo "🔧 Installing Puppeteer dependencies..."

# Update package list
sudo apt-get update

# Install required system dependencies for Puppeteer
echo "📦 Installing system dependencies..."
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

echo "✅ System dependencies installed successfully!"

# Install Puppeteer with system Chrome
echo "📦 Installing Puppeteer..."
npm install puppeteer

# Set Puppeteer to use system Chrome
echo "🔧 Configuring Puppeteer to use system Chrome..."
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

echo "✅ Puppeteer setup completed!"
echo "🚀 You can now generate PDFs with the system Chrome browser."

