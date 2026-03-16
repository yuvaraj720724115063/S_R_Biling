'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, Trash2 } from 'lucide-react'
import Sidebar from '@/components/Sidebar'

interface Bill {
  id: string
  billNumber: string
  billType: string
  customerId: string
  date: string
  grandTotal: number
  customer: {
    name: string
  }
  user: {
    name: string
  }
}

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/billing')
      if (response.ok) {
        const data = await response.json()
        setBills(data)
      }
    } catch (error) {
      console.error('Error fetching bills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, billNumber: string) => {
    if (!confirm(`Are you sure you want to delete bill ${billNumber}? Stock quantities will be restored.`)) {
      return
    }

    try {
      const response = await fetch(`/api/billing?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setBills(bills.filter(b => b.id !== id))
        alert('Bill deleted successfully')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting bill:', error)
      alert('Error deleting bill')
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Billing</h1>
              <p className="text-gray-600">Manage bills and invoices</p>
            </div>
            <Link href="/dashboard/billing/new" className="btn-primary">
              New Bill
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading billing data...</p>
            </div>
          ) : bills.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-500 mb-4">No bills found</p>
              <Link href="/dashboard/billing/new" className="btn-primary inline-block">
                Create First Bill
              </Link>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Bill Number</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Created By</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill.id} className="table-row">
                      <td className="px-6 py-4 text-sm font-semibold text-primary">
                        {bill.billNumber}
                      </td>
                      <td className="px-6 py-4 text-sm">{bill.customer.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded text-xs font-semibold">
                          {bill.billType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(bill.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-semibold">
                        ₹{bill.grandTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">{bill.user.name}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/dashboard/billing/${bill.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded text-sm font-semibold transition-colors"
                          >
                            <Eye size={16} />
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(bill.id, bill.billNumber)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-error/10 text-error hover:bg-error/20 rounded text-sm font-semibold transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
