"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getInventory() {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
      category: true,
      brand: true
    }
  })

  // Flatten the variants into individual inventory items
  const inventory = products.flatMap(product => 
    product.variants.map(variant => ({
      id: variant.id,
      sku: variant.sku,
      name: `${product.name} - ${variant.name}`,
      category: product.category.name,
      price: variant.price,
      stock: variant.stock,
      status: variant.stock > 10 ? "In Stock" : variant.stock > 0 ? "Low Stock" : "Out of Stock"
    }))
  )

  return inventory
}
