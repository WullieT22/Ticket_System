'use client'

import { useState } from 'react'
import { authService } from '@/lib/auth'
import { ticketService, AVAILABLE_TECHNICIANS } from '@/lib/tickets'
import { Ticket } from '@/types'

interface CreateTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onTicketCreated: () => void
}

export default function CreateTicketModal({ isOpen, onClose, onTicketCreated }: CreateTicketModalProps) {
  const user = authService.getCurrentUser()
  const isAdmin = user?.role === 'administrator'
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: '',
    contactName: '',
    reportedBy: user?.email || '',
    assignedTo: isAdmin ? '' : user?.email || '',
    assignedTechnician: '',
    dueDate: '',
    adminComments: '',
  })

  const departments = authService.getAllOperators()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const ticketData = {
      ...formData,
      status: 'open' as const,
      department: user?.department || 'Unknown Department',
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      reportedBy: formData.reportedBy || user?.email || 'unknown@company.com',
      assignedTechnician: formData.assignedTechnician || undefined,
    }

    ticketService.createTicket(ticketData)
    onTicketCreated()
    onClose()
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      contactName: '',
      reportedBy: user?.email || '',
      assignedTo: isAdmin ? '' : user?.email || '',
      assignedTechnician: '',
      dueDate: '',
      adminComments: '',
    })
  }

  const getDepartmentCategories = () => {
    const departmentName = user?.department
    
    // Categories specific to each department
    const categoryMap: Record<string, string[]> = {
      'Preproom Westfield': [
        'Medical Equipment',
        'Imaging Systems',
        'Patient Monitoring',
        'Sterilization Equipment',
        'Computer/Software',
        'Network Connectivity',
        'Other'
      ],
      'Preproom Burnhouse': [
        'Medical Equipment',
        'Imaging Systems',
        'Patient Monitoring',
        'Sterilization Equipment',
        'Computer/Software',
        'Network Connectivity',
        'Other'
      ],
      'DCM': [
        'Equipment Maintenance',
        'Calibration',
        'Repair Request',
        'Preventive Maintenance',
        'Safety Inspection',
        'Documentation',
        'Other'
      ],
      'QA-QC': [
        'Quality Control',
        'Testing Procedures',
        'Documentation Review',
        'Compliance Issues',
        'Audit Support',
        'Training',
        'Other'
      ],
      'HIW-Burnhouse': [
        'Equipment Service',
        'Installation',
        'Repair',
        'Maintenance',
        'Technical Support',
        'Training',
        'Other'
      ],
      'HIW-Westfield': [
        'Equipment Service',
        'Installation',
        'Repair',
        'Maintenance',
        'Technical Support',
        'Training',
        'Other'
      ],
      'Office-Burnhouse': [
        'Administrative Support',
        'Office Equipment',
        'Communication Systems',
        'Documentation',
        'Scheduling',
        'Supplies',
        'Other'
      ],
      'Office-Westfield': [
        'Administrative Support',
        'Office Equipment',
        'Communication Systems',
        'Documentation',
        'Scheduling',
        'Supplies',
        'Other'
      ],
      'BM-Burnhouse': [
        'Biomedical Equipment',
        'Safety Protocols',
        'Equipment Testing',
        'Compliance',
        'Training',
        'Documentation',
        'Other'
      ],
      'BM-Westfield': [
        'Biomedical Equipment',
        'Safety Protocols',
        'Equipment Testing',
        'Compliance',
        'Training',
        'Documentation',
        'Other'
      ],
      'Cleanroom-Burnhouse': [
        'Environmental Controls',
        'Contamination Issues',
        'Equipment Cleaning',
        'Air Quality',
        'Safety Procedures',
        'Documentation',
        'Other'
      ],
      'Cleanroom-Westfield': [
        'Environmental Controls',
        'Contamination Issues',
        'Equipment Cleaning',
        'Air Quality',
        'Safety Procedures',
        'Documentation',
        'Other'
      ]
    }
    
    return categoryMap[departmentName || ''] || [
      'General Support',
      'Equipment Issues',
      'Technical Support',
      'Administrative',
      'Safety',
      'Other'
    ]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isAdmin ? 'Create New Ticket' : 'Request Support'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isAdmin ? 'Title *' : 'What do you need help with? *'}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={isAdmin ? "Brief description of the issue" : "Brief description of your issue"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isAdmin ? 'Description *' : 'Please describe the problem in detail *'}
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={isAdmin ? "Detailed description of the issue and steps to reproduce" : "What happened? When did it start? What were you trying to do?"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Who should we contact about this issue?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAdmin ? 'Priority *' : 'How urgent is this? *'}
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low - Can wait a few days</option>
                  <option value="medium">Medium - Should be fixed soon</option>
                  <option value="high">High - Affecting my work</option>
                  <option value="urgent">Urgent - Critical issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {getDepartmentCategories().map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {isAdmin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reported By *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.reportedBy}
                    onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="user@company.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign To
                    </label>
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Unassigned</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.email}>
                          {department.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign Technician
                    </label>
                    <select
                      value={formData.assignedTechnician}
                      onChange={(e) => setFormData({ ...formData, assignedTechnician: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">No technician assigned</option>
                      {AVAILABLE_TECHNICIANS.map((tech) => (
                        <option key={tech} value={tech}>
                          {tech}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Admin Comments Field - Only visible to administrators */}
                {isAdmin && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={formData.adminComments}
                      onChange={(e) => setFormData({ ...formData, adminComments: e.target.value })}
                      placeholder="Optional: Enter notes about actions taken or planned for this ticket..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      These notes will be visible to all users but only editable by administrators.
                    </p>
                  </div>
                )}
              </>
            )}

            {!isAdmin && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">ℹ️</span>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Your request will be:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Submitted to your department: <strong>{user?.department}</strong></li>
                      <li>• Reviewed and assigned by an administrator</li>
                      <li>• You&apos;ll be notified of any updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  isAdmin 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isAdmin ? 'Create Ticket' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}