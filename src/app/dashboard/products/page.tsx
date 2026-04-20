'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import Sidebar from '@/components/Sidebar'

interface Product {
  id: string
  hsnCode: string
  name: string
  description?: string
  unit: string
  gstRate: number
  stock?: {
    currentQuantity: number
    reorderLevel: number
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [stockSubmitting, setStockSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null)
  const [stockAdjustmentType, setStockAdjustmentType] = useState<'ADD' | 'REMOVE' | 'ADJUST'>('ADD')
  const [stockQuantity, setStockQuantity] = useState('')
  const [stockRate, setStockRate] = useState('')
  const [stockNotes, setStockNotes] = useState('')
  const [formData, setFormData] = useState({
    hsnCode: '',
    name: '',
    description: '',
    unit: 'PCS',
    gstRate: 18
  })

  useEffect(() => {
    fetchProducts()
  }, [search])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const url = search 
        ? `/api/products?search=${encodeURIComponent(search)}`
        : '/api/products'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.hsnCode.trim()) {
      alert('Please enter HSN Code')
      return
    }
    if (!formData.name.trim()) {
      alert('Please enter product name')
      return
    }

    setSubmitting(true)
    try {
      const method = editingProduct ? 'PUT' : 'POST'
      const url = editingProduct ? `/api/products?id=${editingProduct.id}` : '/api/products'
      
      const payload = editingProduct 
        ? {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            unit: formData.unit,
            gstRate: parseFloat(formData.gstRate.toString())
          }
        : {
            hsnCode: formData.hsnCode.trim(),
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            unit: formData.unit,
            gstRate: parseFloat(formData.gstRate.toString())
          }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        if (editingProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p))
          alert('Product updated successfully!')
        } else {
          setProducts([...products, updatedProduct])
          alert('Product added successfully!')
        }
        setShowModal(false)
        setEditingProduct(null)
        resetForm()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to save product'}`)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      hsnCode: product.hsnCode,
      name: product.name,
      description: product.description || '',
      unit: product.unit,
      gstRate: product.gstRate
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
        alert('Product deleted successfully')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to delete product'}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const resetForm = () => {
    setFormData({
      hsnCode: '',
      name: '',
      description: '',
      unit: 'PCS',
      gstRate: 18
    })
  }

  const openNewModal = () => {
    resetForm()
    setEditingProduct(null)
    setShowModal(true)
  }

  const openStockModal = (product: Product) => {
    setSelectedProductForStock(product)
    setStockAdjustmentType('ADD')
    setStockQuantity('')
    setStockRate('')
    setStockNotes('')
    setShowStockModal(true)
  }

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProductForStock) {
      return
    }

    const parsedQuantity = parseFloat(stockQuantity)
    if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
      alert('Please enter a valid quantity')
      return
    }

    setStockSubmitting(true)
    try {
      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductForStock.id,
          quantity: parsedQuantity,
          type: stockAdjustmentType,
          rate: stockRate ? parseFloat(stockRate) : null,
          notes: stockNotes
        })
      })

      if (response.ok) {
        await fetchProducts()
        setShowStockModal(false)
        alert('Stock updated successfully')
      } else {
        const error = await response.json().catch(() => null)
        alert(error?.error || 'Error updating stock')
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Error updating stock')
    } finally {
      setStockSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text">Products</h1>
              <p className="text-gray-600 mt-1">Manage your product catalog</p>
            </div>
            <button onClick={openNewModal} className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Add Product
            </button>
          </div>

          <div className="card p-6 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or HSN code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="px-6 py-4 text-left">HSN Code</th>
                    <th className="px-6 py-4 text-left">Product Name</th>
                    <th className="px-6 py-4 text-left">Description</th>
                    <th className="px-6 py-4 text-left">Unit</th>
                    <th className="px-6 py-4 text-right">GST %</th>
                    <th className="px-6 py-4 text-right">Current Stock</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    const isLowStock = product.stock && product.stock.currentQuantity <= product.stock.reorderLevel
                    return (
                      <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 font-mono text-sm font-semibold">{product.hsnCode}</td>
                        <td className="px-6 py-4 font-medium">{product.name}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{product.description || '-'}</td>
                        <td className="px-6 py-4">{product.unit}</td>
                        <td className="px-6 py-4 text-right">{product.gstRate}%</td>
                        <td className="px-6 py-4 text-right">
                          <span className={isLowStock ? 'text-warning font-semibold' : ''}>
                            {product.stock?.currentQuantity || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-error hover:bg-error/10 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button
                              onClick={() => openStockModal(product)}
                              className="p-2 text-secondary hover:bg-secondary/10 rounded transition-colors"
                              title="Adjust Quantity"
                            >
                              <img
                                src="/adjust-quantity.webp"
                                alt="Adjust Quantity"
                                className="h-[18px] w-[18px] object-contain"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No products found</p>
                  <button onClick={openNewModal} className="mt-4 text-primary hover:underline">
                    Add your first product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  HSN Code <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.hsnCode}
                  onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                  className="input-field font-mono"
                  placeholder="e.g., 85011100"
                  disabled={!!editingProduct}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Industrial Motor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Optional description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Unit <span className="text-error">*</span>
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="input-field"
                  >
                    <option value="PCS">PCS (Pieces)</option>
                    <option value="SET">SET</option>
                    <option value="KG">KG (Kilogram)</option>
                    <option value="LTR">LTR (Liter)</option>
                    <option value="MTR">MTR (Meter)</option>
                    <option value="PAIR">PAIR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    GST Rate (%) <span className="text-error">*</span>
                  </label>
                  <select
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                    className="input-field"
                  >
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="btn-success flex-1" 
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduct(null)
                    resetForm()
                  }}
                  className="btn-secondary flex-1"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showStockModal && selectedProductForStock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Adjust Quantity</h2>
            <p className="text-sm text-gray-600 mb-6">
              {selectedProductForStock.name} (Current: {selectedProductForStock.stock?.currentQuantity || 0})
            </p>

            <form onSubmit={handleStockSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Adjustment Type</label>
                <select
                  value={stockAdjustmentType}
                  onChange={(e) => setStockAdjustmentType(e.target.value as 'ADD' | 'REMOVE' | 'ADJUST')}
                  className="input-field"
                >
                  <option value="ADD">Add Quantity</option>
                  <option value="REMOVE">Remove Quantity</option>
                  <option value="ADJUST">Set Exact Quantity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {stockAdjustmentType === 'ADJUST' ? 'New Quantity' : 'Quantity'}
                </label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="input-field"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rate (Optional)</label>
                <input
                  type="number"
                  value={stockRate}
                  onChange={(e) => setStockRate(e.target.value)}
                  className="input-field"
                  min="0"
                  step="any"
                  inputMode="decimal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  value={stockNotes}
                  onChange={(e) => setStockNotes(e.target.value)}
                  className="input-field"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1" disabled={stockSubmitting}>
                  {stockSubmitting ? 'Updating...' : 'Update Quantity'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowStockModal(false)}
                  className="btn-secondary flex-1"
                  disabled={stockSubmitting}
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
