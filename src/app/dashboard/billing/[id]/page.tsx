'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Printer, ArrowLeft } from 'lucide-react'

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

interface CompanyDetails {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyGSTIN: string
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
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    companyName: 'S.R. Cycle & AUTO Spares',
    companyAddress: '5/194 Anna Nagar, Thennampulam, Nagappattinam (D.T), Tamil Nadu - 614806',
    companyPhone: '9487170053, 7358446429',
    companyGSTIN: ''
  })

  useEffect(() => {
    fetchBill()
    fetchCompanyDetails()
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
    window.print()
  }

  const fetchCompanyDetails = async () => {
    try {
      const response = await fetch('/api/settings')
      if (!response.ok) {
        return
      }

      const data = await response.json()
      const settings = data?.settings
      if (!settings) {
        return
      }

      setCompanyDetails((prev) => ({
        ...prev,
        companyName: settings.companyName || prev.companyName,
        companyAddress: settings.companyAddress || prev.companyAddress,
        companyPhone: settings.companyPhone || prev.companyPhone,
        companyGSTIN: settings.companyGSTIN || ''
      }))
    } catch (error) {
      console.error('Error fetching company details:', error)
    }
  }

  if (loading) {
    return (
      <main className="flex-1 p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading bill...</p>
        </div>
      </main>
    )
  }

  if (!bill) {
    return (
      <main className="flex-1 p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Bill not found</p>
          <button onClick={() => router.back()} className="btn-secondary">
            Go Back
          </button>
        </div>
      </main>
    )
  }

  const billDate = new Date(bill.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            page-break-inside: avoid !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
            border-collapse: collapse !important;
          }
          
          /* Hide sidebar completely */
          [data-print-hide],
          aside,
          nav,
          .sidebar {
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
            position: absolute !important;
            left: -9999px !important;
          }
          
          /* Page settings */
          @page {
            size: A4;
            margin: 10mm;
          }
          
          html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          /* Main container */
          [data-print-content],
          main {
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            background: white !important;
            position: static !important;
            page-break-after: avoid !important;
          }
          
          /* Content sections */
          main > div {
            page-break-inside: avoid !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Reduce spacing */
          h1, h2, h3, h4, h5, h6, p, div, table, tr, td, th {
            margin: 0 !important;
            padding: 0 !important;
            page-break-inside: avoid !important;
          }
          
          /* Table styling */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            page-break-inside: avoid !important;
          }

          thead {
            display: table-header-group !important;
          }

          thead th {
            color: #000 !important;
            background: #fff !important;
            border: 1px solid #d1d5db !important;
            font-weight: 700 !important;
          }

          tbody td {
            color: #000 !important;
            border: 1px solid #d1d5db !important;
          }

          [data-logo-wrap] {
            background: #e5e7eb !important;
            border-radius: 6px !important;
            padding: 4px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          [data-logo-wrap] img {
            display: block !important;
          }
          
          tr {
            page-break-inside: avoid !important;
          }
          
          /* Reduce font size slightly to fit one page */
          body {
            font-size: 13px !important;
            line-height: 1.3 !important;
          }
          
          h1 {
            font-size: 24px !important;
            margin-bottom: 4px !important;
            page-break-after: avoid !important;
          }
          
          h3 {
            font-size: 12px !important;
            margin-bottom: 2px !important;
          }

          [data-shop-header] {
            text-align: center !important;
          }
        }
      `}</style>
      <main data-print-content className="flex-1 p-8">
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
            <div data-shop-header className="border-b-2 pb-6 mb-6 grid grid-cols-[auto_1fr_auto] items-center gap-4">
              <div data-logo-wrap className="bg-gray-200 rounded p-1 shrink-0">
                <img
                  src="/srlogo.webp"
                  alt="S.R. Cycle logo"
                  width={88}
                  height={88}
                  className="w-[88px] h-[88px] object-contain print:w-16 print:h-16"
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-text">{companyDetails.companyName}</h1>
                <p className="text-sm text-gray-600">{companyDetails.companyAddress}</p>
                <p className="text-sm text-gray-600">Phone: <span className="font-bold">{companyDetails.companyPhone}</span></p>
                {bill.billType === 'GST_BILL' && companyDetails.companyGSTIN && (
                  <p className="text-sm text-gray-600">GSTIN: <span className="font-bold">{companyDetails.companyGSTIN}</span></p>
                )}
              </div>
              <div aria-hidden="true" className="w-[88px] h-[88px] print:w-16 print:h-16" />
            </div>

            {/* Header */}
            <div className="border-b-2 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-primary mb-2">INVOICE</h1>
              <p className="text-gray-600 text-lg">Bill #<span className="font-bold">{bill.billNumber}</span></p>
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
    </>
  )
}
