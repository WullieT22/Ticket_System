// Mock authentication system
export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'operator' | 'administrator'
  department: string
  avatar?: string
}

// Department-based user accounts
const mockUsers: AuthUser[] = [
  {
    id: 'admin-1',
    email: 'admin@company.com',
    name: 'System Administrator',
    role: 'administrator',
    department: 'IT Administration',
    avatar: '👨‍💼'
  },
  {
    id: 'preproom-westfield',
    email: 'preproom.westfield@company.com',
    name: 'Preproom Westfield',
    role: 'operator',
    department: 'Preproom Westfield',
    avatar: '🧫'
  },
  {
    id: 'preproom-burnhouse',
    email: 'preproom.burnhouse@company.com',
    name: 'Preproom Burnhouse',
    role: 'operator',
    department: 'Preproom Burnhouse',
    avatar: '🧫'
  },
  {
    id: 'dcm',
    email: 'dcm@company.com',
    name: 'DCM',
    role: 'operator',
    department: 'DCM',
    avatar: '🧫'
  },
  {
    id: 'qa-qc',
    email: 'qa.qc@company.com',
    name: 'QA-QC',
    role: 'operator',
    department: 'QA-QC',
    avatar: '🧫'
  },
  {
    id: 'hiw-burnhouse',
    email: 'hiw.burnhouse@company.com',
    name: 'HIW-Burnhouse',
    role: 'operator',
    department: 'HIW-Burnhouse',
    avatar: '🧫'
  },
  {
    id: 'hiw-westfield',
    email: 'hiw.westfield@company.com',
    name: 'HIW-Westfield',
    role: 'operator',
    department: 'HIW-Westfield',
    avatar: '🧫'
  },
  {
    id: 'office-burnhouse',
    email: 'office.burnhouse@company.com',
    name: 'Office-Burnhouse',
    role: 'operator',
    department: 'Office-Burnhouse',
    avatar: '🧫'
  },
  {
    id: 'office-westfield',
    email: 'office.westfield@company.com',
    name: 'Office-Westfield',
    role: 'operator',
    department: 'Office-Westfield',
    avatar: '🧫'
  },
  {
    id: 'bm-burnhouse',
    email: 'bm.burnhouse@company.com',
    name: 'BM-Burnhouse',
    role: 'operator',
    department: 'BM-Burnhouse',
    avatar: '🧫'
  },
  {
    id: 'bm-westfield',
    email: 'bm.westfield@company.com',
    name: 'BM-Westfield',
    role: 'operator',
    department: 'BM-Westfield',
    avatar: '🧫'
  },
  {
    id: 'cleanroom-burnhouse',
    email: 'cleanroom.burnhouse@company.com',
    name: 'Cleanroom-Burnhouse',
    role: 'operator',
    department: 'Cleanroom-Burnhouse',
    avatar: '🧫'
  },
  {
    id: 'cleanroom-westfield',
    email: 'cleanroom.westfield@company.com',
    name: 'Cleanroom-Westfield',
    role: 'operator',
    department: 'Cleanroom-Westfield',
    avatar: '🧫'
  },
  {
    id: 'rd',
    email: 'rd@company.com',
    name: 'R&D',
    role: 'operator',
    department: 'R&D',
    avatar: '🧫'
  },
  {
    id: 'technical',
    email: 'technical@company.com',
    name: 'Technical',
    role: 'operator',
    department: 'Technical',
    avatar: '🧫'
  }
]

// Department credentials
const departmentCredentials: Record<string, string> = {
  'IT Administration': 'ADMIN2024',
  'Preproom Westfield': 'PRW1234',
  'Preproom Burnhouse': 'PRB1234',
  'DCM': 'DCM1234',
  'QA-QC': 'QAQC1234',
  'HIW-Burnhouse': 'HIWB1234',
  'HIW-Westfield': 'HIWW1234',
  'Office-Burnhouse': 'OFFB1234',
  'Office-Westfield': 'OFFW1234',
  'BM-Burnhouse': 'BMB1234',
  'BM-Westfield': 'BMW1234',
  'Cleanroom-Burnhouse': 'CRB1234',
  'Cleanroom-Westfield': 'CRW1234',
  'R&D': 'RD1234',
  'Technical': 'TECH1234'
}

class AuthService {
  private currentUser: AuthUser | null = null

  async loginWithDepartment(department: string, password: string): Promise<AuthUser | null> {
    // Check if department exists and password matches
    if (departmentCredentials[department] === password) {
      const user = mockUsers.find(u => u.department === department)
      if (user) {
        this.currentUser = user
        localStorage.setItem('auth-user', JSON.stringify(user))
        return user
      }
    }
    return null
  }

  async logout(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem('auth-user')
  }

  getCurrentUser(): AuthUser | null {
    if (this.currentUser) return this.currentUser
    
    // Try to restore from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth-user')
      if (stored) {
        this.currentUser = JSON.parse(stored)
        return this.currentUser
      }
    }
    return null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === 'administrator'
  }

  getAllOperators(): AuthUser[] {
    return mockUsers.filter(u => u.role === 'operator')
  }

  getAllDepartments(): { name: string; role: string; avatar: string }[] {
    return mockUsers.map(user => ({
      name: user.department,
      role: user.role === 'administrator' ? 'Administrator' : 'Department',
      avatar: user.avatar || '👥'
    }))
  }
}

export const authService = new AuthService()