"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { requestPasswordReset } from "@/actions/auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("email", email)
      
      const res = await requestPasswordReset(formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        setIsSuccess(true)
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card glass-panel rounded-2xl border border-border/50 p-8 shadow-xl">
        <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your registered email address and we'll send you a link to reset your password.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 ml-1" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Check your email</h3>
            <p className="text-muted-foreground text-sm">
              If an account exists with {email}, a password reset link has been sent to it. (Check your server console for the link during development).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="email"
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10" 
                  required 
                  autoComplete="email"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending Link..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
