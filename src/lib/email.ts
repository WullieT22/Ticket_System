// Email notification service
import { Ticket } from '@/types'
import nodemailer from 'nodemailer'

export interface EmailNotification {
  to: string
  subject: string
  body: string
  timestamp: Date
}

class EmailService {
  private notifications: EmailNotification[] = []
  private readonly adminEmail = process.env.EMAIL_TO || 'william.turner@eolabs.com'
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  // Initialize email transporter with SMTP configuration
  private initializeTransporter(): void {
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    // Check if SMTP is configured
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('⚠️  SMTP not configured - emails will be logged to console only')
      console.warn('📝 To enable email sending:')
      console.warn('   1. Copy .env.example to .env.local')
      console.warn('   2. Fill in your SMTP credentials')
      console.warn('   3. For Gmail, use an App Password from https://myaccount.google.com/apppasswords')
      return
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      console.log('✅ Email transporter initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize email transporter:', error)
      this.transporter = null
    }
  }

  // Send new ticket notification
  async sendNewTicketNotification(ticket: Ticket): Promise<boolean> {
    const subject = `🎫 New IT Ticket Created - ${ticket.id}`
    const body = this.generateNewTicketEmailBody(ticket)
    
    return this.sendEmail(this.adminEmail, subject, body)
  }

  // Send technician assignment notification
  async sendTechnicianAssignmentNotification(ticket: Ticket, technicianName: string): Promise<boolean> {
    const subject = `👤 Ticket ${ticket.id} Assigned to ${technicianName}`
    const body = this.generateAssignmentEmailBody(ticket, technicianName)
    
    return this.sendEmail(this.adminEmail, subject, body)
  }

  // Generate email body for new ticket
  private generateNewTicketEmailBody(ticket: Ticket): string {
    return `
📋 NEW IT TICKET CREATED

Ticket ID: ${ticket.id}
Title: ${ticket.title}
Priority: ${ticket.priority.toUpperCase()}
Department: ${ticket.department}
Category: ${ticket.category}

Description:
${ticket.description}

Reported by: ${ticket.reportedBy}
Created: ${ticket.createdAt.toLocaleString()}
Due Date: ${ticket.dueDate ? ticket.dueDate.toLocaleDateString() : 'Not set'}

Status: ${ticket.status.toUpperCase()}
Assignment: ${ticket.assignedTechnician || 'UNASSIGNED'}

---
🔗 View ticket in IT Ticket System
⚡ This is an automated notification
    `.trim()
  }

  // Generate email body for technician assignment
  private generateAssignmentEmailBody(ticket: Ticket, technicianName: string): string {
    return `
👤 TICKET ASSIGNED TO TECHNICIAN

Ticket ID: ${ticket.id}
Title: ${ticket.title}
Assigned to: ${technicianName}

Priority: ${ticket.priority.toUpperCase()}
Department: ${ticket.department}
Due Date: ${ticket.dueDate ? ticket.dueDate.toLocaleDateString() : 'Not set'}

Description:
${ticket.description}

Updated: ${new Date().toLocaleString()}

---
🔗 View ticket in IT Ticket System
⚡ Assignment notification sent automatically
    `.trim()
  }

  // Core email sending method
  private async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    const notification: EmailNotification = {
      to,
      subject,
      body,
      timestamp: new Date()
    }

    // Store notification for tracking
    this.notifications.push(notification)

    // Log to console for debugging
    console.log('\n' + '='.repeat(60))
    console.log('📧 EMAIL NOTIFICATION')
    console.log('='.repeat(60))
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Timestamp: ${notification.timestamp.toLocaleString()}`)
    console.log('-'.repeat(60))

    // If transporter is configured, send actual email
    if (this.transporter) {
      try {
        const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || 'noreply@company.com'
        
        const info = await this.transporter.sendMail({
          from: `"IT Ticket System" <${fromEmail}>`,
          to: to,
          subject: subject,
          text: body,
          html: this.convertToHtml(body),
        })

        console.log('✅ Email sent successfully!')
        console.log(`Message ID: ${info.messageId}`)
        console.log('='.repeat(60) + '\n')
        return true
      } catch (error) {
        console.error('❌ Failed to send email via SMTP:', error)
        console.log('Email body (for reference):')
        console.log(body)
        console.log('='.repeat(60) + '\n')
        return false
      }
    } else {
      // No transporter configured - just log to console
      console.log('⚠️  SMTP not configured - email logged to console only')
      console.log('\nEmail Body:')
      console.log('-'.repeat(40))
      console.log(body)
      console.log('-'.repeat(40))
      console.log('='.repeat(60) + '\n')
      return true // Return true to not block the ticket creation
    }
  }

  // Convert plain text email to basic HTML
  private convertToHtml(text: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 15px; border-radius: 5px 5px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .footer { background: #f3f4f6; padding: 10px; border-radius: 0 0 5px 5px; font-size: 12px; color: #6b7280; text-align: center; }
    .field { margin: 10px 0; }
    .label { font-weight: bold; color: #1f2937; }
    pre { background: white; padding: 10px; border-radius: 3px; white-space: pre-wrap; word-wrap: break-word; }
  </style>
</head>
<body>
  <div class="header">
    <h2 style="margin: 0;">🎫 IT Ticket System</h2>
  </div>
  <div class="content">
    <pre>${text}</pre>
  </div>
  <div class="footer">
    ⚡ This is an automated notification from IT Ticket System
  </div>
</body>
</html>
    `.trim()
  }

  // Get all sent notifications for debugging
  getNotifications(): EmailNotification[] {
    return [...this.notifications]
  }

  // Get recent notifications (last 24 hours)
  getRecentNotifications(): EmailNotification[] {
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    
    return this.notifications.filter(n => n.timestamp > twentyFourHoursAgo)
  }

  // Clear notification history
  clearNotifications(): void {
    this.notifications = []
    console.log('📧 Email notification history cleared')
  }
}

export const emailService = new EmailService()