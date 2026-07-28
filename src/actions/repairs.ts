"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
        { customer: { contact: input } },
        { customer: { name: { contains: input } } } // Allow fuzzy search by name
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
