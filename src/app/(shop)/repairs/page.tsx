"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Wrench, MapPin, Store, Calendar, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const repairSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  issue: z.string().min(10, "Please describe the issue in at least 10 characters"),
  imei: z.string().optional(),
  passcode: z.string().optional(),
  photo: z.any().optional(),
  serviceType: z.enum(["store", "pickup"]),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email address"),
  address: z.string().optional(),
  preferredDate: z.string().min(1, "Preferred date is required"),
}).superRefine((data, ctx) => {
  if (data.serviceType === "pickup" && (!data.address || data.address.length < 5)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Address is required for Pickup service",
      path: ["address"],
    });
  }
})

type RepairFormValues = z.infer<typeof repairSchema>

export default function RepairBookingPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RepairFormValues>({
    resolver: zodResolver(repairSchema),
    defaultValues: {
      serviceType: "store",
    }
  })

  const serviceType = watch("serviceType")

  const onSubmit = (data: RepairFormValues) => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log("Repair Booking Data:", data)
      toast.success("Repair Booked Successfully!", {
        description: "Your Tracking ID is SRX-8924. We will contact you shortly.",
      })
      setIsSubmitting(false)
      router.push("/track?id=SRX-8924")
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Book a Repair</h1>
        <p className="text-lg text-muted-foreground">Expert technicians, genuine parts, and quick turnaround times.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Device Details */}
        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /> Device Details</CardTitle>
            <CardDescription>Tell us about your device and the issues you're facing.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand *</label>
              <select 
                {...register("brand")} 
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="">Select a brand</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="OnePlus">OnePlus</option>
                <option value="Xiaomi">Xiaomi / Poco / Redmi</option>
                <option value="Vivo">Vivo / iQOO</option>
                <option value="Oppo">Oppo</option>
                <option value="Realme">Realme</option>
                <option value="Google">Google Pixel</option>
                <option value="Nothing">Nothing</option>
                <option value="Motorola">Motorola</option>
                <option value="Other">Other Brand</option>
              </select>
              {errors.brand && <p className="text-destructive text-xs">{errors.brand.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Model *</label>
              <Input {...register("model")} />
              {errors.model && <p className="text-destructive text-xs">{errors.model.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Describe the Issue *</label>
              <Textarea 
                className="min-h-[100px]"
                {...register("issue")} 
              />
              {errors.issue && <p className="text-destructive text-xs">{errors.issue.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">IMEI Number (Optional)</label>
              <Input {...register("imei")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Device Passcode (Optional)</label>
              <Input {...register("passcode")} type="password" />
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <ShieldCheck className="h-3 w-3" /> Encrypted & secure
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Upload Device Photo (Optional)
              </label>
              <Input type="file" accept="image/*" {...register("photo")} className="cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-primary/20 transition-all" />
              <p className="text-xs text-muted-foreground">Upload a photo showing the device's current condition or damage.</p>
            </div>
          </CardContent>
        </Card>

        {/* Service Type */}
        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle>Service Preference</CardTitle>
            <CardDescription>How would you like to get your device serviced?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center text-center gap-3 transition-all ${serviceType === 'store' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                <input type="radio" value="store" className="sr-only" {...register("serviceType")} />
                <Store className={`h-8 w-8 ${serviceType === 'store' ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <h4 className="font-semibold">Visit Store</h4>
                  <p className="text-xs text-muted-foreground mt-1">Drop off at our repair center</p>
                </div>
              </label>

              <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center text-center gap-3 transition-all ${serviceType === 'pickup' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                <input type="radio" value="pickup" className="sr-only" {...register("serviceType")} />
                <MapPin className={`h-8 w-8 ${serviceType === 'pickup' ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <h4 className="font-semibold">Pickup & Drop</h4>
                  <p className="text-xs text-muted-foreground mt-1">We collect, repair, and deliver (+₹150)</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input {...register("fullName")} />
              {errors.fullName && <p className="text-destructive text-xs">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number *</label>
              <Input {...register("phone")} />
              {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address *</label>
              <Input type="email" {...register("email")} />
              {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Date *</label>
              <div className="relative">
                <Input type="date" {...register("preferredDate")} className="pl-10" />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.preferredDate && <p className="text-destructive text-xs">{errors.preferredDate.message}</p>}
            </div>
            
            {serviceType === 'pickup' && (
              <div className="space-y-2 md:col-span-2">
                <Separator className="my-2" />
                <label className="text-sm font-medium">Full Address *</label>
                <Textarea 
                  className="min-h-[80px]"
                  {...register("address")} 
                />
                {errors.address && <p className="text-destructive text-xs">{errors.address.message}</p>}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="w-full md:w-auto text-lg px-12" disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "Book Repair"}
          </Button>
        </div>

      </form>
    </div>
  )
}
