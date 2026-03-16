'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  ShoppingCart
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={20} />,
    roles: ['ADMINISTRATOR', 'BILLER']
  },
  {
    label: 'New Bill',
    href: '/dashboard/billing/new',
    icon: <FileText size={20} />,
    roles: ['ADMINISTRATOR', 'BILLER']
  },
  {
    label: 'Bills List',
    href: '/dashboard/billing',
    icon: <ShoppingCart size={20} />,
    roles: ['ADMINISTRATOR', 'BILLER']
  },
  {
    label: 'Stock Management',
    href: '/dashboard/stock',
    icon: <Package size={20} />,
    roles: ['ADMINISTRATOR', 'STOCK_MANAGER']
  },
  {
    label: 'Products',
    href: '/dashboard/products',
    icon: <Package size={20} />,
    roles: ['ADMINISTRATOR', 'STOCK_MANAGER']
  },
  {
    label: 'Customers',
    href: '/dashboard/customers',
    icon: <Users size={20} />,
    roles: ['ADMINISTRATOR', 'BILLER']
  },
  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: <BarChart3 size={20} />,
    roles: ['ADMINISTRATOR', 'BILLER']
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings size={20} />,
    roles: ['ADMINISTRATOR']
  }
]

export default function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const userRole = session?.user?.role || ''

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  )

  return (
    <div className="h-screen w-64 bg-primary text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold">S.R. Cycle & Auto Spares</h1>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="mb-3 px-4">
          <p className="text-sm font-medium">{session?.user?.name}</p>
          <p className="text-xs text-white/70">{userRole.replace('_', ' ')}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-3 rounded text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
