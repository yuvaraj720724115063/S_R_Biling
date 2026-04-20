'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { TrendingUp, Package, AlertTriangle, FileText, DollarSign, Calendar } from 'lucide-react'

interface DashboardStats {
  todayRevenue: number
  monthlyRevenue: number
  totalProducts: number
  lowStockCount: number
  lowStockItems: LowStockItem[]
  todayBills: number
  monthlyBills: number
}

interface LowStockItem {
  id: string
  productId: string
  productName: string
  hsnCode: string
  unit: string
  currentQuantity: number
  reorderLevel: number
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

      {stats && stats.lowStockCount > 0 && (
        <div className="card p-6 border-l-4 border-warning">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-text flex items-center gap-2">
                <AlertTriangle className="text-warning" size={20} />
                Low Stock Warning
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {stats.lowStockCount} item{stats.lowStockCount > 1 ? 's are' : ' is'} below reorder level.
              </p>
            </div>
            <a
              href="/dashboard/stock"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Manage Stock
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2 pr-3">HSN</th>
                  <th className="py-2 pr-3 text-right">Current</th>
                  <th className="py-2 text-right">Reorder</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockItems.slice(0, 8).map((item) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="py-2 pr-3 font-medium text-text">{item.productName}</td>
                    <td className="py-2 pr-3 text-gray-600">{item.hsnCode}</td>
                    <td className="py-2 pr-3 text-right text-error font-semibold">
                      {item.currentQuantity} {item.unit}
                    </td>
                    <td className="py-2 text-right text-gray-700">
                      {item.reorderLevel} {item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {stats.lowStockItems.length > 8 && (
            <p className="text-xs text-gray-500 mt-3">
              Showing first 8 low-stock items. Open Stock Management for full list.
            </p>
          )}
        </div>
      )}

      {stats && stats.lowStockCount === 0 && (
        <div className="card p-6 border-l-4 border-secondary">
          <h2 className="text-lg font-bold text-text">Stock Status</h2>
          <p className="text-sm text-gray-600 mt-1">All items are above reorder level.</p>
        </div>
      )}
    </div>
  )
}
