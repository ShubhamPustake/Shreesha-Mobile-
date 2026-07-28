"use server"

import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function getUserRepairs() {
  const session = await auth()
  if (!session?.user?.email) return []
  
  let userId = (session.user as any).id
  if (!userId) {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!dbUser) return []
    userId = dbUser.id
  }
  
  const repairs = await prisma.repair.findMany({
    where: { customerId: userId },
    include: { statusLogs: true },
    orderBy: { createdAt: 'desc' }
  })
  
  return repairs
}

import { revalidatePath } from "next/cache"

export async function bookRepair(data: any) {
  const session = await auth()
  
  // Find or create customer
  let userId = session?.user ? (session.user as any).id : null
  
  if (session?.user?.email && !userId) {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (dbUser) userId = dbUser.id
  }
  
  if (!userId) {
    throw new Error("You must be logged in to book a repair online. Please login first.")
  }

  // Update the user's profile with the details provided in the repair form
  if (data.fullName || data.phone) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.fullName && { name: data.fullName }),
        ...(data.phone && { contact: data.phone })
      }
    })
  }

  const repair = await prisma.repair.create({
    data: {
      customerId: userId,
      deviceBrand: data.brand,
      deviceModel: data.model,
      imei: data.imei || null,
      issue: data.issue,
      pickupRequired: data.serviceType === "pickup",
      preferredDate: new Date(data.preferredDate),
      statusLogs: {
        create: {
          status: "BOOKED",
          note: "Repair booked online by customer."
        }
      }
    }
  })

  revalidatePath("/dashboard")
  return repair
}

export async function getRepairJobs() {
  const jobs = await prisma.repair.findMany({
    include: {
      customer: true
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return jobs.map(job => ({
    id: job.id,
    device: `${job.deviceBrand} ${job.deviceModel}`,
    issue: job.issue,
    customer: job.customer.name || "Unknown",
    customerPhone: job.customer.contact || "",
    date: job.createdAt.toLocaleDateString(),
    status: job.status.toLowerCase(),
    serviceType: job.pickupRequired ? "Pickup & Drop" : "Store Visit",
    location: "-" // Add location to Address model if needed
  }))
}

export async function getRepairJobById(input: string) {
  const job = await prisma.repair.findFirst({
    where: { 
      OR: [
        { id: input },
        { customer: { contact: { contains: input } } },
        { customer: { name: { contains: input, mode: 'insensitive' } } },
        { deviceModel: { contains: input, mode: 'insensitive' } },
        { deviceBrand: { contains: input, mode: 'insensitive' } }
      ]
    },
    include: { customer: true, statusLogs: true },
    orderBy: { createdAt: 'desc' }
  })
  
  if (!job) return null
  
  return {
    id: job.id,
    device: `${job.deviceBrand} ${job.deviceModel}`,
    issue: job.issue,
    customer: job.customer.name || "Unknown",
    customerPhone: job.customer.contact || "-",
    date: job.createdAt.toLocaleDateString(),
    status: job.status.toLowerCase(),
    serviceType: job.pickupRequired ? "Pickup & Drop" : "Store Visit",
    logs: job.statusLogs
  }
}
