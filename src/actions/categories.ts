"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function addCategory(formData: { name: string, description?: string, brandId: string }) {
  try {
    const newCategory = await prisma.category.create({
      data: {
        name: formData.name,
        description: formData.description,
        brandId: formData.brandId,
      }
    })

    revalidatePath("/admin/categories")
    revalidatePath("/admin/products") // Products page needs to fetch the new category list
    return { success: true, category: newCategory }
  } catch (error: any) {
    console.error("Failed to add category:", error)
    if (error.code === 'P2002') {
      return { error: "A category with this name already exists." }
    }
    return { error: "Failed to add category. Please check the details." }
  }
}

export async function updateCategory(id: string, formData: { name: string, description?: string, brandId: string }) {
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: formData.name,
        description: formData.description,
        brandId: formData.brandId,
      }
    })

    revalidatePath("/admin/categories")
    revalidatePath("/admin/products")
    return { success: true, category: updatedCategory }
  } catch (error: any) {
    console.error("Failed to update category:", error)
    if (error.code === 'P2002') {
      return { error: "A category with this name already exists." }
    }
    return { error: "Failed to update category." }
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    })

    if (category && category._count.products > 0) {
      return { error: "Cannot delete category because it has associated products." }
    }

    await prisma.category.delete({
      where: { id }
    })

    revalidatePath("/admin/categories")
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete category:", error)
    return { error: "Failed to delete category." }
  }
}
