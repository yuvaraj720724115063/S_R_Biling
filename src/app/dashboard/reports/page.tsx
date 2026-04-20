'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DashboardStats {
  totalBills: number
  totalRevenue: number
  totalProducts: number
  lowStockItems: number
  billsByType: { type: string; count: number }[]
  monthlyRevenueChart: { month: string; revenue: number }[]
}

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="flex-1 p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading reports...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Business performance and insights</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="card p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Bills</p>
              <p className="text-3xl font-bold text-primary">{stats?.totalBills || 0}</p>
            </div>
            <div className="card p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-primary">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="card p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Products</p>
              <p className="text-3xl font-bold text-primary">{stats?.totalProducts || 0}</p>
            </div>
            <div className="card p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Low Stock Items</p>
              <p className="text-3xl font-bold text-error">{stats?.lowStockItems || 0}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-8">
            {/* Bills by Type */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Bills by Type</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.billsByType || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Revenue */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats?.monthlyRevenueChart || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" name="Revenue (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
      </div>
    </main>
  )
}
