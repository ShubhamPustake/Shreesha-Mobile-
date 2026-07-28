"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Lock, Mail, ShieldAlert } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { loginAction } from "@/actions/auth"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white" disabled={pending}>
      {pending ? "Authenticating..." : "Secure Login"}
    </Button>
  )
}

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)

  async function action(formData: FormData) {
    setError(null)
    const result = await loginAction(formData, "/admin")
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="text-center mb-8 mt-2">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff Portal</h1>
          <p className="text-slate-500 mt-2 text-sm">Shreesha Mobile ERP Backend</p>
        </div>

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                name="email"
                type="email" 
                placeholder="admin@shreeshamobile.com" 
                className="pl-10 bg-slate-50 border-slate-200" 
                required 
                defaultValue="admin@shreeshamobile.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
              <PasswordInput 
                name="password"
                placeholder="••••••••" 
                className="pl-10 bg-slate-50 border-slate-200" 
                required 
                defaultValue="password123"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm text-red-600 font-medium text-center">{error}</p>
            </div>
          )}

          <SubmitButton />
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500 mb-4">Are you a customer?</p>
          <Link href="/login" className={buttonVariants({ variant: "outline", className: "w-full" })}>
            Login as Customer
          </Link>
        </div>
      </div>
    </div>
  )
}
