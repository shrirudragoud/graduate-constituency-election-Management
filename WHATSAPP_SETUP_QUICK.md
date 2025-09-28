# 🚀 Quick WhatsApp Setup Guide

## Current Status
Your app is working but WhatsApp messages are in "mock mode" because Twilio is not configured.

## To Get Real WhatsApp Messages Working:

### Step 1: Get Twilio Account (5 minutes)
1. Go to https://console.twilio.com/
2. Click "Sign up" (it's free)
3. Verify your phone number
4. You'll get $15 free credit

### Step 2: Get Your Credentials (2 minutes)
1. In Twilio Console, go to "Account Info"
2. Copy your:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click to reveal)

### Step 3: Set Up WhatsApp Sandbox (3 minutes)
1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Click "Set up WhatsApp sandbox"
3. You'll see a sandbox number like `+1 415 523 8886`
4. Send "join <sandbox-code>" to this number from your WhatsApp
5. You'll get a confirmation message

### Step 4: Create Environment File (1 minute)
Create a file called `.env.local` in your project root:

```env
TWILIO_ACCOUNT_SID=AC_your_actual_account_sid_here
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Step 5: Restart Your App
```bash
npm run dev
```

### Step 6: Test
1. Submit a registration form
2. Check your WhatsApp - you should receive a message!

## Troubleshooting

**If you still don't receive messages:**
1. Check the console logs - it will tell you what's wrong
2. Make sure you sent the "join" message to the sandbox number
3. Verify your phone number format (should be 10 digits for India)
4. Check that .env.local file is in the project root

**Common Issues:**
- Phone number format: Use 10 digits (e.g., 9876543210)
- Sandbox not joined: Send "join <code>" to the sandbox number
- Wrong credentials: Double-check Account SID and Auth Token

## Cost
- Sandbox testing: **FREE**
- Production: ~$0.005 per message
- $15 free credit = ~3000 messages
