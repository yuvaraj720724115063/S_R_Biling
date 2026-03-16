import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { startOfDay, startOfMonth, endOfDay, endOfMonth } from 'date-fns'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    const startToday = startOfDay(today)
    const endToday = endOfDay(today)
    const startMonth = startOfMonth(today)
    const endMonth = endOfMonth(today)

    // All bills (total count and revenue)
    const allBills = await prisma.bill.findMany()
    const totalBills = allBills.length
    const totalRevenue = allBills.reduce((sum, bill) => sum + bill.grandTotal, 0)

    // Today's bills
    const todayBills = await prisma.bill.findMany({
      where: {
        date: {
          gte: startToday,
          lte: endToday
        }
      }
    })

    // Monthly revenue
    const monthlyBills = await prisma.bill.findMany({
      where: {
        date: {
          gte: startMonth,
          lte: endMonth
        }
      }
    })
    const monthlyRevenue = monthlyBills.reduce((sum, bill) => sum + bill.grandTotal, 0)

    // Total products
    const totalProducts = await prisma.product.count()

    // Low stock count - compare currentQuantity with reorderLevel
    const allStock = await prisma.stock.findMany()
    const lowStock = allStock.filter(s => s.currentQuantity <= s.reorderLevel)

    const stats = {
      totalBills,
      totalRevenue,
      totalProducts,
      lowStockItems: lowStock.length,
      lowStockCount: lowStock.length,
      todayRevenue: todayBills.reduce((sum, bill) => sum + bill.grandTotal, 0),
      monthlyRevenue: monthlyRevenue,
      todayBills: todayBills.length,
      monthlyBills: monthlyBills.length
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

