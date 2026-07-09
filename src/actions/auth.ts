"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

export async function loginAction(formData: FormData, redirectTo: string = "/") {
  try {
    await signIn("credentials", { ...Object.fromEntries(formData), redirectTo })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
        default:
          return { error: "Something went wrong." }
      }
    }
    throw error
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function registerAction(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const contact = formData.get("contact") as string
    const fullAddress = formData.get("fullAddress") as string

    if (!name || !email || !password || !contact || !fullAddress) {
      return { error: "All fields are required." }
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { error: "An account with this email already exists." }
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password, // In production, hash this with bcrypt
        contact,
        role: "CUSTOMER",
        addresses: {
          create: {
            fullAddress,
            isDefault: true
          }
        }
      }
    })

    // Log them in immediately after registration
    await signIn("credentials", { email, password, redirectTo: "/" })
    
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Something went wrong during auto-login." }
    }
    // Rethrow redirect errors from Next.js (signIn uses Next.js redirect)
    if (error && typeof error === 'object' && 'digest' in error && (error as any).digest.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error("Registration error:", error)
    return { error: "Failed to register account." }
  }
}
