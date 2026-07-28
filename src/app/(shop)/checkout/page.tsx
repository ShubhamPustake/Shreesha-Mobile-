"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ShieldCheck, Truck, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cartStore"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createOrder } from "@/actions/orders"

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(6, "Valid Zip Code required"),
  paymentMethod: z.enum(["upi", "card", "cod"]),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
    }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsPlacingOrder(true)
    try {
      await createOrder(data, items, total)
      
      toast.success("Order Placed Successfully!", {
        description: "Thank you for shopping with Shreesha Mobile.",
      })
      
      clearCart()
      router.push("/dashboard")
    } catch (error: any) {
      toast.error("Failed to place order", {
        description: error.message || "Please make sure you are logged in."
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (!mounted) return null // Prevent hydration mismatch

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-muted-foreground mb-8">Your cart is empty. Please add items to proceed.</p>
        <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
      </div>
    )
  }

  const subtotal = getTotal()
  const shipping = subtotal > 5000 ? 0 : 150
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Form */}
        <div className="flex-1 space-y-8">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Info */}
            <Card className="border-border/50 shadow-sm glass-panel">
              <CardHeader>
                <CardTitle>1. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input placeholder="Full Name" {...register("fullName")} />
                  {errors.fullName && <span className="text-destructive text-xs mt-1">{errors.fullName.message}</span>}
                </div>
                <div>
                  <Input type="email" placeholder="Email Address" {...register("email")} />
                  {errors.email && <span className="text-destructive text-xs mt-1">{errors.email.message}</span>}
                </div>
                <div className="md:col-span-2">
                  <Input type="tel" placeholder="Phone Number" {...register("phone")} />
                  {errors.phone && <span className="text-destructive text-xs mt-1">{errors.phone.message}</span>}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-border/50 shadow-sm glass-panel">
              <CardHeader>
                <CardTitle>2. Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input placeholder="Street Address" {...register("address")} />
                  {errors.address && <span className="text-destructive text-xs mt-1">{errors.address.message}</span>}
                </div>
                <div>
                  <Input placeholder="City" {...register("city")} />
                  {errors.city && <span className="text-destructive text-xs mt-1">{errors.city.message}</span>}
                </div>
                <div>
                  <Input placeholder="State" {...register("state")} />
                  {errors.state && <span className="text-destructive text-xs mt-1">{errors.state.message}</span>}
                </div>
                <div>
                  <Input placeholder="Zip Code" {...register("zipCode")} />
                  {errors.zipCode && <span className="text-destructive text-xs mt-1">{errors.zipCode.message}</span>}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-border/50 shadow-sm glass-panel">
              <CardHeader>
                <CardTitle>3. Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="radio" value="upi" {...register("paymentMethod")} className="text-primary focus:ring-primary" />
                    <span className="font-medium">UPI (GPay, PhonePe, Paytm)</span>
                  </div>
                </label>
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="radio" value="card" {...register("paymentMethod")} className="text-primary focus:ring-primary" />
                    <span className="font-medium">Credit / Debit Card</span>
                  </div>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </label>
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="radio" value="cod" {...register("paymentMethod")} className="text-primary focus:ring-primary" />
                    <span className="font-medium">Cash on Delivery (COD)</span>
                  </div>
                </label>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Right Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-24 space-y-4">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4 text-sm">
                      <div className="flex gap-3">
                        <div className="h-12 w-12 bg-muted rounded border border-border/50 flex-shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {item.image && <img src={item.image} alt={item.name} className="object-cover w-full h-full" />}
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center text-lg font-bold mb-6">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>

                <Button type="submit" form="checkout-form" size="lg" className="w-full text-md" disabled={isPlacingOrder}>
                  {isPlacingOrder ? "Processing..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground pt-4">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>100% Secure & Encrypted Payment</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
