# 🗳️ Voter Data Collection System

A comprehensive Next.js application for BJP voter registration and student enrollment management with WhatsApp integration.

## 🌟 Features

- **📝 Student Registration Form** - Complete enrollment system with form validation
- **📱 WhatsApp Integration** - Automated messaging and file sharing via WhatsApp
- **🗄️ JSON Data Storage** - Simple file-based data storage (PostgreSQL can be added later)
- **👥 Role-Based Access Control** - Admin, Manager, Team, and Student roles
- **📊 Dashboard & Analytics** - Real-time statistics and reporting
- **📄 PDF Generation** - Automatic certificate and document generation
- **🔐 Authentication System** - Secure login and registration
- **📱 Responsive Design** - Mobile-friendly interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shrirudragoud/Voter-Data-Collection-.git
   cd Voter-Data-Collection-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration (Optional)

The application works out of the box without any configuration. However, you can add these features later:

### Environment Variables (Optional)

Create `.env.local` file for additional features:

```env
# Application Configuration
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database Configuration (when you add PostgreSQL later)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=election_enrollment
DB_USER=your-username
DB_PASSWORD=your-password

# Email Configuration (when you add email later)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Twilio WhatsApp Configuration (when you add WhatsApp later)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── ...
├── components/            # React components
│   ├── forms/            # Form components
│   ├── ui/               # UI components
│   └── ...
├── lib/                  # Utility libraries
│   ├── simple-pdf-generator.ts
│   └── utils.ts
├── data/                 # Data storage
│   ├── submissions.json  # Student registration data
│   └── uploads/         # File uploads
└── public/              # Static assets
```

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run linter

# Deployment
npm run deploy:github    # Deploy to GitHub
```

## 🔧 Current Features

### ✅ **Working Features:**
- Student registration form with validation
- Data storage in JSON files
- User authentication system
- Admin dashboard
- File upload system
- PDF generation
- Responsive design

### 🔄 **Features to Add Later:**
- PostgreSQL database integration
- Email notifications
- WhatsApp messaging
- Advanced analytics
- User management system

## 📱 How to Use

1. **Student Registration:**
   - Go to the main page
   - Fill out the registration form
   - Upload required documents
   - Submit the form

2. **Admin Dashboard:**
   - Login with admin credentials
   - View all registrations
   - Manage submissions
   - Generate reports

3. **Team Management:**
   - Access team dashboard
   - View assigned registrations
   - Update submission status

## 🔒 Security Features

- **Form validation** and sanitization
- **File upload restrictions**
- **Input validation** on all forms
- **XSS protection**
- **CSRF protection**

## 📊 Data Storage

Currently uses JSON file storage:
- **Location:** `data/submissions.json`
- **Format:** JSON array of submission objects
- **Backup:** Automatic backup on each submission

## 🚀 Deployment

### GitHub Deployment

```bash
# Deploy to GitHub
npm run deploy:github
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill process using port 3000
   npx kill-port 3000
   ```

2. **Dependencies not installed:**
   ```bash
   npm install
   ```

3. **Build errors:**
   ```bash
   npm run build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- **Repository**: [https://github.com/shrirudragoud/Voter-Data-Collection-.git](https://github.com/shrirudragoud/Voter-Data-Collection-.git)
- **Issues**: [GitHub Issues](https://github.com/shrirudragoud/Voter-Data-Collection-/issues)

## 🎯 Roadmap

- [ ] PostgreSQL database integration
- [ ] Email notification system
- [ ] WhatsApp messaging integration
- [ ] Advanced user management
- [ ] Real-time notifications
- [ ] Mobile app integration
- [ ] Multi-language support
- [ ] Advanced reporting features

---

**Built with ❤️ for BJP Voter Registration System**
