# 🎫 IT Ticket System

[![Next.js](https://img.shields.io/badge/Next.js-14.2.33-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, enterprise-grade IT support ticket management system built with Next.js, TypeScript, and Tailwind CSS. Features real-time notifications, email alerts, multi-department support, and comprehensive ticket tracking.

![IT Ticket System Screenshot](https://via.placeholder.com/800x400/0f172a/ffffff?text=IT+Ticket+System+Dashboard)

## 🌟 Key Features

### 🔔 **Real-Time Notification System**
- **Smart notification bell** with count badges for administrators
- **Login page indicators** showing new tickets before login
- **Email notifications** to william.turner@eolabs.com for new tickets and assignments
- **30-second polling** for real-time updates
- **Professional email templates** with detailed ticket information

### 👥 **Multi-Department Support (14 Departments)**
- **Preproom Westfield & Burnhouse** - Laboratory preparation
- **DCM** - Department of Clinical Medicine  
- **QA-QC** - Quality Assurance & Quality Control
- **HIW Burnhouse & Westfield** - Healthcare facilities
- **Office Burnhouse & Westfield** - Administrative offices
- **BM Burnhouse & Westfield** - Building Management
- **Cleanroom Burnhouse & Westfield** - Clean facility operations
- **R&D** - Research & Development
- **Technical** - Technical support
- **IT Administration** - System administrators

### 🎫 **Comprehensive Ticket Management**
- **Complete lifecycle tracking** (Open → In-Progress → Resolved → Closed)
- **Priority levels** (Low, Medium, High, Urgent) with color coding
- **Technician assignment** to William, Andy, or Anthony
- **Department-specific categories** for specialized workflows
- **Due date tracking** with overdue indicators
- **Admin comments** for internal tracking and notes
- **Advanced filtering** by status, priority, department, assignee
- **Search functionality** across ticket titles, descriptions, and IDs

### 🏢 **Role-Based Access Control**
- **IT Administrators**: Full system access, technician assignment, all departments
- **Department Users**: Department-specific ticket access and creation
- **Secure authentication** with department-specific passwords
- **Session persistence** with automatic login restoration

### 💾 **Data Persistence & Management**
- **localStorage integration** - no data loss on page refresh
- **Automatic backup** of all tickets, comments, and assignments
- **Export functionality** for data backup and migration
- **Real-time data synchronization** across browser sessions

### 📧 **Professional Email System**
- **Automated notifications** for new ticket creation
- **Assignment alerts** when technicians are assigned
- **Professional email templates** with complete ticket details
- **SMTP integration** with Gmail, Outlook, and custom servers
- **Email tracking dashboard** for administrators
- **Nodemailer integration** for reliable email delivery
- See **[EMAIL-SETUP.md](EMAIL-SETUP.md)** for configuration instructions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/IT-Ticket-System.git
   cd IT-Ticket-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure email notifications (Optional)**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your SMTP credentials
   # See EMAIL-SETUP.md for detailed instructions
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### 🔐 Demo Accounts

| Department | Password |
|------------|----------|
| **IT Administration** | `ADMIN2024` |
| Preproom Westfield | `PRW1234` |
| Preproom Burnhouse | `PRB1234` |
| DCM | `DCM1234` |
| QA-QC | `QAQC1234` |
| HIW-Burnhouse | `HIWB1234` |
| HIW-Westfield | `HIWW1234` |
| Office-Burnhouse | `OFFB1234` |
| Office-Westfield | `OFFW1234` |
| BM-Burnhouse | `BMB1234` |
| BM-Westfield | `BMW1234` |
| Cleanroom-Burnhouse | `CRB1234` |
| Cleanroom-Westfield | `CRW1234` |
| R&D | `RD1234` |
| Technical | `TECH1234` |

## 📖 Usage Guide

### For Department Users
1. **Login** with your department credentials
2. **Create tickets** using the "Request Support" button
3. **Track progress** through the dashboard
4. **Update status** when work is completed
5. **Filter tickets** to find specific requests

### For IT Administrators
1. **Login** with IT Administration credentials
2. **View all tickets** across all departments
3. **Assign technicians** (William, Andy, Anthony) to tickets
4. **Monitor notifications** via the red bell icon
5. **Export data** for backup and reporting
6. **Track email notifications** in the admin panel

## 🛠️ Technical Stack

- **Frontend**: Next.js 14.2.33, React 18, TypeScript
- **Styling**: Tailwind CSS 3.0
- **State Management**: React Hooks, localStorage
- **Notifications**: Real-time polling, Email simulation
- **Data Persistence**: Browser localStorage with JSON serialization
- **Authentication**: Custom role-based system
- **Development**: ESLint, TypeScript strict mode

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── dashboard/         # Main dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── CreateTicketModal.tsx
│   ├── LoginForm.tsx
│   └── TicketCard.tsx
├── lib/                   # Core business logic
│   ├── auth.ts           # Authentication service
│   ├── email.ts          # Email notification service
│   └── tickets.ts        # Ticket management service
└── types/
    └── index.ts          # TypeScript type definitions
```

## 🔧 Configuration

### Email Notifications
Currently using console simulation. To enable real email sending:

1. **Update `src/lib/email.ts`**
2. **Replace console logging** with your preferred email service:
   - SendGrid
   - AWS SES
   - NodeMailer
   - Resend

### Departments
Add/modify departments in `src/lib/auth.ts`:
```typescript
const mockUsers: AuthUser[] = [
  // Add your departments here
]
```

## 📱 Screenshots

### Login Page
![Login Page](https://via.placeholder.com/600x400/1f2937/ffffff?text=Department+Selection+Screen)

### Dashboard
![Dashboard](https://via.placeholder.com/600x400/0f172a/ffffff?text=Admin+Dashboard+with+Tickets)

### Notifications
![Notifications](https://via.placeholder.com/600x400/dc2626/ffffff?text=Real-time+Notification+Bell)

## 🚀 Deployment

### Vercel (Recommended)

**Quick Deploy:**
1. Push to GitHub
2. Import project in Vercel Dashboard
3. Add environment variables (see [VERCEL-ENV-VARIABLES.md](VERCEL-ENV-VARIABLES.md))
4. Deploy!

**Complete Guide:** See [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md) for detailed instructions including email configuration.

**Via CLI:**
```bash
npm install -g vercel
vercel
```

**⚠️ Important:** After deployment, add email environment variables in Vercel Settings → Environment Variables. See [VERCEL-ENV-VARIABLES.md](VERCEL-ENV-VARIABLES.md) for the exact variables to add.

### Docker
```bash
docker build -t it-ticket-system .
docker run -p 3000:3000 it-ticket-system
```

### Traditional Hosting
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- 📧 Email notifications sent to: william.turner@eolabs.com
- 🐛 Report issues on GitHub
- 📚 Check documentation in `/docs` folder

## 🎯 Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real-time WebSocket notifications
- [ ] Mobile responsive improvements
- [ ] Attachment support for tickets
- [ ] Advanced reporting and analytics
- [ ] Integration with external IT systems
- [ ] Multi-language support

## 🏆 Features Highlights

- ✅ **Zero data loss** with localStorage persistence
- ✅ **Real-time notifications** with smart counting
- ✅ **Professional email system** ready for production
- ✅ **Multi-department support** with role-based access
- ✅ **Technician assignment** with automatic notifications
- ✅ **Export/import capabilities** for data management
- ✅ **Responsive design** works on all devices
- ✅ **TypeScript support** for type safety
- ✅ **Modern UI/UX** with Tailwind CSS

---

**Built with ❤️ for efficient IT support management**

*Ready for production deployment with minimal configuration required.*