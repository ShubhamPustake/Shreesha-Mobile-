"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function addFeedback(data: { rating: number; comment: string }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    if (!data.comment.trim() || data.rating < 1 || data.rating > 5) {
      return { error: "Invalid feedback data." }
    }

    await prisma.feedback.create({
      data: {
        userId: session.user.id,
        rating: data.rating,
        comment: data.comment,
        status: "PENDING",
      }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to add feedback:", error)
    return { error: "Failed to submit feedback." }
  }
}

export async function getUserFeedback() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return []
    }

    const feedbacks = await prisma.feedback.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    })

    return feedbacks
  } catch (error) {
    console.error("Failed to get user feedback:", error)
    return []
  }
}

export async function getAllFeedback() {
  try {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "STORE_MANAGER") {
      return { error: "Unauthorized" }
    }

    const feedbacks = await prisma.feedback.findMany({
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    return { feedbacks }
  } catch (error) {
    console.error("Failed to fetch feedbacks:", error)
    return { error: "Failed to load feedbacks." }
  }
}

export async function updateFeedbackStatus(id: string, status: string) {
  try {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "STORE_MANAGER") {
      return { error: "Unauthorized" }
    }

    await prisma.feedback.update({
      where: { id },
      data: { status }
    })

    revalidatePath("/admin/feedback")
    return { success: true }
  } catch (error) {
    console.error("Failed to update feedback status:", error)
    return { error: "Failed to update status." }
  }
}
