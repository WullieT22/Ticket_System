import { Ticket, Comment } from '@/types'

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
  private tickets: Ticket[] = [...mockTickets]
  private comments: Comment[] = [...mockComments]

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
    
    // Send email notification for new ticket
    this.sendNewTicketEmail(newTicket)
    
    return newTicket
  }

  // Send email notification for new ticket
  private sendNewTicketEmail(ticket: Ticket): void {
    // In a real application, this would call an API endpoint
    console.log(`📧 New ticket notification sent to william.turner@eolabs.com`)
    console.log(`Subject: New Ticket Created - ${ticket.id}`)
    console.log(`Title: ${ticket.title}`)
    console.log(`Priority: ${ticket.priority.toUpperCase()}`)
    console.log(`Department: ${ticket.department}`)
    console.log(`Reported by: ${ticket.reportedBy}`)
    console.log(`Created: ${ticket.createdAt.toLocaleString()}`)
    
    // You would implement actual email sending here
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
    
    // Send email notification if technician was assigned
    if (updates.assignedTechnician && updates.assignedTechnician !== currentTicket.assignedTechnician) {
      this.sendTechnicianAssignmentEmail(updatedTicket, updates.assignedTechnician)
    }
    
    return this.tickets[index]
  }

  // Send email notification for technician assignment
  private sendTechnicianAssignmentEmail(ticket: Ticket, technicianName: string): void {
    // In a real application, this would call an API endpoint
    console.log(`📧 Email notification sent to william.turner@eolabs.com`)
    console.log(`Subject: Ticket ${ticket.id} Assigned to ${technicianName}`)
    console.log(`Ticket: ${ticket.title}`)
    console.log(`Priority: ${ticket.priority.toUpperCase()}`)
    console.log(`Department: ${ticket.department}`)
    console.log(`Assigned Technician: ${technicianName}`)
    console.log(`Due Date: ${ticket.dueDate ? ticket.dueDate.toLocaleDateString() : 'Not set'}`)
    
    // You would implement actual email sending here
    // Example: 
    // await fetch('/api/send-assignment-notification', { 
    //   method: 'POST', 
    //   body: JSON.stringify({ 
    //     ticket, 
    //     technician: technicianName, 
    //     email: 'william.turner@eolabs.com' 
    //   }) 
    // })
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
}

export const ticketService = new TicketService()