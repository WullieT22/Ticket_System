export interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  contactName?: string
  assignedTo?: string
  assignedTechnician?: string  // Name of the specific technician (William, Andy, Anthony)
  reportedBy: string
  department: string  // Department that reported/owns the ticket
  createdAt: Date
  updatedAt: Date
  completedAt?: Date  // When ticket was resolved/closed
  dueDate?: Date
  adminComments?: string  // Admin-only field for tracking what was done
  comments?: Comment[]   // Array of all comments/notes
}

export interface User {
  id: string
  email: string
  name: string
  role: 'operator' | 'administrator'
  department?: string
  createdAt: Date
}

export interface Comment {
  id: string
  ticketId: string
  userId: string
  content: string
  isInternal: boolean
  createdAt: Date
}