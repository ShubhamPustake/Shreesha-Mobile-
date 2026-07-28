"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function quickAddProduct(data: any) {
  try {
    const {
      name, brandId, categoryId, model, color, ram, storage,
      mrp, sellingPrice, stock, image, description,
      processor, displaySize, rearCamera, frontCamera, battery, os, warranty
    } = data;

    // Generate SKU based on inputs and a unique timestamp suffix
    const cleanStr = (str: string) => (str || "").substring(0,3).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const sku = `${cleanStr(brandId)}-${cleanStr(model)}-${cleanStr(color)}-${Date.now().toString().slice(-4)}`;

    // Variant name
    const variantName = [color, ram, storage].filter(Boolean).join(" / ") || "Default";

    // Attributes JSON
    const attributes = JSON.stringify({
      Model: model,
      Color: color,
      RAM: ram,
      Storage: storage,
      Processor: processor,
      "Display Size": displaySize,
      "Rear Camera": rearCamera,
      "Front Camera": frontCamera,
      "Battery Capacity": battery,
      "Operating System": os,
      Warranty: warranty
    })

    const newProduct = await prisma.$transaction(async (tx) => {
      // 1. Create Base Product
      const product = await tx.product.create({
        data: {
          name,
          description,
          type: "MOBILE",
          basePrice: parseFloat(mrp),
          images: image,
          categoryId,
          brandId
        }
      })

      // 2. Create Variant
      await tx.productVariant.create({
        data: {
          productId: product.id,
          sku,
          name: variantName,
          price: parseFloat(sellingPrice),
          stock: parseInt(stock, 10),
          attributes
        }
      })

      return product;
    })

    revalidatePath("/admin/products")
    revalidatePath("/admin/inventory")
    return { success: true, product: newProduct }

  } catch (error: any) {
    console.error("Quick Add Error:", error)
    return { error: error.message || "Failed to quick add product" }
  }
}
