'use client'

import { useEffect, useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import Sidebar from '@/components/Sidebar'

interface Customer {
  id: string
  name: string
  phone?: string
  address?: string
  gstin?: string
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    gstin: ''
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async (searchQuery = '') => {
    try {
      setLoading(true)
      const url = new URL('/api/customers', window.location.origin)
      if (searchQuery) url.searchParams.append('search', searchQuery)
      const response = await fetch(url.toString())
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearch(query)
    fetchCustomers(query)
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      phone: customer.phone || '',
      address: customer.address || '',
      gstin: customer.gstin || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    try {
      const response = await fetch(`/api/customers?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCustomers(customers.filter(c => c.id !== id))
        alert('Customer deleted successfully')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to delete customer'}`)
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Error deleting customer')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter customer name')
      return
    }

    setSubmitting(true)
    try {
      const method = editingCustomer ? 'PUT' : 'POST'
      const url = editingCustomer ? `/api/customers?id=${editingCustomer.id}` : '/api/customers'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim() || undefined,
          address: formData.address.trim() || undefined,
          gstin: formData.gstin.trim() || undefined
        })
      })

      if (response.ok) {
        const updatedCustomer = await response.json()
        if (editingCustomer) {
          setCustomers(customers.map(c => c.id === editingCustomer.id ? updatedCustomer : c))
          alert('Customer updated successfully')
        } else {
          setCustomers([...customers, updatedCustomer])
          alert('Customer added successfully')
        }
        setShowModal(false)
        setEditingCustomer(null)
        setFormData({ name: '', phone: '', address: '', gstin: '' })
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to save customer'}`)
      }
    } catch (error) {
      console.error('Error saving customer:', error)
      alert('Error saving customer')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingCustomer(null)
    setFormData({ name: '', phone: '', address: '', gstin: '' })
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Customers</h1>
              <p className="text-gray-600">Manage customer information</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              + Add Customer
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={handleSearch}
              className="input-field w-full"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading customers...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-500 mb-4">No customers found</p>
              <button onClick={() => setShowModal(true)} className="btn-primary inline-block">
                Add First Customer
              </button>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Customer Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Address</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">GSTIN</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Created Date</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="table-row">
                      <td className="px-6 py-4 text-sm font-medium">{customer.name}</td>
                      <td className="px-6 py-4 text-sm">{customer.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.address || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">{customer.gstin || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="p-2 text-error hover:bg-error/10 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
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

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter customer name"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field"
                  placeholder="Customer address"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GSTIN</label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="input-field"
                  placeholder="33AAAAA0000A1Z5"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="btn-success flex-1" 
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingCustomer ? 'Update Customer' : 'Add Customer')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
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
    </div>
  )
}
