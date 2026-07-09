"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

type CheckoutItem = {
  id: string
  quantity: string | number
  price: number
}

export async function processPosCheckout(items: CheckoutItem[], paymentMethod: string, discount: number) {
  if (!items || items.length === 0) {
    return { error: "Cart is empty" }
  }

  try {
    // We need a customer for the order. In a real POS, we might have a walk-in user.
    // For MVP, we'll find or create a default 'Walk-in Customer'
    let walkIn = await prisma.user.findFirst({
      where: { email: "walkin@shreeshamobile.com" }
    })

    if (!walkIn) {
      walkIn = await prisma.user.create({
        data: {
          name: "Walk-in Customer",
          email: "walkin@shreeshamobile.com",
          role: "CUSTOMER"
        }
      })
    }

    // Calculate total
    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0)
    const tax = subtotal * 0.18
    const totalAmount = subtotal + tax - discount

    // Create Order and decrement stock in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          userId: walkIn.id,
          totalAmount,
          status: "DELIVERED", // POS orders are instantly delivered
          paymentMethod,
          paymentStatus: "COMPLETED",
          items: {
            create: items.map(item => ({
              productVariantId: item.id,
              quantity: Number(item.quantity),
              price: item.price
            }))
          }
        }
      })

      // 2. Decrement Stock
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: Number(item.quantity)
            }
          }
        })
      }
      
      return order
    })

    return { success: true }
  } catch (error) {
    console.error("Checkout error:", error)
    return { error: "Failed to process checkout. Check stock levels." }
  }
}
