'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'

interface Stock {
  id: string
  productId: string
  currentQuantity: number
  reorderLevel: number
  lastPurchaseRate: number | null
  product: {
    id: string
    name: string
    hsnCode: string
    unit: string
  }
}

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [adjustmentType, setAdjustmentType] = useState<'ADD' | 'REMOVE' | 'ADJUST'>('ADD')
  const [quantity, setQuantity] = useState('')
  const [rate, setRate] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchStocks()
  }, [])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stock')
      const data = await response.json()
      setStocks(data)
    } catch (error) {
      console.error('Error fetching stocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdjustClick = (stock: Stock) => {
    setSelectedStock(stock)
    setShowModal(true)
    setQuantity('')
    setRate(stock.lastPurchaseRate?.toString() || '')
    setNotes('')
    setAdjustmentType('ADD')
  }

  const handleSubmitAdjustment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStock || !quantity) {
      alert('Please enter quantity')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedStock.productId,
          quantity: parseFloat(quantity),
          type: adjustmentType,
          rate: rate ? parseFloat(rate) : null,
          notes
        })
      })

      if (response.ok) {
        await fetchStocks()
        setShowModal(false)
        alert('Stock adjusted successfully!')
      } else {
        alert('Error adjusting stock')
      }
    } catch (error) {
      console.error('Error adjusting stock:', error)
      alert('Error adjusting stock')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Stock Management</h1>
            <p className="text-gray-600">Manage product inventory and stock levels</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading stock data...</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="px-6 py-3 text-left text-sm font-semibold">HSN Code</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Product Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Unit</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Current Qty</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Reorder Level</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Last Purchase Rate</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => (
                    <tr key={stock.id} className="table-row">
                      <td className="px-6 py-4 text-sm">{stock.product.hsnCode}</td>
                      <td className="px-6 py-4 text-sm font-medium">{stock.product.name}</td>
                      <td className="px-6 py-4 text-sm">{stock.product.unit}</td>
                      <td className="px-6 py-4 text-sm text-right font-semibold">
                        {stock.currentQuantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">{stock.reorderLevel}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        ₹{stock.lastPurchaseRate?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {stock.currentQuantity <= stock.reorderLevel ? (
                          <span className="inline-block bg-error/10 text-error px-3 py-1 rounded text-xs font-semibold">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded text-xs font-semibold">
                            Adequate
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleAdjustClick(stock)}
                          className="text-primary hover:underline text-sm font-semibold"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Adjustment Modal */}
      {showModal && selectedStock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Adjust Stock: {selectedStock.product.name}</h2>

            <form onSubmit={handleSubmitAdjustment} className="space-y-4">
              {/* Adjustment Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Adjustment Type</label>
                <select
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value as 'ADD' | 'REMOVE' | 'ADJUST')}
                  className="input-field"
                >
                  <option value="ADD">Add Stock</option>
                  <option value="REMOVE">Remove Stock</option>
                  <option value="ADJUST">Set Exact Quantity</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {adjustmentType === 'ADJUST' ? 'New Quantity' : 'Quantity'}
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="input-field"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Purchase Rate */}
              <div>
                <label className="block text-sm font-medium mb-2">Purchase Rate (₹)</label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="input-field"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field"
                  placeholder="Optional notes"
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1"
                >
                  {submitting ? 'Saving...' : 'Update Stock'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
