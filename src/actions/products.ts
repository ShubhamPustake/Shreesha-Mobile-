"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function addProduct(formData: {
  name: string
  description?: string
  type: string
  basePrice: number
  categoryId: string
  brandId: string
}) {
  try {
    const newProduct = await prisma.product.create({
      data: {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        basePrice: Number(formData.basePrice),
        categoryId: formData.categoryId,
        brandId: formData.brandId,
      }
    })

    revalidatePath("/admin/products")
    revalidatePath("/admin/inventory") // Because POS/Inventory rely on it
    return { success: true, product: newProduct }
  } catch (error: any) {
    console.error("Failed to add product:", error)
    return { error: "Failed to add product. Please check the provided details." }
  }
}
