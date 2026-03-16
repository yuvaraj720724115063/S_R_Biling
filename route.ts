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
    const search = searchParams.get('search')

    const products = await prisma.product.findMany({
      where: search ? {
        OR: [
          { name: { contains: search } },
          { hsnCode: { contains: search } }
        ]
      } : undefined,
      include: {
        stock: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMINISTRATOR' && session.user.role !== 'STOCK_MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const product = await prisma.product.create({
      data: {
        hsnCode: data.hsnCode,
        name: data.name,
        description: data.description,
        unit: data.unit || 'PCS',
        gstRate: data.gstRate || 18,
        stock: {
          create: {
            currentQuantity: 0,
            reorderLevel: data.reorderLevel || 10
          }
        }
      },
      include: {
        stock: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

