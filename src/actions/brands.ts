"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import path from "path"

const prisma = new PrismaClient()

export async function addBrand(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const logoFile = formData.get("logo") as File | null
    let logoUrl = null

    if (logoFile && logoFile.size > 0) {
      const bytes = await logoFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${logoFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`
      const filepath = path.join(process.cwd(), "public", "uploads", "brands", fileName)
      await writeFile(filepath, buffer)
      logoUrl = `/uploads/brands/${fileName}`
    }

    const newBrand = await prisma.brand.create({
      data: {
        name: name,
        logo: logoUrl,
      }
    })

    revalidatePath("/admin/brands")
    revalidatePath("/admin/products")
    return { success: true, brand: newBrand }
  } catch (error: any) {
    console.error("Failed to add brand:", error)
    if (error.code === 'P2002') {
      return { error: "A brand with this name already exists." }
    }
    return { error: "Failed to add brand. Please check the details." }
  }
}

export async function updateBrand(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const logoFile = formData.get("logo") as File | null
    
    let updateData: any = { name }

    if (logoFile && logoFile.size > 0) {
      const bytes = await logoFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${logoFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`
      const filepath = path.join(process.cwd(), "public", "uploads", "brands", fileName)
      await writeFile(filepath, buffer)
      updateData.logo = `/uploads/brands/${fileName}`
    }

    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: updateData
    })

    revalidatePath("/admin/brands")
    revalidatePath("/admin/products")
    return { success: true, brand: updatedBrand }
  } catch (error: any) {
    console.error("Failed to update brand:", error)
    if (error.code === 'P2002') {
      return { error: "A brand with this name already exists." }
    }
    return { error: "Failed to update brand." }
  }
}

export async function deleteBrand(id: string) {
  try {
    // Check if there are products using this brand
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    })

    if (brand && brand._count.products > 0) {
      return { error: "Cannot delete brand because it has associated products." }
    }

    await prisma.brand.delete({
      where: { id }
    })

    revalidatePath("/admin/brands")
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete brand:", error)
    return { error: "Failed to delete brand." }
  }
}
