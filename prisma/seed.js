const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMINISTRATOR',
      active: true
    }
  })
  console.log('✓ Created admin user')

  // Create stock manager user
  const stockManagerPassword = await bcrypt.hash('stock123', 10)
  const stockManager = await prisma.user.upsert({
    where: { username: 'stock' },
    update: {},
    create: {
      username: 'stock',
      password: stockManagerPassword,
      name: 'Stock Manager',
      role: 'STOCK_MANAGER',
      active: true
    }
  })
  console.log('✓ Created stock manager user')

  // Create biller user
  const billerPassword = await bcrypt.hash('biller123', 10)
  const biller = await prisma.user.upsert({
    where: { username: 'biller' },
    update: {},
    create: {
      username: 'biller',
      password: billerPassword,
      name: 'Biller',
      role: 'BILLER',
      active: true
    }
  })
  console.log('✓ Created biller user')

  // Create sample customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Walk-in Customer',
      phone: '0000000000'
    }
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Rajesh Kumar',
      phone: '9876543210',
      address: 'Chennai',
      gstin: '33AAAAA0000A1Z5'
    }
  })
  console.log('✓ Created sample customers')

  // Create sample products
  const products = [
    {
      hsnCode: '87141010',
      name: 'Motorcycle Chain',
      description: '428H Chain for bikes',
      unit: 'PCS',
      gstRate: 28,
      reorderLevel: 5
    },
    {
      hsnCode: '87141020',
      name: 'Motorcycle Sprocket',
      description: 'Front sprocket 14T',
      unit: 'PCS',
      gstRate: 28,
      reorderLevel: 3
    },
    {
      hsnCode: '87089100',
      name: 'Brake Shoe',
      description: 'Universal brake shoe',
      unit: 'SET',
      gstRate: 28,
      reorderLevel: 10
    },
    {
      hsnCode: '40111000',
      name: 'Motorcycle Tyre',
      description: '2.75-18 4PR',
      unit: 'PCS',
      gstRate: 28,
      reorderLevel: 5
    },
    {
      hsnCode: '87141030',
      name: 'Clutch Cable',
      description: 'Universal clutch cable',
      unit: 'PCS',
      gstRate: 18,
      reorderLevel: 8
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: {
        hsnCode: product.hsnCode,
        name: product.name,
        description: product.description,
        unit: product.unit,
        gstRate: product.gstRate,
        stock: {
          create: {
            currentQuantity: Math.floor(Math.random() * 20) + 10,
            reorderLevel: product.reorderLevel,
            lastPurchaseRate: Math.floor(Math.random() * 500) + 100
          }
        }
      }
    })
  }
  console.log('✓ Created sample products with stock')

console.log('\nSeed completed successfully!')
console.log('\nLogin credentials:')
console.log('Administrator - username: admin, password: admin123')
console.log('Stock Manager - username: stock, password: stock123')
console.log('Biller - username: biller, password: biller123')
console.log('\n⚠️  Please change these passwords after first login!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
