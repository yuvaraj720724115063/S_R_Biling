import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { generateBillNumber } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const billId = searchParams.get('billId')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // If billId is provided, fetch single bill
    if (billId) {
      const bill = await prisma.bill.findUnique({
        where: { id: billId },
        include: {
          customer: true,
          user: true,
          billItems: {
            include: {
              product: true
            }
          }
        }
      })

      if (!bill) {
        return NextResponse.json({ error: 'Bill not found' }, { status: 404 })
      }

      return NextResponse.json(bill)
    }

    const where: any = {}
    
    if (type) {
      where.billType = type
    }
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const bills = await prisma.bill.findMany({
      where,
      include: {
        customer: true,
        user: true,
        billItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(bills)
  } catch (error) {
    console.error('Bills fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch bills' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Generate bill number
    const billNumber = generateBillNumber(data.billType)

    const items = data.billItems || data.items || []

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      const lowStockItems: Array<{
        productId: string
        productName: string
        currentQuantity: number
        reorderLevel: number
      }> = []

      // Create bill
      const newBill = await tx.bill.create({
        data: {
          billNumber,
          billType: data.billType,
          customerId: data.customerId,
          userId: session.user.id,
          date: new Date(data.date || new Date()),
          subtotal: data.subtotal,
          taxAmount: data.taxAmount,
          discount: data.discount || 0,
          grandTotal: data.grandTotal,
          notes: data.notes,
          billItems: {
            create: items.map((item: any) => {
              const lineAmount = item.quantity * item.rate
              const lineTaxAmount = (lineAmount * item.taxRate) / 100
              return {
                productId: item.productId,
                quantity: item.quantity,
                rate: item.rate,
                taxRate: item.taxRate,
                taxAmount: lineTaxAmount,
                amount: lineAmount + lineTaxAmount
              }
            })
          }
        },
        include: {
          customer: true,
          billItems: {
            include: {
              product: true
            }
          }
        }
      })

      // Update stock for all bill types
      for (const item of items) {
        const stock = await tx.stock.findUnique({
          where: { productId: item.productId },
          include: { product: true }
        })

        if (stock) {
          const afterQty = stock.currentQuantity - item.quantity
          await tx.stock.update({
            where: { productId: item.productId },
            data: {
              currentQuantity: afterQty
            }
          })

          // Log stock movement
          await tx.stockLog.create({
            data: {
              productId: item.productId,
              userId: session.user.id,
              type: 'SALE',
              quantity: item.quantity,
              beforeQty: stock.currentQuantity,
              afterQty: afterQty,
              rate: item.rate,
              notes: `Bill: ${billNumber}`
            }
          })

          if (afterQty <= stock.reorderLevel) {
            lowStockItems.push({
              productId: stock.productId,
              productName: stock.product.name,
              currentQuantity: afterQty,
              reorderLevel: stock.reorderLevel
            })
          }
        }
      }

      return { bill: newBill, lowStockItems }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Bill creation error:', error)
    return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const billId = searchParams.get('id')

    if (!billId) {
      return NextResponse.json({ error: 'Bill ID required' }, { status: 400 })
    }

    // Get bill with items before deleting
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: {
        billItems: true
      }
    })

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 })
    }

    // Delete bill and restore stock in transaction
    await prisma.$transaction(async (tx) => {
      // Restore stock quantities
      for (const item of bill.billItems) {
        const stock = await tx.stock.findUnique({
          where: { productId: item.productId }
        })

        if (stock) {
          await tx.stock.update({
            where: { productId: item.productId },
            data: {
              currentQuantity: stock.currentQuantity + item.quantity
            }
          })

          // Log stock restoration
          await tx.stockLog.create({
            data: {
              productId: item.productId,
              userId: session.user.id,
              type: 'ADD',
              quantity: item.quantity,
              beforeQty: stock.currentQuantity,
              afterQty: stock.currentQuantity + item.quantity,
              rate: item.rate,
              notes: `Bill deleted: ${bill.billNumber}`
            }
          })
        }
      }

      // Delete bill (cascade will delete bill items)
      await tx.bill.delete({
        where: { id: billId }
      })
    })

    return NextResponse.json({ message: 'Bill deleted successfully' })
  } catch (error) {
    console.error('Bill deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete bill' }, { status: 500 })
  }
}

