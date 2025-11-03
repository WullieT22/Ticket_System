// Email notification service
import { Ticket } from '@/types'

export interface EmailNotification {
  to: string
  subject: string
  body: string
  timestamp: Date
}

class EmailService {
  private notifications: EmailNotification[] = []
  private readonly adminEmail = process.env.NEXT_PUBLIC_EMAIL_TO || 'wt22@live.co.uk'

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

  // Core email sending method - uses API route
  private async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    const notification: EmailNotification = {
      to,
      subject,
      body,
      timestamp: new Date()
    }

    // Store notification for tracking
    this.notifications.push(notification)

    try {
      // Send email via API route (server-side only)
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, body }),
      })

      const result = await response.json()

      if (result.success) {
        console.log('✅ Email sent successfully!')
        if (result.messageId) {
          console.log(`Message ID: ${result.messageId}`)
        }
        return true
      } else {
        console.error('❌ Failed to send email:', result.error)
        return false
      }
    } catch (error) {
      console.error('❌ Failed to send email:', error)
      return false
    }
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