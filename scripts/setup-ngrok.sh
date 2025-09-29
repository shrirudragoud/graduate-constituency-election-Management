#!/bin/bash

# Script to set up ngrok for public URL access
echo "🌐 Setting up ngrok for public URL access..."

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "📦 Installing ngrok..."
    
    # Download ngrok
    wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
    
    # Extract and install
    tar -xzf ngrok-v3-stable-linux-amd64.tgz
    sudo mv ngrok /usr/local/bin/
    rm ngrok-v3-stable-linux-amd64.tgz
    
    echo "✅ ngrok installed successfully!"
else
    echo "✅ ngrok is already installed"
fi

# Check if ngrok is authenticated
if ! ngrok config check &> /dev/null; then
    echo "🔑 Please authenticate ngrok:"
    echo "1. Go to https://dashboard.ngrok.com/get-started/your-authtoken"
    echo "2. Copy your authtoken"
    echo "3. Run: ngrok config add-authtoken YOUR_TOKEN"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "🚀 Starting ngrok tunnel..."
echo "This will create a public URL for your localhost:3000"
echo ""

# Start ngrok in background
ngrok http 3000 --log=stdout > ngrok.log 2>&1 &
NGROK_PID=$!

# Wait a moment for ngrok to start
sleep 3

# Get the public URL
echo "🔍 Getting public URL..."
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)

if [ -n "$PUBLIC_URL" ]; then
    echo "✅ Public URL found: $PUBLIC_URL"
    echo ""
    echo "📝 Update your .env.local file with:"
    echo "NEXT_PUBLIC_BASE_URL=$PUBLIC_URL"
    echo ""
    echo "🔄 Restart your Next.js app to use the new URL"
    echo ""
    echo "📱 Now PDF sharing via WhatsApp should work!"
    echo ""
    echo "To stop ngrok, run: kill $NGROK_PID"
else
    echo "❌ Failed to get public URL from ngrok"
    echo "Check ngrok.log for details"
    exit 1
fi
