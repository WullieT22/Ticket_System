// KPI Dashboard for Administrators
'use client'

import { useEffect, useState } from 'react'
import { ticketManager } from '@/lib/tickets'
import type { Ticket } from '@/types'

interface KPIMetrics {
  totalTickets: number
  openTickets: number
  inProgressTickets: number
  resolvedTickets: number
  closedTickets: number
  averageResolutionTime: number
  urgentTickets: number
  ticketsByDepartment: Record<string, number>
  ticketsByTechnician: Record<string, number>
  ticketsThisWeek: number
  ticketsThisMonth: number
}

export default function KPIDashboard() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])

  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = () => {
    const allTickets = ticketManager.getAllTickets()
    setTickets(allTickets)

    // Calculate metrics
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const totalTickets = allTickets.length
    const openTickets = allTickets.filter(t => t.status === 'open').length
    const inProgressTickets = allTickets.filter(t => t.status === 'in-progress').length
    const resolvedTickets = allTickets.filter(t => t.status === 'resolved').length
    const closedTickets = allTickets.filter(t => t.status === 'closed').length
    const urgentTickets = allTickets.filter(t => t.priority === 'urgent').length

    // Calculate average resolution time
    const resolvedWithTime = allTickets.filter(t => t.resolvedAt && t.createdAt)
    const avgResolutionTime = resolvedWithTime.length > 0
      ? resolvedWithTime.reduce((sum, t) => {
          const resolutionTime = t.resolvedAt!.getTime() - t.createdAt.getTime()
          return sum + resolutionTime
        }, 0) / resolvedWithTime.length / (1000 * 60 * 60) // Convert to hours
      : 0

    // Tickets by department
    const ticketsByDepartment: Record<string, number> = {}
    allTickets.forEach(t => {
      ticketsByDepartment[t.department] = (ticketsByDepartment[t.department] || 0) + 1
    })

    // Tickets by technician
    const ticketsByTechnician: Record<string, number> = {}
    allTickets.forEach(t => {
      if (t.assignedTechnician) {
        ticketsByTechnician[t.assignedTechnician] = (ticketsByTechnician[t.assignedTechnician] || 0) + 1
      }
    })

    // Tickets this week/month
    const ticketsThisWeek = allTickets.filter(t => t.createdAt >= oneWeekAgo).length
    const ticketsThisMonth = allTickets.filter(t => t.createdAt >= oneMonthAgo).length

    setMetrics({
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      averageResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      urgentTickets,
      ticketsByDepartment,
      ticketsByTechnician,
      ticketsThisWeek,
      ticketsThisMonth,
    })
  }

  if (!metrics) {
    return <div className="p-6">Loading metrics...</div>
  }

  const getStatusPercentage = (count: number) => {
    return metrics.totalTickets > 0 ? Math.round((count / metrics.totalTickets) * 100) : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 KPI Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time metrics and performance indicators</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value={metrics.totalTickets}
          icon="🎫"
          color="bg-blue-500"
        />
        <StatCard
          title="Open Tickets"
          value={metrics.openTickets}
          icon="📋"
          color="bg-yellow-500"
        />
        <StatCard
          title="In Progress"
          value={metrics.inProgressTickets}
          icon="⚙️"
          color="bg-orange-500"
        />
        <StatCard
          title="Resolved"
          value={metrics.resolvedTickets}
          icon="✅"
          color="bg-green-500"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⏱️ Avg Resolution Time</h3>
          <div className="text-4xl font-bold text-blue-600">
            {metrics.averageResolutionTime}h
          </div>
          <p className="text-sm text-gray-500 mt-2">Average time to resolve tickets</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Urgent Tickets</h3>
          <div className="text-4xl font-bold text-red-600">
            {metrics.urgentTickets}
          </div>
          <p className="text-sm text-gray-500 mt-2">Require immediate attention</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 This Week</h3>
          <div className="text-4xl font-bold text-purple-600">
            {metrics.ticketsThisWeek}
          </div>
          <p className="text-sm text-gray-500 mt-2">Tickets created in last 7 days</p>
        </div>
      </div>

      {/* Status Breakdown Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">📊 Ticket Status Distribution</h3>
        <div className="space-y-4">
          <ProgressBar
            label="Open"
            count={metrics.openTickets}
            percentage={getStatusPercentage(metrics.openTickets)}
            color="bg-yellow-500"
          />
          <ProgressBar
            label="In Progress"
            count={metrics.inProgressTickets}
            percentage={getStatusPercentage(metrics.inProgressTickets)}
            color="bg-orange-500"
          />
          <ProgressBar
            label="Resolved"
            count={metrics.resolvedTickets}
            percentage={getStatusPercentage(metrics.resolvedTickets)}
            color="bg-green-500"
          />
          <ProgressBar
            label="Closed"
            count={metrics.closedTickets}
            percentage={getStatusPercentage(metrics.closedTickets)}
            color="bg-gray-500"
          />
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">🏢 Tickets by Department</h3>
        <div className="space-y-3">
          {Object.entries(metrics.ticketsByDepartment)
            .sort((a, b) => b[1] - a[1])
            .map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{dept}</span>
                <div className="flex items-center gap-3">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / metrics.totalTickets) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Technician Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">👥 Technician Workload</h3>
        <div className="space-y-3">
          {Object.entries(metrics.ticketsByTechnician)
            .sort((a, b) => b[1] - a[1])
            .map(([tech, count]) => (
              <div key={tech} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{tech}</span>
                <div className="flex items-center gap-3">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(count / metrics.totalTickets) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          {Object.keys(metrics.ticketsByTechnician).length === 0 && (
            <p className="text-sm text-gray-500 italic">No tickets assigned yet</p>
          )}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">📅 Monthly Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold">{metrics.ticketsThisMonth}</div>
            <div className="text-sm opacity-90">Tickets This Month</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{metrics.ticketsThisWeek}</div>
            <div className="text-sm opacity-90">Tickets This Week</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {metrics.resolvedTickets + metrics.closedTickets}
            </div>
            <div className="text-sm opacity-90">Completed Tickets</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {metrics.totalTickets > 0
                ? Math.round(
                    ((metrics.resolvedTickets + metrics.closedTickets) / metrics.totalTickets) * 100
                  )
                : 0}
              %
            </div>
            <div className="text-sm opacity-90">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${color} text-white text-3xl rounded-full w-16 h-16 flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// Progress Bar Component
function ProgressBar({ label, count, percentage, color }: { label: string; count: number; percentage: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{count} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
