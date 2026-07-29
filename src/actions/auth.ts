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
          const causeMsg = error.cause?.err?.message || error.cause?.message || String(error.cause) || "Unknown internal error";
          return { error: `Auth Error [${error.type}]: ${causeMsg}` }
      }
    }
    throw error
  }
}

import crypto from "crypto"

export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
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
        password: await bcrypt.hash(password, 10),
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

export async function requestPasswordReset(formData: FormData) {
  try {
    const email = formData.get("email") as string
    if (!email) return { error: "Email is required." }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // For security, don't reveal if email exists, just return success
      return { success: true }
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    // Save token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    })

    // Simulate Email Sending
    console.log(`
      \n======================================================
      [SIMULATED EMAIL]
      To: ${email}
      Subject: Password Reset Request
      
      Click the link below to reset your password:
      http://localhost:3000/reset-password?token=${token}
      ======================================================\n
    `)

    return { success: true }
  } catch (error) {
    console.error("Password reset request error:", error)
    return { error: "Failed to request password reset." }
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const token = formData.get("token") as string
    const password = formData.get("password") as string
    
    if (!token || !password) return { error: "Missing required fields." }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token }
    })

    if (!verificationToken || verificationToken.expires < new Date()) {
      return { error: "Invalid or expired reset token." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { password: hashedPassword }
    })

    // Cleanup token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token
        }
      }
    })

    // Auto-login
    await signIn("credentials", { 
      email: verificationToken.identifier, 
      password, 
      redirectTo: "/dashboard" 
    })

    return { success: true }
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error && (error as any).digest.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error("Reset password error:", error)
    return { error: "Failed to reset password." }
  }
}
