'use client'
import { useRouter, usePathname } from 'next/navigation'
import { Home, BarChart3, DollarSign, Package, LineChart, FolderOpen, Tags, Bot, CheckSquare, LogOut } from 'lucide-react'

const navItems = [
  { name: 'Home', path: '/dashboard', icon: 'Home' },
  { name: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart3' },
  { name: 'Cashflow', path: '/dashboard/cashflow', icon: 'DollarSign' },
  { name: 'Orders', path: '/dashboard/orders', icon: 'Package' },
  { name: 'Stock', path: '/dashboard/stock', icon: 'LineChart' },
  { name: 'Products', path: '/dashboard/products', icon: 'FolderOpen' },
  { name: 'Categories', path: '/dashboard/categories', icon: 'Tags' },
  { name: 'BI Assistant', path: '/dashboard/assistant', icon: 'Bot' },
  { name: 'Tasks', path: '/dashboard/tasks', icon: 'CheckSquare' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-xl">
              S
            </div>
            <div>
              <div className="font-bold text-lg">Spectre-HQ</div>
              <div className="text-sm text-gray-400">Dashboard</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{item.icon === 'Home' ? '🏠' : item.icon === 'BarChart3' ? '📊' : item.icon === 'DollarSign' ? '💰' : item.icon === 'Package' ? '📦' : item.icon === 'LineChart' ? '📈' : item.icon === 'FolderOpen' ? '📁' : item.icon === 'Tags' ? '🏷️' : item.icon === 'Bot' ? '🤖' : '✅'}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold">
              U
            </div>
            <div>
              <div className="font-semibold text-sm">User</div>
              <div className="text-xs text-gray-400">user@spectre.com</div>
            </div>
          </div>
          <button 
            onClick={() => router.push('/auth')}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span>🚪</span>
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
