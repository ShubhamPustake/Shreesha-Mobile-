"use client"

import Link from "next/link"
import { ArrowRight, Smartphone, Headphones, Wrench, ShieldCheck, Zap, Star, Sparkles, ChevronRight } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { motion, Variants } from "framer-motion"

const FEATURED_PRODUCTS = [
  { id: "1", name: "iPhone 15 Pro Max", price: 159900, category: "Mobiles", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop" },
  { id: "2", name: "Samsung Galaxy S24 Ultra", price: 129999, category: "Mobiles", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop" },
  { id: "3", name: "Sony WH-1000XM5", price: 29990, category: "Accessories", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop" },
  { id: "4", name: "Apple AirPods Pro (2nd Gen)", price: 24900, category: "Accessories", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop" },
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
        {/* Dynamic Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 z-0 animate-pulse" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] opacity-60 z-0" />

        <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-10 mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="px-4 py-2 border-primary/30 text-primary bg-primary/10 backdrop-blur-md rounded-full text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
              <Sparkles className="w-4 h-4" /> Welcome to the Future of Mobile
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter max-w-5xl leading-tight"
          >
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x bg-[length:200%_auto]">Mobile Lifestyle</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto max-w-[700px] text-muted-foreground md:text-2xl font-light"
          >
            Premium smartphones, authentic accessories, and certified repair services designed to keep you seamlessly connected.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4"
          >
            <Link href="/products" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_40px_rgba(var(--primary),0.5)] transition-all group" })}>
              Explore Devices <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/repairs" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto text-lg h-14 px-8 rounded-full glass-panel hover:bg-white/10 transition-colors border-white/20" })}>
              <Wrench className="mr-2 h-5 w-5" /> Book a Repair
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-32 relative z-10">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Shop by Category</h2>
              <p className="text-xl text-muted-foreground">Discover exactly what you're looking for.</p>
            </div>
            <Link href="/products" className="group flex items-center text-primary font-medium text-lg hover:underline underline-offset-4">
              View All Categories <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { href: "/products?category=mobiles", icon: Smartphone, title: "Smartphones", desc: "Apple, Samsung & more", color: "from-blue-500/20 to-purple-500/20", iconColor: "text-blue-500" },
              { href: "/products?category=accessories", icon: Headphones, title: "Accessories", desc: "Cases, audio & power", color: "from-pink-500/20 to-orange-500/20", iconColor: "text-pink-500" },
              { href: "/repairs", icon: Wrench, title: "Repairs", desc: "Screen & battery replacement", color: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-500" },
              { href: "/products?category=spare-parts", icon: ShieldCheck, title: "Spare Parts", desc: "Original OEM parts", color: "from-amber-500/20 to-red-500/20", iconColor: "text-amber-500" }
            ].map((cat, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href={cat.href} className="block h-full">
                  <Card className="h-full border-border/40 hover:border-primary/50 transition-colors cursor-pointer group glass-panel overflow-hidden relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <CardContent className="flex flex-col items-center justify-center p-10 relative z-10">
                      <div className="h-20 w-20 rounded-2xl bg-background/80 shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <cat.icon className={`h-10 w-10 ${cat.iconColor}`} />
                      </div>
                      <h3 className="font-bold text-2xl mb-2">{cat.title}</h3>
                      <p className="text-muted-foreground text-center">{cat.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-32 bg-muted/30 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Featured Deals</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Hand-picked premium devices at unbeatable prices.</p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <Carousel className="w-full max-w-6xl mx-auto" opts={{ align: "start", loop: true }}>
              <CarouselContent className="-ml-4 md:-ml-6">
                {FEATURED_PRODUCTS.map((product) => (
                  <CarouselItem key={product.id} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="overflow-hidden border-border/40 h-full flex flex-col glass-panel group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:border-primary/50 transition-all duration-300">
                        <div className="aspect-[4/3] bg-card relative overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Badge className="absolute top-4 left-4 bg-accent/90 text-accent-foreground backdrop-blur-md shadow-lg border-0">Hot Deal</Badge>
                        </div>
                        <CardContent className="p-6 flex-1 flex flex-col relative z-10 bg-card/50 backdrop-blur-sm">
                          <p className="text-sm font-medium text-primary mb-2">{product.category}</p>
                          <h3 className="font-bold text-xl mb-4 line-clamp-2">{product.name}</h3>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="font-extrabold text-2xl tracking-tight">₹{product.price.toLocaleString()}</span>
                            <Link href={`/products/${product.id}`} className={buttonVariants({ variant: "default", className: "rounded-full shadow-md" })}>
                              View
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 h-12 w-12 rounded-full glass border-border/50" />
              <CarouselNext className="hidden md:flex -right-12 h-12 w-12 rounded-full glass border-border/50" />
            </Carousel>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent z-0 opacity-50" />
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">The Shreesha Standard</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">Experience service that goes above and beyond expectations.</p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: ShieldCheck, title: "Genuine Assured", desc: "100% authentic products with brand warranty and guaranteed quality." },
              { icon: Wrench, title: "Master Technicians", desc: "Certified professionals handling your device with utmost precision." },
              { icon: Zap, title: "Lightning Fast", desc: "Most repairs are completed within 24 hours to get you back connected." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -10 }} className="flex flex-col items-center p-10 glass-panel border-white/10 bg-white/5 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/70 text-lg leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-32 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. See what our community has to say.
            </p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Aditya Rao", type: "Screen Replacement", text: "Absolutely brilliant service! My phone screen was completely shattered and they replaced it within a few hours. The pricing was completely transparent.", init: "AR" },
              { name: "Sneha Mishra", type: "Parts Purchase", text: "I was looking for genuine parts to upgrade my older model smartphone and Shreesha Mobile had exactly what I needed. Seamless experience.", init: "SM" },
              { name: "Varun Kumar", type: "Battery Replacement", text: "The battery on my phone was dying too fast. The expert technicians quickly diagnosed the issue and replaced the battery. Feels brand new.", init: "VK" }
            ].map((review, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -5 }}>
                <Card className="glass-panel border-border/40 h-full hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex gap-1 mb-6 text-yellow-500">
                      {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 fill-current" />)}
                    </div>
                    <p className="text-lg italic text-muted-foreground mb-8 flex-1 leading-relaxed">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/40">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white shadow-md">
                        {review.init}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{review.name}</h4>
                        <p className="text-sm text-primary font-medium">{review.type}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  )
}
