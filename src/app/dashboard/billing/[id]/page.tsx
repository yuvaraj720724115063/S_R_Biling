'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Printer, ArrowLeft } from 'lucide-react'
import Sidebar from '@/components/Sidebar'

interface BillItem {
  id: string
  productId: string
  quantity: number
  rate: number
  taxRate: number
  product: {
    id: string
    name: string
    hsnCode: string
    unit: string
  }
}

interface Bill {
  id: string
  billNumber: string
  billType: string
  date: string
  subtotal: number
  taxAmount: number
  grandTotal: number
  customer: {
    id: string
    name: string
    phone?: string
    address?: string
    gstin?: string
  }
  user: {
    id: string
    name: string
  }
  billItems: BillItem[]
}

export default function BillDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const billId = params.id as string
  const [bill, setBill] = useState<Bill | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasPrinted, setHasPrinted] = useState(false)
  const [redirectAfterPrint, setRedirectAfterPrint] = useState(false)

  useEffect(() => {
    fetchBill()
  }, [billId])

  useEffect(() => {
    const shouldPrint = searchParams.get('print') === '1'
    if (bill && shouldPrint && !hasPrinted) {
      setHasPrinted(true)
      setRedirectAfterPrint(true)
      window.setTimeout(() => window.print(), 300)
    }
  }, [bill, searchParams, hasPrinted])

  useEffect(() => {
    const handleAfterPrint = () => {
      if (redirectAfterPrint) {
        router.push('/dashboard/billing/new')
      }
    }

    window.addEventListener('afterprint', handleAfterPrint)
    return () => window.removeEventListener('afterprint', handleAfterPrint)
  }, [redirectAfterPrint, router])

  const fetchBill = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/billing?billId=${billId}`)
      if (response.ok) {
        const data = await response.json()
        setBill(data)
      }
    } catch (error) {
      console.error('Error fetching bill:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    setRedirectAfterPrint(true)
    window.print()
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading bill...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!bill) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Bill not found</p>
            <button onClick={() => router.back()} className="btn-secondary">
              Go Back
            </button>
          </div>
        </main>
      </div>
    )
  }

  const billDate = new Date(bill.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="flex print:block">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <main className="flex-1 p-8 print:p-4 print:m-0 print:w-full">
        <div className="max-w-4xl mx-auto print:max-w-full print:mx-0">
          {/* Header - Hide in Print */}
          <div className="mb-8 flex justify-between items-center print:hidden">
            <button onClick={() => router.back()} className="btn-secondary flex items-center gap-2">
              <ArrowLeft size={20} />
              Back
            </button>
            <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
              <Printer size={20} />
              Print Bill
            </button>
          </div>

          {/* Bill Content */}
          <div className="bg-white p-8 print:p-4">
            {/* Shop Header */}
            <div className="border-b-2 pb-6 mb-6 text-center">
              <h1 className="text-2xl font-bold text-text">S.R. Cycle & AUTO Spares</h1>
              <p className="text-sm text-gray-600">5/194 Anna Nagar, Thennampulam</p>
              <p className="text-sm text-gray-600">Nagappattinam (D.T), Tamil Nadu - 614806</p>
            </div>

            {/* Header */}
            <div className="border-b-2 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-primary mb-2">INVOICE</h1>
              <p className="text-gray-600 text-lg">Bill #{bill.billNumber}</p>
              <p className="text-gray-600">{bill.billType.replace(/_/g, ' ')}</p>
            </div>

            {/* Customer and Bill Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-sm text-gray-600 mb-3">BILL TO:</h3>
                <p className="font-bold text-lg">{bill.customer.name}</p>
                {bill.customer.address && <p className="text-sm text-gray-600">{bill.customer.address}</p>}
                {bill.customer.phone && <p className="text-sm text-gray-600">Phone: {bill.customer.phone}</p>}
                {bill.customer.gstin && <p className="text-sm text-gray-600">GSTIN: {bill.customer.gstin}</p>}
              </div>
              <div className="text-right">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Date:</p>
                  <p className="font-semibold text-lg">{billDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created By:</p>
                  <p className="font-semibold text-lg">{bill.user.name}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="border border-gray-300 p-3 text-left font-semibold">HSN Code</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">Product</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">Unit</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">Qty</th>
                    <th className="border border-gray-300 p-3 text-right font-semibold">Rate</th>
                    <th className="border border-gray-300 p-3 text-right font-semibold">Subtotal</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">Tax %</th>
                    <th className="border border-gray-300 p-3 text-right font-semibold">Tax</th>
                    <th className="border border-gray-300 p-3 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.billItems.map((item, index) => {
                    const subtotal = item.quantity * item.rate
                    const tax = (subtotal * item.taxRate) / 100
                    const total = subtotal + tax
                    return (
                      <tr key={item.id} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="border border-gray-300 p-3 font-mono text-sm">{item.product.hsnCode}</td>
                        <td className="border border-gray-300 p-3">{item.product.name}</td>
                        <td className="border border-gray-300 p-3 text-center text-sm">{item.product.unit}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 p-3 text-right">₹{item.rate.toFixed(2)}</td>
                        <td className="border border-gray-300 p-3 text-right">₹{subtotal.toFixed(2)}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.taxRate}%</td>
                        <td className="border border-gray-300 p-3 text-right">₹{tax.toFixed(2)}</td>
                        <td className="border border-gray-300 p-3 text-right font-bold">₹{total.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-semibold">Subtotal:</span>
                  <span>₹{bill.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-semibold">Tax Amount:</span>
                  <span>₹{bill.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-b-2 bg-primary/10">
                  <span className="font-bold text-lg">Grand Total:</span>
                  <span className="font-bold text-lg text-primary">₹{bill.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer - Hide in Print */}
            <div className="text-center text-sm text-gray-500 mt-8 py-4 border-t print:hidden">
              <p>This is a computer-generated document. No signature required.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
