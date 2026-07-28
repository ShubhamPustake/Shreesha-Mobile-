"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Lock, Mail, User, Phone, MapPin } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loginAction, registerAction } from "@/actions/auth"

function LoginSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full mt-6" disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  )
}

function RegisterSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full mt-6" disabled={pending}>
      {pending ? "Creating account..." : "Create Account"}
    </Button>
  )
}

export default function CustomerLoginPage() {
  const [loginError, setLoginError] = useState<string | null>(null)
  const [registerError, setRegisterError] = useState<string | null>(null)

  async function handleLogin(formData: FormData) {
    setLoginError(null)
    const result = await loginAction(formData, "/")
    if (result?.error) {
      setLoginError(result.error)
    }
  }

  async function handleRegister(formData: FormData) {
    setRegisterError(null)
    const result = await registerAction(formData)
    if (result?.error) {
      setRegisterError(result.error)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card glass-panel rounded-2xl border border-border/50 p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Welcome to Shreesha Mobile</h1>
          <p className="text-muted-foreground mt-2">Sign in to track repairs and manage orders</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form action={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="email"
                    type="email" 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <PasswordInput 
                    name="password"
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>

              {loginError && <p className="text-sm text-destructive font-medium text-center">{loginError}</p>}

              <LoginSubmitButton />
              
              <div className="text-center mt-4">
                <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form action={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="name"
                    type="text" 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="email"
                    type="email" 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <PasswordInput 
                    name="password"
                    className="pl-10" 
                    required 
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="contact"
                    type="text" 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Full Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="fullAddress"
                    type="text" 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>

              {registerError && <p className="text-sm text-destructive font-medium text-center">{registerError}</p>}

              <RegisterSubmitButton />
            </form>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}
