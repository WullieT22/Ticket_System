'use client'

import { useState, useEffect, useCallback } from 'react'
import { authService } from '@/lib/auth'
import { ticketService } from '@/lib/tickets'
import { Ticket } from '@/types'
import TicketCard from '@/components/TicketCard'
import CreateTicketModal from '@/components/CreateTicketModal'

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState<any[]>([])
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    department: 'all',
    search: '',
  })

  const user = authService.getCurrentUser()

  const loadTickets = useCallback(() => {
    let filteredTickets = ticketService.getTickets(filters)
    
    // Filter tickets by department (except for administrators who can see all)
    if (user?.role === 'operator') {
      filteredTickets = filteredTickets.filter(ticket => {
        // Show tickets that are:
        // 1. Reported by this user
        // 2. Assigned to this user 
        // 3. Related to this department (based on email domain)
        const userEmail = user.email
        const departmentKeyword = user.department.toLowerCase().replace(/\s+/g, '.')
        
        return ticket.reportedBy === userEmail || 
               (ticket.assignedTo && ticket.assignedTo === userEmail) ||
               ticket.reportedBy.includes(departmentKeyword) ||
               (ticket.assignedTo && ticket.assignedTo.includes(departmentKeyword))
      })
    }
    
    setTickets(filteredTickets)

    // Load email notifications for administrators
    if (user?.role === 'administrator') {
      const recentEmails = ticketService.getRecentEmailNotifications()
      setEmailNotifications(recentEmails)
    }
  }, [filters, user])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  const stats = ticketService.getTicketStats()

  return (
    <div>
      {/* Statistics Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {user?.department || 'Dashboard'}
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Tickets</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.open}</p>
          <p className="text-sm text-gray-500 mt-1">Needs attention</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">In Progress</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.inProgress}</p>
          <p className="text-sm text-gray-500 mt-1">Being worked on</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Urgent</h3>
          <p className="text-3xl font-bold text-red-600">{stats.urgent}</p>
          <p className="text-sm text-gray-500 mt-1">High priority</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Resolved</h3>
          <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
          <p className="text-sm text-gray-500 mt-1">Completed today</p>
        </div>
      </div>

      {/* Email Notifications Section - Only for Administrators */}
      {user?.role === 'administrator' && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📧</span>
            Recent Email Notifications
            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {emailNotifications.length}
            </span>
          </h3>
          {emailNotifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No email notifications sent recently</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {emailNotifications.slice(0, 10).map((email, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{email.subject}</p>
                      <p className="text-xs text-gray-600">To: {email.to}</p>
                      <p className="text-xs text-gray-500">{email.timestamp.toLocaleString()}</p>
                    </div>
                    <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded">
                      Sent ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Data Management Section - Only for Administrators */}
      {user?.role === 'administrator' && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💾</span>
            Data Management
          </h3>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                const data = ticketService.exportData()
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `ticket-system-backup-${new Date().toISOString().split('T')[0]}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              📥 Export Backup
            </button>
            <button
              onClick={() => {
                if (confirm('⚠️ This will permanently delete all tickets and comments. Are you sure?')) {
                  ticketService.clearAllData()
                  loadTickets()
                  alert('✅ All data cleared successfully')
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              🗑️ Clear All Data
            </button>
            <div className="text-sm text-gray-500 flex items-center">
              <span className="mr-2">💡</span>
              Data is automatically saved to browser storage
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Tickets</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Tickets
            </label>
            <input
              type="text"
              placeholder="Search by title, description, or ID..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          {/* Department Filter - Only for Administrators */}
          {user?.role === 'administrator' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                {ticketService.getAllDepartments().map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', priority: '', department: 'all', search: '' })}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Tickets ({tickets.length})
            </h2>
            {user?.role === 'operator' && (
              <p className="text-sm text-gray-600 mt-1">
                Showing tickets for {user.department} department only
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            {user?.role === 'operator' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Request Support
              </button>
            )}
            {user?.role === 'administrator' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create New Ticket
              </button>
            )}
          </div>
        </div>
        
        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No tickets found matching your criteria.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters or create a new ticket.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket}
                currentUser={user}
                onUpdate={loadTickets}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTicketCreated={loadTickets}
      />
    </div>
  )
}