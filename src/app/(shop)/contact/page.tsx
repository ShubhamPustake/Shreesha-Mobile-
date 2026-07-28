"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from "lucide-react"

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate network request
    await new Promise(r => setTimeout(r, 1500))
    
    toast.success("Message sent successfully! We will get back to you soon.")
    setLoading(false)
    ;(e.target as HTMLFormElement).reset()
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Store",
      details: "Navi peth Mayani - 415102, Maharashtra, India",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 7773922423",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "shreeshamobile@gmail.com",
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    {
      icon: Clock,
      title: "Opening Hours",
      details: "Mon - Sat: 9:00 AM - 9:00 PM\nSunday: Closed",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-card pt-16 pb-32 border-b dark:border-neutral-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6"
          >
            <Sparkles className="h-4 w-4" /> Let's Connect
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6"
          >
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Touch</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
          >
            Have a question about a product, repair, or need support? Our team is here to help you with anything you need.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-4">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                className="bg-card p-6 rounded-2xl shadow-sm border dark:border-neutral-800 flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 whitespace-pre-line">{item.details}</p>
                </div>
              </motion.div>
            ))}

            <motion.a
              href="https://www.instagram.com/shreeshamob19"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 p-[1px] rounded-2xl block hover:scale-[1.02] transition-transform"
            >
              <div className="bg-card p-6 rounded-[15px] flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-rose-500 group-hover:scale-110 transition-transform">
                    <InstagramIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Follow Us</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">@shreeshamob19</p>
                  </div>
                </div>
                <div className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  &rarr;
                </div>
              </div>
            </motion.a>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-card p-8 rounded-3xl shadow-lg border dark:border-neutral-800"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Send us a Message</h2>
              <p className="text-neutral-600 dark:text-neutral-400">Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required className="bg-neutral-50 dark:bg-neutral-950/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required className="bg-neutral-50 dark:bg-neutral-950/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required className="bg-neutral-50 dark:bg-neutral-950/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" className="bg-neutral-50 dark:bg-neutral-950/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required className="bg-neutral-50 dark:bg-neutral-950/50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  required 
                  className="min-h-[150px] bg-neutral-50 dark:bg-neutral-950/50 resize-none" 
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base gap-2"
              >
                {loading ? "Sending..." : (
                  <>
                    Send Message <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
