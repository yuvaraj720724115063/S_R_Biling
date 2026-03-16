export interface User {
  id: string
  username: string
  name: string
  role: 'ADMINISTRATOR' | 'STOCK_MANAGER' | 'BILLER'
  active: boolean
}

export interface Product {
  id: string
  hsnCode: string
  name: string
  description?: string
  unit: string
  gstRate: number
}

export interface Customer {
  id: string
  name: string
  phone?: string
  address?: string
  gstin?: string
}

export interface BillItem {
  id?: string
  productId: string
  product?: Product
  quantity: number
  rate: number
  taxRate: number
  taxAmount: number
  amount: number
}

export interface Bill {
  id?: string
  billNumber: string
  billType: 'GST_BILL' | 'ESTIMATE_BILL' | 'SHOP_TO_SHOP_BILL'
  customerId: string
  customer?: Customer
  userId: string
  user?: User
  date: Date
  subtotal: number
  taxAmount: number
  discount: number
  grandTotal: number
  notes?: string
  billItems: BillItem[]
}

export interface Stock {
  id: string
  productId: string
  product?: Product
  currentQuantity: number
  reorderLevel: number
  lastPurchaseRate?: number
}

export interface DashboardStats {
  todayRevenue: number
  monthlyRevenue: number
  totalProducts: number
  lowStockCount: number
  todayBills: number
  monthlyBills: number
}
