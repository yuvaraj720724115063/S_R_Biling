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
    
    // Validate required fields
    if (!data.hsnCode || !data.name) {
      return NextResponse.json({ error: 'HSN Code and Product Name are required' }, { status: 400 })
    }

    // Check if HSN code already exists
    const existingProduct = await prisma.product.findUnique({
      where: { hsnCode: data.hsnCode }
    })

    if (existingProduct) {
      return NextResponse.json({ error: 'Product with this HSN Code already exists' }, { status: 409 })
    }

    const product = await prisma.product.create({
      data: {
        hsnCode: data.hsnCode.trim(),
        name: data.name.trim(),
        description: data.description ? data.description.trim() : null,
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
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Product with this HSN Code already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMINISTRATOR' && session.user.role !== 'STOCK_MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const data = await request.json()
    
    if (!data.name) {
      return NextResponse.json({ error: 'Product Name is required' }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name.trim(),
        description: data.description ? data.description.trim() : null,
        unit: data.unit || 'PCS',
        gstRate: data.gstRate || 18
      },
      include: {
        stock: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Check if product is used in any bills
    const billItemCount = await prisma.billItem.count({
      where: { productId }
    })

    if (billItemCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete product used in ${billItemCount} bill(s)` }, 
        { status: 409 }
      )
    }

    await prisma.product.delete({
      where: { id: productId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

