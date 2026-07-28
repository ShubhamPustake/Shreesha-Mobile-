"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { toast } from "sonner"
import { resetPassword } from "@/actions/auth"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      toast.error("Invalid or missing reset token")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("token", token)
      formData.append("password", password)
      
      const res = await resetPassword(formData)
      if (res?.error) {
        toast.error(res.error)
      } else {
        setIsSuccess(true)
      }
    } catch (error) {
      // The Next.js redirect thrown by signIn will be caught here, but signIn shouldn't throw if it works. 
      // Actually, signIn throws a redirect error to /dashboard.
      // We can let the browser handle it, but wait, the catch block intercepts the redirect.
      // Let's check if the error is a NEXT_REDIRECT.
      if (error && typeof error === 'object' && 'digest' in error && (error as any).digest.startsWith('NEXT_REDIRECT')) {
        // It's a successful redirect to dashboard
        toast.success("Password reset successfully! Logging you in...")
        return
      }
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Password Reset Successful</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Your password has been securely updated. You are being redirected to your dashboard...
        </p>
        <Link href="/dashboard" className="text-primary hover:underline font-medium">
          Go to Dashboard Manually
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
          <PasswordInput 
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="pl-10" 
            required 
            minLength={6}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Confirm New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
          <PasswordInput 
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="pl-10" 
            required 
            minLength={6}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card glass-panel rounded-2xl border border-border/50 p-8 shadow-xl">
        <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Set New Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your new secure password below to regain access to your account.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading secure form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
