'use client'

import { useState, useEffect } from 'react'
import { authService, AuthUser } from '@/lib/auth'
import { ticketService } from '@/lib/tickets'
import LoginForm from '@/components/LoginForm'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [newTicketsCount, setNewTicketsCount] = useState(0)

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  // Check for new tickets every 30 seconds for administrators
  useEffect(() => {
    if (user?.role === 'administrator') {
      const checkNotifications = () => {
        // Use the new notification count method
        const notificationCount = ticketService.getNotificationCount()
        setNewTicketsCount(notificationCount)
        
        // Log notification details for administrators
        if (notificationCount > 0) {
          const newTickets = ticketService.getNewTicketCount()
          const unassigned = ticketService.getUnassignedTicketCount()
          const stats = ticketService.getTicketStats()
          
          console.log(`🔔 Admin Notification:`)
          console.log(`  New Tickets (24h): ${newTickets}`)
          console.log(`  Unassigned Tickets: ${unassigned}`)
          console.log(`  Total Notification Count: ${notificationCount}`)
          console.log(`  Technician Breakdown:`, stats.technicianBreakdown)
        }
      }

      // Check immediately and then every 30 seconds
      checkNotifications()
      const interval = setInterval(checkNotifications, 30000)
      
      return () => clearInterval(interval)
    }
  }, [user])

  const clearNotifications = () => {
    setNewTicketsCount(0)
    // Force a refresh of notification count
    setTimeout(() => {
      const notificationCount = ticketService.getNotificationCount()
      setNewTicketsCount(notificationCount)
    }, 1000)
  }

  const handleLoginSuccess = (loggedInUser: AuthUser) => {
    setUser(loggedInUser)
  }

  const handleLogout = async () => {
    await authService.logout()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                IT Ticket System
              </h1>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {user.role === 'administrator' ? 'Administrator' : 'Department'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification Bell for Administrators */}
              {user.role === 'administrator' && (
                <div className="relative">
                  <button
                    onClick={clearNotifications}
                    className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    title={newTicketsCount > 0 ? 
                      `${newTicketsCount} notification(s) - New tickets and unassigned tickets` : 
                      'No new notifications'
                    }
                  >
                    <svg 
                      className={`w-6 h-6 ${newTicketsCount > 0 ? 'text-red-600 animate-pulse' : 'text-gray-600'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2C7.79086 2 6 3.79086 6 6V7.5C6 9.43 5.36 11.24 4.22 12.68L3.45 13.6C2.42 14.85 3.31 16.75 4.89 16.75H15.11C16.69 16.75 17.58 14.85 16.55 13.6L15.78 12.68C14.64 11.24 14 9.43 14 7.5V6C14 3.79086 12.2091 2 10 2Z"/>
                      <path d="M8.5 18.5C8.5 19.6046 9.39543 20.5 10.5 20.5C11.6046 20.5 12.5 19.6046 12.5 18.5H8.5Z"/>
                    </svg>
                    {newTicketsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {newTicketsCount > 9 ? '9+' : newTicketsCount}
                      </span>
                    )}
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{user.avatar}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.department}</p>
                  <p className="text-xs text-gray-500">{user.name}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}