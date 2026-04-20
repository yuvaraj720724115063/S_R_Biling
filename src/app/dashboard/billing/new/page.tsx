'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Sidebar from '@/components/Sidebar'

interface Customer {
  id: string
  name: string
  phone?: string
  gstin?: string
}

interface Product {
  id: string
  name: string
  hsnCode: string
  gstRate: number
  unit: string
  stock?: {
    currentQuantity: number
    lastPurchaseRate: number | null
  }
}

interface BillItem {
  productId: string
  quantity: string
  rate: string
  taxRate: string
}

export default function NewBillPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [billItems, setBillItems] = useState<BillItem[]>([])
  const [billType, setBillType] = useState('GST_BILL')
  const [customerId, setCustomerId] = useState('')
  const [loading, setLoading] = useState(false)
  const [showNewCustomer, setShowNewCustomer] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [newCustomerAddress, setNewCustomerAddress] = useState('')
  const [newCustomerGSTIN, setNewCustomerGSTIN] = useState('')
  const [creatingCustomer, setCreatingCustomer] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')

  const parseDecimal = (value: string) => {
    const parsed = parseFloat(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }

  useEffect(() => {
    fetchCustomers()
    fetchProducts()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const handleCreateCustomer = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault()
    if (!newCustomerName.trim()) {
      alert('Please enter customer name')
      return
    }

    setCreatingCustomer(true)
    try {
      console.log('Creating customer:', {
        name: newCustomerName,
        phone: newCustomerPhone,
        address: newCustomerAddress,
        gstin: newCustomerGSTIN
      })

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCustomerName.trim(),
          phone: newCustomerPhone.trim() || undefined,
          address: newCustomerAddress.trim() || undefined,
          gstin: newCustomerGSTIN.trim() || undefined
        })
      })

      console.log('API Response status:', response.status)
      const responseData = await response.json()
      console.log('API Response:', responseData)

      if (response.ok) {
        const newCustomer = responseData
        setCustomers([...customers, newCustomer])
        setCustomerId(newCustomer.id)
        setShowNewCustomer(false)
        setNewCustomerName('')
        setNewCustomerPhone('')
        setNewCustomerAddress('')
        setNewCustomerGSTIN('')
        alert('Customer created successfully!')
      } else {
        alert(`Error: ${responseData.error || 'Failed to create customer'}`)
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to create customer'}`)
    } finally {
      setCreatingCustomer(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const calculateTotals = () => {
    let subtotal = 0
    let taxAmount = 0

    billItems.forEach((item) => {
      const quantity = parseDecimal(item.quantity)
      const rate = parseDecimal(item.rate)
      const taxRate = parseDecimal(item.taxRate)
      const lineAmount = quantity * rate
      const lineTax = (lineAmount * taxRate) / 100
      subtotal += lineAmount
      taxAmount += lineTax
    })

    return { subtotal, taxAmount, grandTotal: subtotal + taxAmount }
  }

  const addSelectedProduct = () => {
    if (!selectedProductId) return
    const product = products.find((p) => p.id === selectedProductId)
    if (!product) return

    const rate = product.stock?.lastPurchaseRate || 0
    setBillItems([
      ...billItems,
      {
        productId: product.id,
        quantity: '1',
        rate: rate.toString(),
        taxRate: product.gstRate.toString()
      }
    ])
    setSelectedProductId('')
    setProductSearch('')
  }

  const filteredProducts = productSearch.trim()
    ? products.filter((product) =>
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.hsnCode.toLowerCase().includes(productSearch.toLowerCase())
      )
    : products

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId || billItems.length === 0) {
      alert('Please select a customer and add items')
      return
    }

    setLoading(true)
    try {
      const { subtotal, taxAmount, grandTotal } = calculateTotals()
      const normalizedItems = billItems.map((item) => ({
        ...item,
        quantity: parseDecimal(item.quantity),
        rate: parseDecimal(item.rate),
        taxRate: parseDecimal(item.taxRate)
      }))
      
      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billType,
          customerId,
          billItems: normalizedItems,
          subtotal,
          taxAmount,
          grandTotal
        })
      })

      if (response.ok) {
        const result = await response.json()
        const createdBill = result?.bill || result
        const lowStockItems = result?.lowStockItems || []

        if (lowStockItems.length > 0) {
          const names = lowStockItems.map((item: any) => item.productName).join(', ')
          alert(`Low stock alert: ${names}`)
        }

        if (createdBill?.id) {
          router.push(`/dashboard/billing/${createdBill.id}?print=1`)
        } else {
          router.push('/dashboard/billing')
        }
      } else {
        const errorData = await response.json().catch(() => null)
        alert(errorData?.error || 'Error creating bill')
      }
    } catch (error) {
      console.error('Error creating bill:', error)
      alert('Error creating bill')
    } finally {
      setLoading(false)
    }
  }

  const { subtotal, taxAmount, grandTotal } = calculateTotals()

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-8">Create New Bill</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Bill Type and Customer */}
            <div className="card p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Bill Type</label>
                  <select
                    value={billType}
                    onChange={(e) => setBillType(e.target.value)}
                    className="input-field"
                  >
                    <option value="GST_BILL">GST Bill</option>
                    <option value="ESTIMATE_BILL">Estimate</option>
                    <option value="SHOP_TO_SHOP_BILL">Shop to Shop Bill</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Customer</label>
                  <div className="flex gap-2">
                    <select
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="input-field flex-1"
                      required
                    >
                      <option value="">Select Customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCustomer(!showNewCustomer)}
                      className="btn-secondary whitespace-nowrap"
                    >
                      {showNewCustomer ? 'Cancel' : '+ New'}
                    </button>
                  </div>
                </div>
              </div>

              {/* New Customer Form */}
              {showNewCustomer && (
                <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
                  <h3 className="font-semibold mb-4">Add New Customer</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name *</label>
                      <input
                        type="text"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        className="input-field"
                        placeholder="Customer name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input
                          type="tel"
                          value={newCustomerPhone}
                          onChange={(e) => setNewCustomerPhone(e.target.value)}
                          className="input-field"
                          placeholder="9876543210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">GSTIN</label>
                        <input
                          type="text"
                          value={newCustomerGSTIN}
                          onChange={(e) => setNewCustomerGSTIN(e.target.value)}
                          className="input-field"
                          placeholder="33AAAAA0000A1Z5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <textarea
                        value={newCustomerAddress}
                        onChange={(e) => setNewCustomerAddress(e.target.value)}
                        className="input-field"
                        placeholder="Customer address"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateCustomer}
                        disabled={creatingCustomer || !newCustomerName.trim()}
                        className="btn-primary flex-1 text-sm"
                      >
                        {creatingCustomer ? 'Saving...' : 'Save & Select'}
                      </button>
                      <button
                        onClick={() => {
                          setShowNewCustomer(false)
                          setNewCustomerName('')
                          setNewCustomerPhone('')
                          setNewCustomerAddress('')
                          setNewCustomerGSTIN('')
                        }}
                        disabled={creatingCustomer}
                        className="btn-secondary flex-1 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bill Items */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Bill Items</h2>
              {billItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items added yet. Add a product below.</p>
              ) : (
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="table-header">
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-center">Qty</th>
                        <th className="px-4 py-2 text-center">Rate (₹)</th>
                        <th className="px-4 py-2 text-center">Tax %</th>
                        <th className="px-4 py-2 text-right">Subtotal</th>
                        <th className="px-4 py-2 text-right">Tax</th>
                        <th className="px-4 py-2 text-right">Total</th>
                        <th className="px-4 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billItems.map((item, index) => {
                        const product = products.find((p) => p.id === item.productId)
                        const quantity = parseDecimal(item.quantity)
                        const rate = parseDecimal(item.rate)
                        const taxRate = parseDecimal(item.taxRate)
                        const subtotal = quantity * rate
                        const tax = (subtotal * taxRate) / 100
                        const total = subtotal + tax
                        return (
                          <tr key={index} className="table-row">
                            <td className="px-4 py-2">{product?.name || 'Unknown'}</td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const items = [...billItems]
                                  items[index].quantity = e.target.value
                                  setBillItems(items)
                                }}
                                className="input-field w-16 text-center"
                                min="0"
                                step="any"
                                inputMode="decimal"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) => {
                                  const items = [...billItems]
                                  items[index].rate = e.target.value
                                  setBillItems(items)
                                }}
                                className="input-field w-20 text-center"
                                min="0"
                                step="any"
                                inputMode="decimal"
                                placeholder="0"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="number"
                                value={item.taxRate}
                                onChange={(e) => {
                                  const items = [...billItems]
                                  items[index].taxRate = e.target.value
                                  setBillItems(items)
                                }}
                                className="input-field w-16 text-center"
                                min="0"
                                max="100"
                                step="any"
                                inputMode="decimal"
                              />
                            </td>
                            <td className="px-4 py-2 text-right font-semibold">₹{subtotal.toFixed(2)}</td>
                            <td className="px-4 py-2 text-right">₹{tax.toFixed(2)}</td>
                            <td className="px-4 py-2 text-right font-bold text-primary text-base">₹{total.toFixed(2)}</td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => setBillItems(billItems.filter((_, i) => i !== index))}
                                className="text-error hover:underline text-sm font-semibold"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add Item */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Add Product</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value)
                        setSelectedProductId('')
                      }}
                      placeholder="Search by product name or HSN code..."
                      className="input-field w-full mb-2"
                    />
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSelectedProduct()
                        }
                      }}
                      className="input-field w-full"
                    >
                      <option value="">Select a product</option>
                      {filteredProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} (HSN: {product.hsnCode})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={addSelectedProduct}
                    disabled={!selectedProductId}
                    className="btn-secondary whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="card p-6 bg-gray-50">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax Amount:</span>
                  <span className="font-semibold">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-semibold">Grand Total:</span>
                  <span className="font-bold text-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Creating...' : 'Create Bill'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
