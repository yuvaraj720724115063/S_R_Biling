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
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

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

    // Start transaction
    const bill = await prisma.$transaction(async (tx) => {
      // Create bill
      const newBill = await tx.bill.create({
        data: {
          billNumber,
          billType: data.billType,
          customerId: data.customerId,
          userId: session.user.id,
          date: new Date(data.date),
          subtotal: data.subtotal,
          taxAmount: data.taxAmount,
          discount: data.discount || 0,
          grandTotal: data.grandTotal,
          notes: data.notes,
          billItems: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              rate: item.rate,
              taxRate: item.taxRate,
              taxAmount: item.taxAmount,
              amount: item.amount
            }))
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

      // Update stock if it's a GST bill (actual sale)
      if (data.billType === 'GST_BILL') {
        for (const item of data.items) {
          const stock = await tx.stock.findUnique({
            where: { productId: item.productId }
          })

          if (stock) {
            await tx.stock.update({
              where: { productId: item.productId },
              data: {
                currentQuantity: stock.currentQuantity - item.quantity
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
                afterQty: stock.currentQuantity - item.quantity,
                rate: item.rate,
                notes: `Bill: ${billNumber}`
              }
            })
          }
        }
      }

      return newBill
    })

    return NextResponse.json(bill, { status: 201 })
  } catch (error) {
    console.error('Bill creation error:', error)
    return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 })
  }
}

