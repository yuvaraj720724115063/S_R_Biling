import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { startOfDay, startOfMonth, endOfDay, endOfMonth, subMonths, format } from 'date-fns'

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

    // Bills by type for reports chart
    const billsByTypeRaw = await prisma.bill.groupBy({
      by: ['billType'],
      _count: {
        _all: true
      }
    })
    const billsByType = billsByTypeRaw.map((item) => ({
      type: item.billType.replace(/_/g, ' '),
      count: item._count._all
    }))

    // Last 6 months revenue trend for reports chart
    const chartStart = startOfMonth(subMonths(today, 5))
    const recentBills = await prisma.bill.findMany({
      where: {
        date: {
          gte: chartStart,
          lte: endMonth
        }
      },
      select: {
        date: true,
        grandTotal: true
      }
    })

    const monthlyRevenueMap: Record<string, number> = {}
    for (let i = 5; i >= 0; i--) {
      const monthKey = format(subMonths(today, i), 'yyyy-MM')
      monthlyRevenueMap[monthKey] = 0
    }

    for (const bill of recentBills) {
      const monthKey = format(new Date(bill.date), 'yyyy-MM')
      if (monthKey in monthlyRevenueMap) {
        monthlyRevenueMap[monthKey] += bill.grandTotal
      }
    }

    const monthlyRevenueChart = Object.entries(monthlyRevenueMap).map(([monthKey, revenue]) => ({
      month: format(new Date(`${monthKey}-01`), 'MMM'),
      revenue
    }))

    // Total products
    const totalProducts = await prisma.product.count()

    // Low stock details for dashboard warning panel
    const lowStock = await prisma.stock.findMany({
      where: {
        currentQuantity: {
          lte: prisma.stock.fields.reorderLevel
        }
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            hsnCode: true,
            unit: true
          }
        }
      },
      orderBy: {
        currentQuantity: 'asc'
      }
    })

    const stats = {
      totalBills,
      totalRevenue,
      totalProducts,
      lowStockItems: lowStock.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        hsnCode: item.product.hsnCode,
        unit: item.product.unit,
        currentQuantity: item.currentQuantity,
        reorderLevel: item.reorderLevel
      })),
      lowStockCount: lowStock.length,
      billsByType,
      monthlyRevenueChart,
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

