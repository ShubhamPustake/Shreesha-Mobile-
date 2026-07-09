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
    return { success: false, error: error.message || "Failed to create customer" }
  }
}
