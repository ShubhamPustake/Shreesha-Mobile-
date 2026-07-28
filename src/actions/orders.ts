"use server"

import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function createOrder(data: any, items: any[], total: number) {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error("You must be logged in to place an order.")
  }
  
  let userId = (session.user as any).id
  if (!userId) {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!dbUser) throw new Error("User not found.")
    userId = dbUser.id
  }
  
  // Create an address first
  const address = await prisma.address.create({
    data: {
      userId,
      fullAddress: `${data.address}, ${data.city}, ${data.state} - ${data.zipCode}`,
      country: "India",
      isDefault: true
    }
  })
  
  // Create the order and items
  const order = await prisma.order.create({
    data: {
      userId,
      addressId: address.id,
      totalAmount: total,
      paymentMethod: data.paymentMethod.toUpperCase(),
      paymentStatus: data.paymentMethod === "cod" ? "PENDING" : "COMPLETED",
      status: "PROCESSING",
      items: {
        create: items.map(item => ({
          productName: item.name,
          image: item.image || null,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  })
  
  revalidatePath("/dashboard")
  
  return order
}

export async function getUserOrders() {
  const session = await auth()
  if (!session?.user?.email) return []
  
  let userId = (session.user as any).id
  if (!userId) {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!dbUser) return []
    userId = dbUser.id
  }
  
  const orders = await prisma.order.findMany({
    where: { userId: userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  })
  
  return orders
}
