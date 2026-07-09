import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database...')
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding Categories...')
  const mobiles = await prisma.category.create({ data: { name: 'Mobiles' } })
  const accessories = await prisma.category.create({ data: { name: 'Accessories' } })
  const services = await prisma.category.create({ data: { name: 'Services' } })

  console.log('Seeding Brands...')
  const apple = await prisma.brand.create({ data: { name: 'Apple' } })
  const samsung = await prisma.brand.create({ data: { name: 'Samsung' } })
  const generic = await prisma.brand.create({ data: { name: 'Generic' } })

  console.log('Seeding Products...')
  
  // Mobile
  const s24 = await prisma.product.create({
    data: {
      name: 'Samsung Galaxy S24 Ultra',
      type: 'MOBILE',
      basePrice: 129999,
      categoryId: mobiles.id,
      brandId: samsung.id,
      variants: {
        create: [
          { sku: 'MOB-SAM-S24U-BLK', name: 'Titanium Black / 256GB', price: 129999, stock: 5 }
        ]
      }
    }
  })

  const iphone = await prisma.product.create({
    data: {
      name: 'Apple iPhone 15 Pro',
      type: 'MOBILE',
      basePrice: 134900,
      categoryId: mobiles.id,
      brandId: apple.id,
      variants: {
        create: [
          { sku: 'MOB-APL-IP15P-NAT', name: 'Natural Titanium / 256GB', price: 134900, stock: 0 }
        ]
      }
    }
  })

  // Accessories
  await prisma.product.create({
    data: {
      name: '20W USB-C Power Adapter',
      type: 'ACCESSORY',
      basePrice: 1900,
      categoryId: accessories.id,
      brandId: apple.id,
      variants: {
        create: [
          { sku: 'ACC-APL-20W', name: 'Standard', price: 1900, stock: 30 }
        ]
      }
    }
  })

  await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro Screen Guard',
      type: 'ACCESSORY',
      basePrice: 999,
      categoryId: accessories.id,
      brandId: generic.id,
      variants: {
        create: [
          { sku: 'ACC-IP15-SG', name: 'Tempered Glass', price: 999, stock: 50 }
        ]
      }
    }
  })

  // Admin User
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@shreeshamobile.com',
      // In a real app, hash this password with bcrypt
      password: 'password123',
      role: 'ADMIN',
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
