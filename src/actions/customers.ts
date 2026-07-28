"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function getCustomers() {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: { addresses: true },
      orderBy: { createdAt: "desc" }
    })
    
    return customers.map(c => ({
      id: c.id,
      name: c.name || "Unknown",
      email: c.email || "No Email",
      contact: c.contact || "N/A",
      createdAt: c.createdAt.toISOString(),
      address: c.addresses[0] ? c.addresses[0].fullAddress : "No Address"
    }))
  } catch (error) {
    console.error("Failed to fetch customers:", error)
    return []
  }
}

export async function addCustomer(data: {
  name: string
  email: string
  contact: string
  fullAddress: string
}) {
  try {
    // Basic hash just for placeholder
    const hashedPassword = await bcrypt.hash(data.contact || "password123", 10)

    const newCustomer = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        contact: data.contact,
        password: hashedPassword,
        role: "CUSTOMER",
        addresses: {
          create: {
            fullAddress: data.fullAddress,
            isDefault: true
          }
        }
      }
    })

    revalidatePath("/admin/customers")
    return { success: true, customerId: newCustomer.id }
  } catch (error: any) {
    console.error("Failed to add customer:", error)
    if (error.code === 'P2002') {
      return { error: "A user with this email or contact already exists." }
    }
    return { success: false, error: error.message || "Failed to create customer" }
  }
}

export async function updateCustomer(id: string, data: {
  name: string
  email: string
  contact: string
  fullAddress: string
}) {
  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        contact: data.contact,
      }
    })
    
    // Manual address upsert
    const user = await prisma.user.findUnique({ where: { id }, include: { addresses: true } })
    if (user?.addresses && user.addresses.length > 0) {
      await prisma.address.update({
        where: { id: user.addresses[0].id },
        data: { fullAddress: data.fullAddress }
      })
    } else {
      await prisma.address.create({
        data: {
          userId: id,
          fullAddress: data.fullAddress,
          isDefault: true
        }
      })
    }

    revalidatePath("/admin/customers")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to update customer:", error)
    if (error.code === 'P2002') {
      return { error: "A user with this email or contact already exists." }
    }
    return { error: "Failed to update customer." }
  }
}

export async function deleteCustomer(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { _count: { select: { orders: true, repairs: true } } }
    })

    if (user && (user._count.orders > 0 || user._count.repairs > 0)) {
      return { error: "Cannot delete customer with existing orders or repairs." }
    }

    await prisma.user.delete({
      where: { id }
    })

    revalidatePath("/admin/customers")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete customer:", error)
    return { error: "Failed to delete customer." }
  }
}
