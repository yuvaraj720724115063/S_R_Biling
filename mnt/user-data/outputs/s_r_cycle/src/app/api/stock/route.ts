import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lowStock = searchParams.get('lowStock') === 'true'

    const stock = await prisma.stock.findMany({
      where: lowStock ? {
        currentQuantity: {
          lte: prisma.stock.fields.reorderLevel
        }
      } : undefined,
      include: {
        product: true
      },
      orderBy: {
        product: {
          name: 'asc'
        }
      }
    })

    return NextResponse.json(stock)
  } catch (error) {
    console.error('Stock fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMINISTRATOR' && session.user.role !== 'STOCK_MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { productId, quantity, type, rate, notes } = data

    // Get current stock
    const currentStock = await prisma.stock.findUnique({
      where: { productId }
    })

    if (!currentStock) {
      return NextResponse.json({ error: 'Stock record not found' }, { status: 404 })
    }

    let newQuantity: number
    switch (type) {
      case 'ADD':
        newQuantity = currentStock.currentQuantity + quantity
        break
      case 'REMOVE':
        newQuantity = Math.max(0, currentStock.currentQuantity - quantity)
        break
      case 'ADJUST':
        newQuantity = quantity
        break
      default:
        return NextResponse.json({ error: 'Invalid adjustment type' }, { status: 400 })
    }

    // Update stock in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update stock
      const updatedStock = await tx.stock.update({
        where: { productId },
        data: {
          currentQuantity: newQuantity,
          lastPurchaseRate: rate || currentStock.lastPurchaseRate
        },
        include: {
          product: true
        }
      })

      // Create log entry
      await tx.stockLog.create({
        data: {
          productId,
          userId: session.user.id,
          type,
          quantity,
          beforeQty: currentStock.currentQuantity,
          afterQty: newQuantity,
          rate,
          notes
        }
      })

      return updatedStock
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Stock adjustment error:', error)
    return NextResponse.json({ error: 'Failed to adjust stock' }, { status: 500 })
  }
}

