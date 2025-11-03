import { Ticket } from '@/types'
import { AuthUser, authService } from '@/lib/auth'
import { ticketService, AVAILABLE_TECHNICIANS } from '@/lib/tickets'
import { useState } from 'react'

interface TicketCardProps {
  ticket: Ticket
  currentUser?: AuthUser | null
  onUpdate?: () => void
}

export default function TicketCard({ ticket, currentUser, onUpdate }: TicketCardProps) {
  const [isEditingComments, setIsEditingComments] = useState(false)
  const [adminComments, setAdminComments] = useState(ticket.adminComments || '')
  const [isEditingTechnician, setIsEditingTechnician] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState(ticket.assignedTechnician || '')

  // Helper function to calculate duration between dates
  const calculateDuration = (start: Date, end?: Date): string => {
    const endDate = end || new Date()
    const diffMs = endDate.getTime() - start.getTime()
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}d ${hours}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  // Helper function to format date and time
  const formatDateTime = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }

  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  }

  const handleStatusChange = async (newStatus: string) => {
    if (currentUser && (currentUser.role === 'administrator' || ticket.assignedTo === currentUser.email)) {
      await ticketService.updateTicket(ticket.id, { status: newStatus as any })
      onUpdate?.()
    }
  }

  const handleSaveComments = () => {
    if (currentUser?.role === 'administrator') {
      ticketService.updateAdminComments(ticket.id, adminComments)
      setIsEditingComments(false)
      onUpdate?.()
    }
  }

  const handleCancelComments = () => {
    setAdminComments(ticket.adminComments || '')
    setIsEditingComments(false)
  }

  const handleSaveTechnician = async () => {
    if (currentUser?.role === 'administrator') {
      await ticketService.updateTicket(ticket.id, { assignedTechnician: selectedTechnician || undefined })
      setIsEditingTechnician(false)
      onUpdate?.()
    }
  }

  const handleCancelTechnician = () => {
    setSelectedTechnician(ticket.assignedTechnician || '')
    setIsEditingTechnician(false)
  }

  const isOverdue = ticket.dueDate && new Date() > ticket.dueDate
  const canEdit = currentUser && (currentUser.role === 'administrator' || ticket.assignedTo === currentUser.email)

  // Get department name for assigned user
  const getAssignedDepartment = (email: string) => {
    const allUsers = [
      ...authService.getAllOperators(),
      ...authService.getAllDepartments().filter(d => d.role === 'Administrator').map(d => ({
        id: 'admin',
        email: 'admin@company.com',
        name: 'System Administrator',
        role: 'administrator' as const,
        department: d.name,
        avatar: d.avatar
      }))
    ]
    const user = allUsers.find(u => u.email === email)
    return user?.department || email
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${isOverdue ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {ticket.title}
        </h3>
        <span className="text-sm text-gray-500">#{ticket.id}</span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {ticket.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
          {ticket.status.replace('-', ' ').toUpperCase()}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
          {ticket.priority.toUpperCase()}
        </span>
        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
          🏢 {ticket.department}
        </span>
        {ticket.assignedTechnician && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            👨‍💻 {ticket.assignedTechnician}
          </span>
        )}
        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
          {ticket.category}
        </span>
        {isOverdue && (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            OVERDUE
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-500 mb-4">
        {ticket.contactName && (
          <div><span className="font-medium">Contact:</span> {ticket.contactName}</div>
        )}
        <div>Reported by: {ticket.contactName || ticket.reportedBy}</div>
        {ticket.dueDate && (
          <div className={isOverdue ? 'text-red-600 font-medium' : ''}>
            Due: {ticket.dueDate.toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Admin Comments Section */}
      {(ticket.adminComments || currentUser?.role === 'administrator') && (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Admin Notes:
            </label>
            {currentUser?.role === 'administrator' && !isEditingComments && (
              <button
                onClick={() => setIsEditingComments(true)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            )}
          </div>
          
          {isEditingComments && currentUser?.role === 'administrator' ? (
            <div className="space-y-2">
              <textarea
                value={adminComments}
                onChange={(e) => setAdminComments(e.target.value)}
                placeholder="Enter notes about what was done to resolve this ticket..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveComments}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelComments}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
              {ticket.adminComments || (
                <em className="text-gray-500">No admin notes yet</em>
              )}
            </div>
          )}
        </div>
      )}

      {/* Technician Assignment Section - Admin Only */}
      {currentUser?.role === 'administrator' && (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Assigned Technician:
            </label>
            {!isEditingTechnician && (
              <button
                onClick={() => setIsEditingTechnician(true)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {ticket.assignedTechnician ? 'Change' : 'Assign'}
              </button>
            )}
          </div>
          
          {isEditingTechnician ? (
            <div className="space-y-2">
              <select
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a technician...</option>
                {AVAILABLE_TECHNICIANS.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveTechnician}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelTechnician}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
              {ticket.assignedTechnician ? (
                <span className="font-medium">👨‍💻 {ticket.assignedTechnician}</span>
              ) : (
                <em className="text-gray-500">No technician assigned</em>
              )}
            </div>
          )}
        </div>
      )}

      {canEdit && (
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Status:
          </label>
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      )}

      {/* Enhanced Time Information */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">📅 Created:</span>
            <span className="text-gray-800">{formatDateTime(ticket.createdAt)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">🔄 Last Updated:</span>
            <span className="text-gray-800">{formatDateTime(ticket.updatedAt)}</span>
          </div>

          {ticket.completedAt && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-medium">✅ Completed:</span>
                <span className="text-green-800">{formatDateTime(ticket.completedAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">⏱️ Resolution Time:</span>
                <span className="text-blue-800 font-semibold">{calculateDuration(ticket.createdAt, ticket.completedAt)}</span>
              </div>
            </>
          )}

          {!ticket.completedAt && (ticket.status === 'open' || ticket.status === 'in-progress') && (
            <div className="flex justify-between items-center">
              <span className="text-orange-600 font-medium">⏳ Time Open:</span>
              <span className="text-orange-800 font-semibold">{calculateDuration(ticket.createdAt)}</span>
            </div>
          )}

          {ticket.dueDate && (
            <div className="flex justify-between items-center">
              <span className="text-purple-600 font-medium">📆 Due Date:</span>
              <span className={`${isOverdue ? 'text-red-600 font-bold' : 'text-purple-800'}`}>
                {formatDateTime(ticket.dueDate)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}