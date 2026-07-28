import Link from "next/link"
import { ArrowRight, Smartphone, Headphones, Wrench, ShieldCheck, Truck, Zap, Star } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const FEATURED_PRODUCTS = [
  { id: "1", name: "iPhone 15 Pro Max", price: 159900, category: "Mobiles", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop" },
  { id: "2", name: "Samsung Galaxy S24 Ultra", price: 129999, category: "Mobiles", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop" },
  { id: "3", name: "Sony WH-1000XM5", price: 29990, category: "Accessories", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop" },
  { id: "4", name: "Apple AirPods Pro (2nd Gen)", price: 24900, category: "Accessories", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop" },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0" />
        <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-8 mx-auto">
          <Badge variant="outline" className="px-3 py-1 border-primary/50 text-primary bg-primary/10 backdrop-blur-sm">
            Welcome to Shreesha Mobile
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-4xl">
            Your Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Mobile Store</span> & Repair Center
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Premium smartphones, authentic accessories, and expert repair services all in one place. Experience the best in mobile technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/products" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto text-md" })}>
              Shop Mobiles
            </Link>
            <Link href="/repairs" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto text-md glass" })}>
              Book a Repair
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Shop by Category</h2>
              <p className="text-muted-foreground">Find exactly what you are looking for.</p>
            </div>
            <Link href="/products" className={buttonVariants({ variant: "ghost", className: "hidden md:flex" })}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/products?category=mobiles">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group glass-panel">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Smartphone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Smartphones</h3>
                  <p className="text-sm text-muted-foreground text-center mt-2">Latest Apple, Samsung & more</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/products?category=accessories">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group glass-panel">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Headphones className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Accessories</h3>
                  <p className="text-sm text-muted-foreground text-center mt-2">Cases, chargers, audio & more</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/repairs">
              <Card className="hover:border-accent/50 transition-colors cursor-pointer group glass-panel">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Wrench className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">Repairs</h3>
                  <p className="text-sm text-muted-foreground text-center mt-2">Screen, battery, motherboard</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/products?category=spare-parts">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group glass-panel">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Spare Parts</h3>
                  <p className="text-sm text-muted-foreground text-center mt-2">Original OEM replacement parts</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-10 text-center">Featured Deals</h2>
          <Carousel className="w-full max-w-5xl mx-auto" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-4">
              {FEATURED_PRODUCTS.map((product) => (
                <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden border-border/50 h-full flex flex-col">
                    <div className="aspect-square bg-muted relative overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">Hot Deal</Badge>
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                        <Link href={`/products/${product.id}`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
                          View Details
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-black text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Why Choose Shreesha Mobile?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6 glass-panel border-white/20 bg-white/5 rounded-2xl">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Genuine Products</h3>
              <p className="text-white/80">100% authentic products with brand warranty and guaranteed quality.</p>
            </div>
            <div className="flex flex-col items-center p-6 glass-panel border-white/20 bg-white/5 rounded-2xl">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <Wrench className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Technicians</h3>
              <p className="text-white/80">Certified professionals handling your device with utmost care and precision.</p>
            </div>
            <div className="flex flex-col items-center p-6 glass-panel border-white/20 bg-white/5 rounded-2xl">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast Repairs</h3>
              <p className="text-white/80">Most repairs are completed within 24 hours to get you back connected quickly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-background/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what some of our valued customers have to say about their experience with Shreesha Mobile.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <Card className="glass-panel border-border/50">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="italic text-muted-foreground mb-6 line-clamp-4">
                  "Absolutely brilliant service! My phone screen was completely shattered and they replaced it within a few hours. The pricing was completely transparent and the staff were incredibly helpful. Highly recommend Shreesha Mobile!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    AR
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Aditya Rao</h4>
                    <p className="text-xs text-muted-foreground">Screen Replacement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review 2 */}
            <Card className="glass-panel border-border/50">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="italic text-muted-foreground mb-6 line-clamp-4">
                  "I was looking for genuine parts to upgrade my older model smartphone and Shreesha Mobile had exactly what I needed. The whole process was seamless and the part works perfectly. Great inventory!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    SM
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Sneha Mishra</h4>
                    <p className="text-xs text-muted-foreground">Parts Purchase</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review 3 */}
            <Card className="glass-panel border-border/50">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="italic text-muted-foreground mb-6 line-clamp-4">
                  "The battery on my phone was dying too fast, so I brought it in. The expert technicians quickly diagnosed the issue and replaced the battery. The device feels like it's brand new again."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    VK
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Varun Kumar</h4>
                    <p className="text-xs text-muted-foreground">Battery Replacement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  )
}
