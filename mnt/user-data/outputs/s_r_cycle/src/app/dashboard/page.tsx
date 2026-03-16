'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { TrendingUp, Package, AlertTriangle, FileText, DollarSign, Calendar } from 'lucide-react'

interface DashboardStats {
  todayRevenue: number
  monthlyRevenue: number
  totalProducts: number
  lowStockCount: number
  todayBills: number
  monthlyBills: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const userRole = session?.user?.role || ''

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {session?.user?.name}</p>
      </div>

      {(userRole === 'ADMINISTRATOR' || userRole === 'BILLER') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Today's Revenue</h3>
              <DollarSign className="text-secondary" size={24} />
            </div>
            <p className="text-3xl font-bold text-text">
              ₹{stats?.todayRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 mt-2">{stats?.todayBills} bills today</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Monthly Revenue</h3>
              <Calendar className="text-primary" size={24} />
            </div>
            <p className="text-3xl font-bold text-text">
              ₹{stats?.monthlyRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 mt-2">{stats?.monthlyBills} bills this month</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Low Stock Items</h3>
              <AlertTriangle className="text-warning" size={24} />
            </div>
            <p className="text-3xl font-bold text-text">{stats?.lowStockCount}</p>
            <p className="text-sm text-gray-500 mt-2">Items need restock</p>
          </div>
        </div>
      )}

      {userRole === 'STOCK_MANAGER' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Products</h3>
              <Package className="text-primary" size={24} />
            </div>
            <p className="text-3xl font-bold text-text">{stats?.totalProducts}</p>
            <p className="text-sm text-gray-500 mt-2">In inventory</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Low Stock Items</h3>
              <AlertTriangle className="text-warning" size={24} />
            </div>
            <p className="text-3xl font-bold text-text">{stats?.lowStockCount}</p>
            <p className="text-sm text-gray-500 mt-2">Items need restock</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(userRole === 'ADMINISTRATOR' || userRole === 'BILLER') && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a href="/dashboard/billing/new" className="block p-4 border border-border rounded hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="text-primary" size={20} />
                  <div>
                    <p className="font-medium">Create New Bill</p>
                    <p className="text-sm text-gray-600">Generate GST, Estimate or Shop-to-Shop bill</p>
                  </div>
                </div>
              </a>
              <a href="/dashboard/billing" className="block p-4 border border-border rounded hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-secondary" size={20} />
                  <div>
                    <p className="font-medium">View Bills</p>
                    <p className="text-sm text-gray-600">Access billing history and reports</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}

        {(userRole === 'ADMINISTRATOR' || userRole === 'STOCK_MANAGER') && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Stock Management</h3>
            <div className="space-y-3">
              <a href="/dashboard/stock" className="block p-4 border border-border rounded hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="text-primary" size={20} />
                  <div>
                    <p className="font-medium">Manage Stock</p>
                    <p className="text-sm text-gray-600">Add, update or remove stock</p>
                  </div>
                </div>
              </a>
              <a href="/dashboard/products" className="block p-4 border border-border rounded hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="text-secondary" size={20} />
                  <div>
                    <p className="font-medium">Product Master</p>
                    <p className="text-sm text-gray-600">Manage product catalog</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
