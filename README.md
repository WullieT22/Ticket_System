# IT Ticket System

A modern, web-based IT support ticket management system built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Authentication & User Management
- Role-based authentication (Administrator/Department)
- Demo accounts for testing
- Secure login/logout functionality
- User profile display with avatars

### For Departments
- **Submit support requests** for their department
- **View assigned tickets** and department-specific requests
- **Update ticket status** (Open → In Progress → Resolved → Closed)
- **Department-specific categories** (e.g., Medical Equipment for Preproom Westfield)
- **Filter tickets** by status, priority, and search terms
- **Real-time ticket statistics** dashboard
- **Due date tracking** with overdue indicators

### For Administrators
- All department capabilities
- Create new tickets with full details
- Assign tickets to departments
- Advanced ticket management
- System monitoring and analytics

### Ticket Management
- **Priority Levels**: Low, Medium, High, Urgent
- **Status Tracking**: Open, In Progress, Resolved, Closed
- **Categories**: Hardware, Software, Network, Email, Security, Printing, etc.
- **Due Date Management**: Visual overdue indicators
- **Advanced Search & Filtering**: By title, description, ID, status, priority
- **Real-time Updates**: Instant status changes and statistics

## 🎨 Department Access

| Department | Password | Access Level | Responsibilities |
|------------|----------|--------------|------------------|
| IT Administration | ADMIN2024 | Administrator | Full system access, create tickets, assign work |
| Preproom Westfield | PRW1234 | Department | Medical equipment support, assigned tickets |
| Technical Support | TECH2024 | Department | General IT support, software issues |
| Help Desk | HELP2024 | Department | User support, initial triage |
| Facilities Maintenance | MAINT2024 | Department | Building systems, HVAC, physical infrastructure |

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Authentication**: Custom service (mock implementation)
- **Data Management**: In-memory service (easily replaceable with real backend)

## 📦 Getting Started

### Prerequisites

- Node.js 18 or later
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository** (or use existing files)

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start Guide

1. **Access the application** - Navigate to http://localhost:3000
2. **Select your department** - Click on your department card
3. **Enter department password**:
   - **Preproom Westfield**: `PRW1234`
   - **IT Administration**: `ADMIN2024`
   - **Technical Support**: `TECH2024`
   - **Help Desk**: `HELP2024`
   - **Facilities Maintenance**: `MAINT2024`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard layout and pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Home page (redirects to dashboard)
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── TicketCard.tsx     # Individual ticket display
│   ├── LoginForm.tsx      # Authentication form
│   └── CreateTicketModal.tsx # New ticket creation
├── lib/                   # Business logic and services
│   ├── auth.ts           # Authentication service
│   └── tickets.ts        # Ticket management service
└── types/                # TypeScript type definitions
    └── index.ts          # Shared types (Ticket, User, Comment)
```

### 🔧 Features Demonstration

### Support Request Creation (All Users)
- **Departments**: Click "Request Support" button
- **Administrators**: Click "Create New Ticket" button
- **Department-specific categories**: Each department sees relevant categories
- **User-friendly forms**: Simplified language for departments, technical details for admins
- **Auto-assignment**: Department requests auto-assign to their department

### Department-Specific Categories
- **Preproom Westfield**: Medical Equipment, Imaging Systems, Patient Monitoring
- **Technical Support**: Hardware, Software, Network, Security
- **Help Desk**: User Accounts, Password Resets, Software Installation
- **Facilities Maintenance**: HVAC, Electrical, Plumbing, Building Security

### Status Management (All Users)
- Departments can update status on assigned tickets
- Administrators can update any ticket
- Real-time statistics updates
- Visual priority and status indicators

### Search & Filtering
- Global search across title, description, and ticket ID
- Filter by status (Open, In Progress, Resolved, Closed)
- Filter by priority (Low, Medium, High, Urgent)
- Combined filtering for precise results

### Dashboard Analytics
- Live ticket count by status
- Priority-based metrics
- Visual indicators for urgent items
- Overdue ticket highlighting

## 🚀 Next Steps for Production

### Backend Integration
- Replace mock services with real API calls
- Implement database (PostgreSQL, MongoDB, etc.)
- Add real authentication (OAuth, JWT, etc.)
- Set up proper user management

### Advanced Features
- Real-time notifications (WebSocket/Server-Sent Events)
- Email notifications for ticket updates
- File attachments for tickets
- Comment system for ticket discussions
- Advanced reporting and analytics
- Audit logs and ticket history
- SLA tracking and escalation rules

### Deployment
- Environment configuration
- Production build optimization
- Database migrations
- Monitoring and logging
- Security hardening

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for consistent styling
- Responsive design for all devices

## 📄 License

This project is for internal use and demonstration purposes.