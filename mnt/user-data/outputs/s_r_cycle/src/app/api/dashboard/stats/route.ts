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

    // Today's revenue (GST Bills only)
    const todayBills = await prisma.bill.findMany({
      where: {
        billType: 'GST_BILL',
        date: {
          gte: startToday,
          lte: endToday
        }
      }
    })
    const todayRevenue = todayBills.reduce((sum, bill) => sum + bill.grandTotal, 0)

    // Monthly revenue
    const monthlyBills = await prisma.bill.findMany({
      where: {
        billType: 'GST_BILL',
        date: {
          gte: startMonth,
          lte: endMonth
        }
      }
    })
    const monthlyRevenue = monthlyBills.reduce((sum, bill) => sum + bill.grandTotal, 0)

    // Total products
    const totalProducts = await prisma.product.count()

    // Low stock count
    const lowStock = await prisma.stock.findMany({
      where: {
        currentQuantity: {
          lte: prisma.stock.fields.reorderLevel
        }
      }
    })

    const stats = {
      todayRevenue,
      monthlyRevenue,
      totalProducts,
      lowStockCount: lowStock.length,
      todayBills: todayBills.length,
      monthlyBills: monthlyBills.length
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

