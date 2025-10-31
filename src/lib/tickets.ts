import { Ticket, Comment } from '@/types'
import { emailService } from './email'

// Available technicians for assignment
export const AVAILABLE_TECHNICIANS = [
  'William',
  'Andy', 
  'Anthony'
]

// Extended mock data with more realistic tickets
const mockTickets: Ticket[] = [
  // Starting with clean slate - no demo tickets
]

const mockComments: Comment[] = [
  // No demo comments - start fresh
]

class TicketService {
  private tickets: Ticket[] = []
  private comments: Comment[] = []
  private readonly STORAGE_KEY = 'it-ticket-system-tickets'
  private readonly COMMENTS_KEY = 'it-ticket-system-comments'

  constructor() {
    this.loadFromStorage()
  }

  // Load tickets and comments from localStorage
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        // Load tickets
        const storedTickets = localStorage.getItem(this.STORAGE_KEY)
        if (storedTickets) {
          const parsedTickets = JSON.parse(storedTickets)
          // Convert date strings back to Date objects
          this.tickets = parsedTickets.map((ticket: any) => ({
            ...ticket,
            createdAt: new Date(ticket.createdAt),
            updatedAt: new Date(ticket.updatedAt),
            dueDate: ticket.dueDate ? new Date(ticket.dueDate) : undefined,
            completedAt: ticket.completedAt ? new Date(ticket.completedAt) : undefined,
          }))
        } else {
          // Initialize with mock data only if no stored data exists
          this.tickets = [...mockTickets]
        }

        // Load comments
        const storedComments = localStorage.getItem(this.COMMENTS_KEY)
        if (storedComments) {
          const parsedComments = JSON.parse(storedComments)
          this.comments = parsedComments.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
          }))
        } else {
          this.comments = [...mockComments]
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error)
        this.tickets = [...mockTickets]
        this.comments = [...mockComments]
      }
    } else {
      // Server-side rendering fallback
      this.tickets = [...mockTickets]
      this.comments = [...mockComments]
    }
  }

  // Save tickets to localStorage
  private saveTicketsToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tickets))
      } catch (error) {
        console.error('Error saving tickets to localStorage:', error)
      }
    }
  }

  // Save comments to localStorage
  private saveCommentsToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.COMMENTS_KEY, JSON.stringify(this.comments))
      } catch (error) {
        console.error('Error saving comments to localStorage:', error)
      }
    }
  }

  // Get all tickets with optional filtering
  getTickets(filters?: {
    status?: string
    priority?: string
    assignedTo?: string
    department?: string
    search?: string
  }): Ticket[] {
    let filtered = [...this.tickets]

    if (filters?.status) {
      filtered = filtered.filter(t => t.status === filters.status)
    }
    if (filters?.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority)
    }
    if (filters?.assignedTo) {
      filtered = filtered.filter(t => t.assignedTo === filters.assignedTo)
    }
    if (filters?.department && filters.department !== 'all') {
      filtered = filtered.filter(t => t.department === filters.department)
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        t.id.toLowerCase().includes(search)
      )
    }

    return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  // Get ticket by ID
  getTicketById(id: string): Ticket | null {
    return this.tickets.find(t => t.id === id) || null
  }

  // Create new ticket
  createTicket(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Ticket {
    const newTicket: Ticket = {
      ...data,
      id: `TKT-${String(this.tickets.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.tickets.unshift(newTicket)
    this.saveTicketsToStorage() // Save to localStorage
    
    // Send email notification for new ticket
    this.sendNewTicketEmail(newTicket)
    
    return newTicket
  }

  // Send email notification for new ticket
  private async sendNewTicketEmail(ticket: Ticket): Promise<void> {
    try {
      const emailSent = await emailService.sendNewTicketNotification(ticket)
      if (emailSent) {
        console.log(`✅ New ticket email notification sent successfully for ${ticket.id}`)
      } else {
        console.error(`❌ Failed to send new ticket email for ${ticket.id}`)
      }
    } catch (error) {
      console.error(`❌ Error sending new ticket email for ${ticket.id}:`, error)
    }
  }

  // Update ticket
  updateTicket(id: string, updates: Partial<Ticket>): Ticket | null {
    const index = this.tickets.findIndex(t => t.id === id)
    if (index === -1) return null

    const currentTicket = this.tickets[index]
    const updatedTicket = {
      ...currentTicket,
      ...updates,
      updatedAt: new Date(),
    }

    // Auto-set completion time when status changes to resolved or closed
    if (updates.status && 
        (updates.status === 'resolved' || updates.status === 'closed') &&
        currentTicket.status !== updates.status &&
        !updatedTicket.completedAt) {
      updatedTicket.completedAt = new Date()
    }

    // Clear completion time if status changes back to open or in-progress
    if (updates.status && 
        (updates.status === 'open' || updates.status === 'in-progress') &&
        (currentTicket.status === 'resolved' || currentTicket.status === 'closed')) {
      updatedTicket.completedAt = undefined
    }

    this.tickets[index] = updatedTicket
    this.saveTicketsToStorage() // Save to localStorage
    
    // Send email notification if technician was assigned
    if (updates.assignedTechnician && updates.assignedTechnician !== currentTicket.assignedTechnician) {
      this.sendTechnicianAssignmentEmail(updatedTicket, updates.assignedTechnician)
    }
    
    return this.tickets[index]
  }

  // Send email notification for technician assignment
  private async sendTechnicianAssignmentEmail(ticket: Ticket, technicianName: string): Promise<void> {
    try {
      const emailSent = await emailService.sendTechnicianAssignmentNotification(ticket, technicianName)
      if (emailSent) {
        console.log(`✅ Technician assignment email sent successfully for ${ticket.id} → ${technicianName}`)
      } else {
        console.error(`❌ Failed to send assignment email for ${ticket.id}`)
      }
    } catch (error) {
      console.error(`❌ Error sending assignment email for ${ticket.id}:`, error)
    }
  }

  // Update admin comments specifically
  updateAdminComments(id: string, adminComments: string): Ticket | null {
    const index = this.tickets.findIndex(t => t.id === id)
    if (index === -1) return null

    this.tickets[index] = {
      ...this.tickets[index],
      adminComments,
      updatedAt: new Date(),
    }
    this.saveTicketsToStorage() // Save to localStorage
    return this.tickets[index]
  }

  // Get comments for a ticket
  getTicketComments(ticketId: string): Comment[] {
    return this.comments
      .filter(c => c.ticketId === ticketId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  // Add comment to ticket
  addComment(ticketId: string, userId: string, content: string, isInternal: boolean = false): Comment {
    const comment: Comment = {
      id: `comment-${this.comments.length + 1}`,
      ticketId,
      userId,
      content,
      isInternal,
      createdAt: new Date(),
    }
    this.comments.push(comment)
    this.saveCommentsToStorage() // Save to localStorage
    return comment
  }

  // Get ticket statistics
  getTicketStats() {
    const total = this.tickets.length
    const open = this.tickets.filter(t => t.status === 'open').length
    const inProgress = this.tickets.filter(t => t.status === 'in-progress').length
    const resolved = this.tickets.filter(t => t.status === 'resolved').length
    const closed = this.tickets.filter(t => t.status === 'closed').length

    const urgent = this.tickets.filter(t => t.priority === 'urgent').length
    const high = this.tickets.filter(t => t.priority === 'high').length

    // Count tickets assigned to technicians
    const assignedToTechnicians = this.tickets.filter(t => t.assignedTechnician).length
    
    // Breakdown by individual technicians
    const technicianBreakdown = {
      William: this.tickets.filter(t => t.assignedTechnician === 'William').length,
      Andy: this.tickets.filter(t => t.assignedTechnician === 'Andy').length,
      Anthony: this.tickets.filter(t => t.assignedTechnician === 'Anthony').length,
    }

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      urgent,
      high,
      assignedToTechnicians,
      technicianBreakdown,
    }
  }

  // Get all unique departments
  getAllDepartments(): string[] {
    const departments = Array.from(new Set(this.tickets.map(t => t.department)))
    return departments.sort()
  }

  // Get count of new tickets for notifications (tickets created in last 24 hours)
  getNewTicketCount(): number {
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    
    return this.tickets.filter(t => 
      t.createdAt > twentyFourHoursAgo && 
      t.status === 'open'
    ).length
  }

  // Get count of unassigned tickets for notifications
  getUnassignedTicketCount(): number {
    return this.tickets.filter(t => 
      !t.assignedTechnician && 
      (t.status === 'open' || t.status === 'in-progress')
    ).length
  }

  // Get total notification count for admin bell
  getNotificationCount(): number {
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    
    // Count tickets that need attention (avoid double counting)
    const ticketsNeedingAttention = this.tickets.filter(t => {
      // Must be open or in-progress
      const isActiveStatus = t.status === 'open' || t.status === 'in-progress'
      if (!isActiveStatus) return false
      
      // Either newly created (last 24h) OR unassigned, but count each ticket only once
      const isNew = t.createdAt > twentyFourHoursAgo
      const isUnassigned = !t.assignedTechnician
      
      return isNew || isUnassigned
    })
    
    return ticketsNeedingAttention.length
  }

  // Debug method to see exactly which tickets are being counted for notifications
  getNotificationDetails(): { count: number, tickets: { id: string, title: string, status: string, assignedTechnician?: string, createdAt: Date }[] } {
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    
    const ticketsNeedingAttention = this.tickets.filter(t => {
      const isActiveStatus = t.status === 'open' || t.status === 'in-progress'
      if (!isActiveStatus) return false
      
      const isNew = t.createdAt > twentyFourHoursAgo
      const isUnassigned = !t.assignedTechnician
      
      return isNew || isUnassigned
    })
    
    return {
      count: ticketsNeedingAttention.length,
      tickets: ticketsNeedingAttention.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        assignedTechnician: t.assignedTechnician,
        createdAt: t.createdAt
      }))
    }
  }

  // Get email notification history
  getEmailNotifications() {
    return emailService.getNotifications()
  }

  // Get recent email notifications
  getRecentEmailNotifications() {
    return emailService.getRecentNotifications()
  }

  // Clear all data (for testing/reset)
  clearAllData(): void {
    this.tickets = []
    this.comments = []
    this.saveTicketsToStorage()
    this.saveCommentsToStorage()
    emailService.clearNotifications()
    console.log('🗑️ All ticket data cleared')
  }

  // Export data for backup
  exportData() {
    return {
      tickets: this.tickets,
      comments: this.comments,
      emailNotifications: emailService.getNotifications()
    }
  }
}

export const ticketService = new TicketService()