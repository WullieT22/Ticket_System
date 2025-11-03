'use client'

import { useState, useEffect, useCallback } from 'react'
import { authService } from '@/lib/auth'
import { ticketService } from '@/lib/tickets'
import { Ticket, Comment as TicketComment } from '@/types'
import TicketCard from '@/components/TicketCard'
import CreateTicketModal from '@/components/CreateTicketModal'

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState<any[]>([])
  const [showWeekSelector, setShowWeekSelector] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(0) // 0 = this week, 1 = last week, etc.
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    department: 'all',
    search: '',
  })

  const user = authService.getCurrentUser()
  
  // Calculate date ranges for weeks
  const getWeekRange = (weeksAgo: number) => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() - (weeksAgo * 7)) // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6) // End of week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999)
    
    return { start: startOfWeek, end: endOfWeek }
  }
  
  const getTicketsForWeek = (weeksAgo: number) => {
    const { start, end } = getWeekRange(weeksAgo)
    return tickets.filter(t => t.createdAt >= start && t.createdAt <= end)
  }

  const loadTickets = useCallback(() => {
    // Handle special "completed" filter that includes both resolved and closed
    const adjustedFilters: any = { ...filters }
    if (filters.status === 'completed') {
      adjustedFilters.status = undefined // We'll filter manually below
    }
    
    let filteredTickets = ticketService.getTickets(adjustedFilters)
    
    // Apply custom completed filter (resolved OR closed)
    if (filters.status === 'completed') {
      filteredTickets = filteredTickets.filter(t => t.status === 'resolved' || t.status === 'closed')
    }
    
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

      {/* KPI Metrics - Only for Administrators */}
      {user?.role === 'administrator' && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg shadow mb-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <span className="mr-2">📊</span>
              KPI Dashboard
            </h3>
            <div className="flex gap-3">
            <button
              onClick={async () => {
                try {
                  // Ensure we're in browser environment
                  if (typeof window === 'undefined') {
                    throw new Error('PDF generation only works in browser')
                  }
                  
                  // Dynamic import to avoid SSR issues - must be done this way for Vercel
                  const jsPDFModule = await import('jspdf')
                  const jsPDF = jsPDFModule.default
                  
                  // Import autotable plugin - it extends jsPDF prototype automatically
                  await import('jspdf-autotable')
                  
                  const completedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed')
                const openTickets = tickets.filter(t => t.status === 'open')
                const inProgressTickets = tickets.filter(t => t.status === 'in-progress')
                const urgentTickets = tickets.filter(t => t.priority === 'urgent')
                const thisWeekTickets = tickets.filter(t => t.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                
                // Create PDF in landscape A4
                const doc = new jsPDF({
                  orientation: 'landscape',
                  unit: 'mm',
                  format: 'a4'
                })
                
                const pageWidth = doc.internal.pageSize.getWidth()
                const pageHeight = doc.internal.pageSize.getHeight()
                
                // Header with gradient effect (using rectangles)
                doc.setFillColor(37, 99, 235) // Blue
                doc.rect(0, 0, pageWidth, 35, 'F')
                
                // Title
                doc.setTextColor(255, 255, 255)
                doc.setFontSize(24)
                doc.setFont('helvetica', 'bold')
                doc.text('IT TICKET SYSTEM - KPI REPORT', pageWidth / 2, 15, { align: 'center' })
                
                // Report details
                doc.setFontSize(10)
                doc.setFont('helvetica', 'normal')
                doc.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 23, { align: 'center' })
                doc.text(`Generated By: ${user?.name || user?.email} | Department: ${user?.department || 'All Departments'}`, pageWidth / 2, 29, { align: 'center' })
                
                let yPos = 45
                
                // Executive Summary Section
                doc.setTextColor(0, 0, 0)
                doc.setFontSize(16)
                doc.setFont('helvetica', 'bold')
                doc.text('EXECUTIVE SUMMARY', 14, yPos)
                yPos += 8
                
                // Create bar chart data using colored boxes
                const metrics = [
                  { label: 'Total Tickets', value: tickets.length, color: [59, 130, 246] },
                  { label: 'Open', value: openTickets.length, color: [239, 68, 68] },
                  { label: 'In Progress', value: inProgressTickets.length, color: [251, 191, 36] },
                  { label: 'Completed', value: completedTickets.length, color: [34, 197, 94] },
                  { label: 'Urgent', value: urgentTickets.length, color: [168, 85, 247] },
                  { label: 'This Week', value: thisWeekTickets.length, color: [14, 165, 233] }
                ]
                
                // Draw bar chart
                const chartStartX = 14
                const chartStartY = yPos
                const barHeight = 8
                const maxBarWidth = 100
                const maxValue = Math.max(...metrics.map(m => m.value), 1)
                
                metrics.forEach((metric, index) => {
                  const y = chartStartY + (index * (barHeight + 4))
                  
                  // Label
                  doc.setFontSize(10)
                  doc.setFont('helvetica', 'normal')
                  doc.text(metric.label, chartStartX, y + 6)
                  
                  // Bar
                  const barWidth = (metric.value / maxValue) * maxBarWidth
                  doc.setFillColor(metric.color[0], metric.color[1], metric.color[2])
                  doc.roundedRect(chartStartX + 45, y, barWidth, barHeight, 2, 2, 'F')
                  
                  // Value
                  doc.setFont('helvetica', 'bold')
                  doc.text(String(metric.value), chartStartX + 45 + barWidth + 3, y + 6)
                  
                  // Percentage
                  const percentage = tickets.length > 0 ? Math.round((metric.value / tickets.length) * 100) : 0
                  doc.setFont('helvetica', 'normal')
                  doc.setFontSize(9)
                  doc.text(`(${percentage}%)`, chartStartX + 45 + barWidth + 12, y + 6)
                })
                
                yPos = chartStartY + (metrics.length * 12) + 8
                
                // Completion Rate Box
                doc.setFillColor(34, 197, 94)
                doc.roundedRect(chartStartX + 160, chartStartY, 55, 25, 3, 3, 'F')
                doc.setTextColor(255, 255, 255)
                doc.setFontSize(12)
                doc.setFont('helvetica', 'bold')
                doc.text('COMPLETION RATE', chartStartX + 187.5, chartStartY + 10, { align: 'center' })
                doc.setFontSize(24)
                const completionRate = tickets.length > 0 ? Math.round((completedTickets.length / tickets.length) * 100) : 0
                doc.text(`${completionRate}%`, chartStartX + 187.5, chartStartY + 21, { align: 'center' })
                
                // Completed Tickets Detail Table
                yPos += 5
                doc.setTextColor(0, 0, 0)
                doc.setFontSize(16)
                doc.setFont('helvetica', 'bold')
                doc.text('COMPLETED TICKETS DETAIL', 14, yPos)
                yPos += 5
                
                // Prepare table data
                const tableData = completedTickets.map(t => {
                  const createdDate = new Date(t.createdAt)
                  const completedDate = t.completedAt ? new Date(t.completedAt) : new Date()
                  const daysToComplete = Math.ceil((completedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
                  
                  // Get admin notes
                  const allComments = ticketService.getTicketComments(t.id)
                  const adminNotes = allComments
                    .filter((c: TicketComment) => c.isInternal)
                    .map((c: TicketComment) => `[${new Date(c.createdAt).toLocaleDateString()}] ${c.content}`)
                    .join(' | ')
                  
                  const fullAdminNotes = [
                    t.adminComments || '',
                    adminNotes
                  ].filter(note => note.trim()).join(' | ') || 'No notes'
                  
                  return [
                    t.id,
                    t.title,
                    t.department,
                    t.priority.toUpperCase(),
                    t.reportedBy,
                    t.assignedTechnician || 'Unassigned',
                    createdDate.toLocaleDateString(),
                    completedDate.toLocaleDateString(),
                    String(daysToComplete),
                    fullAdminNotes
                  ]
                })
                
                // @ts-ignore - autoTable adds itself to jsPDF
                doc.autoTable({
                  startY: yPos,
                  head: [['ID', 'Title', 'Dept', 'Priority', 'Reported By', 'Assigned To', 'Created', 'Completed', 'Days', 'Admin Notes']],
                  body: tableData,
                  theme: 'grid',
                  headStyles: {
                    fillColor: [37, 99, 235],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 9
                  },
                  bodyStyles: {
                    fontSize: 8,
                    cellPadding: 2
                  },
                  columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 40 },
                    2: { cellWidth: 25 },
                    3: { cellWidth: 20 },
                    4: { cellWidth: 35 },
                    5: { cellWidth: 25 },
                    6: { cellWidth: 22 },
                    7: { cellWidth: 22 },
                    8: { cellWidth: 12 },
                    9: { cellWidth: 'auto' }
                  },
                  alternateRowStyles: {
                    fillColor: [245, 247, 250]
                  }
                })
                
                // Footer
                // @ts-ignore
                const finalY = doc.lastAutoTable.finalY || yPos + 20
                doc.setFontSize(8)
                doc.setTextColor(100, 100, 100)
                doc.text(`Total Records: ${completedTickets.length} | Generated: ${new Date().toISOString().split('T')[0]}`, 14, pageHeight - 10)
                doc.text(`Page 1 of 1`, pageWidth - 14, pageHeight - 10, { align: 'right' })
                
                // Save PDF
                doc.save(`kpi-report-${new Date().toISOString().split('T')[0]}.pdf`)
                } catch (error: any) {
                  console.error('PDF Export Error:', error)
                  const errorMessage = error?.message || 'Unknown error'
                  alert(`Failed to generate PDF: ${errorMessage}\n\nPlease try again or export as CSV instead.`)
                }
              }}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-md transition-colors text-sm font-medium flex items-center gap-2"
            >
              📄 Export PDF Report
            </button>
            <button
              onClick={() => {
                // Export KPI data to CSV with professional formatting
                const completedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed')
                const openTickets = tickets.filter(t => t.status === 'open')
                const inProgressTickets = tickets.filter(t => t.status === 'in-progress')
                const urgentTickets = tickets.filter(t => t.priority === 'urgent')
                const thisWeekTickets = tickets.filter(t => t.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                
                // Helper function to escape CSV values
                const csvEscape = (value: any) => {
                  if (value === null || value === undefined) return ''
                  const str = String(value)
                  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`
                  }
                  return str
                }
                
                // Build professional Excel-friendly CSV
                let csv = ''
                
                // Header Section - Clean and simple
                csv += 'IT TICKET SYSTEM - KPI REPORT\n'
                csv += `Report Generated:,${new Date().toLocaleString()}\n`
                csv += `Generated By:,${user?.name || user?.email}\n`
                csv += `Department:,${user?.department || 'All Departments'}\n`
                csv += '\n'
                
                // Executive Summary Section
                csv += 'EXECUTIVE SUMMARY\n'
                csv += 'METRIC,VALUE,PERCENTAGE\n'
                csv += `Total Tickets,${tickets.length},100%\n`
                csv += `Open Tickets,${openTickets.length},${tickets.length > 0 ? Math.round((openTickets.length / tickets.length) * 100) : 0}%\n`
                csv += `In Progress,${inProgressTickets.length},${tickets.length > 0 ? Math.round((inProgressTickets.length / tickets.length) * 100) : 0}%\n`
                csv += `Completed,${completedTickets.length},${tickets.length > 0 ? Math.round((completedTickets.length / tickets.length) * 100) : 0}%\n`
                csv += `Urgent Priority,${urgentTickets.length},${tickets.length > 0 ? Math.round((urgentTickets.length / tickets.length) * 100) : 0}%\n`
                csv += `This Week (New),${thisWeekTickets.length},${tickets.length > 0 ? Math.round((thisWeekTickets.length / tickets.length) * 100) : 0}%\n`
                csv += `Overall Completion Rate,${tickets.length > 0 ? Math.round((completedTickets.length / tickets.length) * 100) : 0}%,\n`
                csv += '\n'
                
                // Completed Tickets Detail Section
                csv += 'COMPLETED TICKETS DETAIL\n'
                csv += 'TICKET ID,TITLE,DEPARTMENT,PRIORITY,STATUS,REPORTED BY,ASSIGNED TO,CREATED DATE,COMPLETED DATE,DAYS TO COMPLETE,ADMIN COMMENTS/NOTES\n'
                
                completedTickets.forEach(t => {
                  const createdDate = new Date(t.createdAt)
                  const completedDate = t.completedAt ? new Date(t.completedAt) : new Date()
                  const daysToComplete = Math.ceil((completedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
                  
                  // Get all internal comments (admin notes) for this ticket
                  const allComments = ticketService.getTicketComments(t.id)
                  const adminNotes = allComments
                    .filter((c: TicketComment) => c.isInternal)
                    .map((c: TicketComment) => `[${new Date(c.createdAt).toLocaleDateString()}] ${c.content}`)
                    .join(' | ')
                  
                  // Combine adminComments field and internal comments
                  const fullAdminNotes = [
                    t.adminComments || '',
                    adminNotes
                  ].filter(note => note.trim()).join(' | ')
                  
                  csv += `${csvEscape(t.id)},${csvEscape(t.title)},${csvEscape(t.department)},${csvEscape(t.priority.toUpperCase())},${csvEscape(t.status.toUpperCase())},${csvEscape(t.reportedBy)},${csvEscape(t.assignedTechnician || 'Unassigned')},${csvEscape(createdDate.toLocaleDateString())},${csvEscape(t.completedAt ? completedDate.toLocaleDateString() : 'N/A')},${csvEscape(daysToComplete)},${csvEscape(fullAdminNotes || 'No notes')}\n`
                })
                
                csv += '\n'
                
                // Footer Section
                csv += 'END OF REPORT\n'
                csv += `Total Records Exported:,${completedTickets.length}\n`
                csv += `Report File:,kpi-report-${new Date().toISOString().split('T')[0]}.csv\n`
                
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `kpi-report-${new Date().toISOString().split('T')[0]}.csv`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-md transition-colors text-sm font-medium flex items-center gap-2"
            >
              📥 Export CSV
            </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{tickets.length}</div>
              <div className="text-sm opacity-90">Total Tickets</div>
            </div>
            <button
              onClick={() => {
                setFilters({ ...filters, status: 'open' })
              }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer text-left"
            >
              <div className="text-3xl font-bold">{tickets.filter(t => t.status === 'open').length}</div>
              <div className="text-sm opacity-90">Open</div>
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, status: 'in-progress' })
              }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer text-left"
            >
              <div className="text-3xl font-bold">{tickets.filter(t => t.status === 'in-progress').length}</div>
              <div className="text-sm opacity-90">In Progress</div>
            </button>
            <button
              onClick={() => {
                // Show completed tickets (both resolved and closed)
                setFilters({ ...filters, status: 'completed' })
              }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer text-left"
            >
              <div className="text-3xl font-bold">{tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}</div>
              <div className="text-sm opacity-90">Completed ✨</div>
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setFilters({ ...filters, priority: 'urgent' })
              }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer text-left"
            >
              <div className="text-2xl font-bold">{tickets.filter(t => t.priority === 'urgent').length}</div>
              <div className="text-sm opacity-90">🔥 Urgent</div>
            </button>
            <button
              onClick={() => setShowWeekSelector(!showWeekSelector)}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer text-left relative"
            >
              <div className="text-2xl font-bold">{getTicketsForWeek(selectedWeek).length}</div>
              <div className="text-sm opacity-90">
                📅 {selectedWeek === 0 ? 'This Week' : `${selectedWeek} Week${selectedWeek > 1 ? 's' : ''} Ago`}
              </div>
              <div className="text-xs opacity-75 mt-1">
                {getWeekRange(selectedWeek).start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {getWeekRange(selectedWeek).end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </button>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">
                {tickets.length > 0 ? Math.round((tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length / tickets.length) * 100) : 0}%
              </div>
              <div className="text-sm opacity-90">✅ Completion Rate</div>
            </div>
          </div>
          
          {/* Week Selector Dropdown */}
          {showWeekSelector && (
            <div className="mt-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 text-gray-900">
              <h4 className="font-semibold mb-3">Select Week Range</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(week => {
                  const { start, end } = getWeekRange(week)
                  const count = getTicketsForWeek(week).length
                  return (
                    <button
                      key={week}
                      onClick={() => {
                        setSelectedWeek(week)
                        setShowWeekSelector(false)
                      }}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedWeek === week
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {week === 0 ? 'This Week' : week === 1 ? 'Last Week' : `${week} Weeks Ago`}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-lg font-bold text-blue-600 mt-2">{count} tickets</div>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setShowWeekSelector(false)}
                className="mt-3 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
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
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-xl">ℹ️</span>
              <div>
                <p className="text-sm font-medium text-blue-900">Closed Tickets Are Kept for KPI Tracking</p>
                <p className="text-xs text-blue-700 mt-1">
                  All closed and resolved tickets remain in the system permanently for historical records and KPI reporting. 
                  They are included in completion rates, weekly summaries, and export reports. 
                  Only use &quot;Clear All Data&quot; if you need to completely reset the system.
                </p>
              </div>
            </div>
          </div>
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
                if (confirm('⚠️ This will permanently delete all tickets and comments, including closed tickets for KPI records. Are you sure?')) {
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