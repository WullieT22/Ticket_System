import { Ticket, Comment } from '@/types'

// Available technicians for assignment
export const AVAILABLE_TECHNICIANS = [
  'William',
  'Andy', 
  'Anthony'
]

// Extended mock data with more realistic tickets
const mockTickets: Ticket[] = [
  // No demo tickets - start fresh
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
    return newTicket
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
    return this.tickets[index]
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

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      urgent,
      high,
    }
  }

  // Get all unique departments
  getAllDepartments(): string[] {
    const departments = Array.from(new Set(this.tickets.map(t => t.department)))
    return departments.sort()
  }
}

export const ticketService = new TicketService()