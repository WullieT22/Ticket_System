'use client'

import { useState, useEffect } from 'react'
import { authService, AuthUser } from '@/lib/auth'
import { ticketService } from '@/lib/tickets'

interface LoginFormProps {
  onLoginSuccess: (user: AuthUser) => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [notificationCount, setNotificationCount] = useState(0)

  const departments = authService.getAllDepartments()

  // Check for notifications every 30 seconds
  useEffect(() => {
    const checkNotifications = () => {
      const details = ticketService.getNotificationDetails()
      setNotificationCount(details.count)
      
      // Log for debugging
      if (details.count > 0) {
        console.log(`🏠 Login Page Notifications: ${details.count} ticket(s) need attention`)
      }
    }

    // Check immediately and then every 30 seconds
    checkNotifications()
    const interval = setInterval(checkNotifications, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const user = await authService.loginWithDepartment(selectedDepartment, password)
      if (user) {
        onLoginSuccess(user)
      } else {
        setError('Invalid department or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDepartmentSelect = (departmentName: string) => {
    setSelectedDepartment(departmentName)
    setPassword('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          IT Ticket System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select your department to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!selectedDepartment ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                Choose Your Department
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {departments.map((dept, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDepartmentSelect(dept.name)}
                    className="relative text-left px-4 py-4 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] flex flex-col justify-center items-center"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-2xl">{dept.avatar}</span>
                      <div className="text-center">
                        <div className="font-medium text-gray-900 text-sm leading-tight">{dept.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{dept.role}</div>
                      </div>
                    </div>
                    
                    {/* Notification badge for IT Administration */}
                    {dept.name === 'IT Administration' && notificationCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center pb-4 border-b border-gray-200">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-2xl">
                    {departments.find(d => d.name === selectedDepartment)?.avatar}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedDepartment}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {departments.find(d => d.name === selectedDepartment)?.role}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDepartment('')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Change Department
                </button>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Department Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter department password"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          )}

          {/* Demo Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-3">Demo Passwords:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400">
                <div>IT Administration: ADMIN2024</div>
                <div>Preproom Westfield: PRW1234</div>
                <div>Preproom Burnhouse: PRB1234</div>
                <div>DCM: DCM1234</div>
                <div>QA-QC: QAQC1234</div>
                <div>HIW-Burnhouse: HIWB1234</div>
                <div>HIW-Westfield: HIWW1234</div>
                <div>Office-Burnhouse: OFFB1234</div>
                <div>Office-Westfield: OFFW1234</div>
                <div>BM-Burnhouse: BMB1234</div>
                <div>BM-Westfield: BMW1234</div>
                <div>Cleanroom-Burnhouse: CRB1234</div>
                <div>Cleanroom-Westfield: CRW1234</div>
                <div>R&D: RD1234</div>
                <div>Technical: TECH1234</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}