"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useCartStore } from "@/store/cartStore"

// Same mock data for demonstration
const PRODUCTS = [
  { id: "1", name: "iPhone 15 Pro Max", price: 159900, category: "Mobiles", brand: "Apple", stock: 12, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop", description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever." },
  { id: "2", name: "Samsung Galaxy S24 Ultra", price: 129999, category: "Mobiles", brand: "Samsung", stock: 8, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop", description: "Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. It's an absolute marvel of design." },
  { id: "3", name: "Sony WH-1000XM5", price: 29990, category: "Accessories", brand: "Sony", stock: 15, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop", description: "Industry-leading noise cancellation headphones with Auto NC Optimizer, crystal clear hands-free calling, and up to 30 hours of battery life." },
]

export default function ProductDetailsPage() {
  const { id } = useParams()
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0] // fallback for demo
  const [selectedColor, setSelectedColor] = useState("Natural Titanium")
  const [selectedStorage, setSelectedStorage] = useState("256GB")
  const [quantity, setQuantity] = useState(1)
  
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedColor}-${selectedStorage}`,
      productId: product.id,
      name: `${product.name} (${selectedStorage}, ${selectedColor})`,
      price: product.price,
      quantity: quantity,
      image: product.image,
    })
    toast.success("Added to Cart", {
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden border border-border/50 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button variant="secondary" size="icon" className="rounded-full shadow-sm bg-background/80 backdrop-blur-md">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full shadow-sm bg-background/80 backdrop-blur-md">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <button key={i} className={`h-24 w-24 flex-shrink-0 bg-muted rounded-xl border-2 overflow-hidden ${i === 1 ? 'border-primary' : 'border-transparent'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt="Thumbnail" className="object-cover w-full h-full opacity-80 hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <Badge className="w-fit mb-3 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            {product.brand}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          <div className="text-3xl font-bold mb-6">
            ₹{product.price.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground ml-2">Inclusive of all taxes</span>
          </div>

          <Separator className="mb-6" />

          {/* Variants (Mock implementation based on category) */}
          {product.category === "Mobiles" && (
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-medium mb-3">Storage</h3>
                <div className="flex flex-wrap gap-3">
                  {["256GB", "512GB", "1TB"].map((storage) => (
                    <button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedStorage === storage
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Color: <span className="text-muted-foreground font-normal">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 w-10 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-primary scale-110"
                          : "border-transparent ring-1 ring-border"
                      }`}
                      style={{
                        backgroundColor: color.split(" ")[0].toLowerCase() === "natural" ? "#b5b6b1" 
                          : color.split(" ")[0].toLowerCase() === "blue" ? "#344255" 
                          : color.split(" ")[0].toLowerCase() === "white" ? "#f2f1ec" 
                          : "#3d3c3a"
                      }}
                    >
                      {selectedColor === color && <Check className="h-4 w-4 mx-auto text-white mix-blend-difference" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border rounded-lg h-12">
              <button 
                className="px-4 text-muted-foreground hover:text-foreground"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >-</button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button 
                className="px-4 text-muted-foreground hover:text-foreground"
                onClick={() => setQuantity(quantity + 1)}
              >+</button>
            </div>
            <Button size="lg" className="flex-1 h-12 text-md" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h4 className="font-medium text-sm">1 Year Warranty</h4>
                <p className="text-xs text-muted-foreground">Brand warranty included</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <RotateCcw className="h-6 w-6 text-primary" />
              <div>
                <h4 className="font-medium text-sm">7 Days Replacement</h4>
                <p className="text-xs text-muted-foreground">If defect is found</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 sm:col-span-2">
              <Truck className="h-6 w-6 text-primary" />
              <div>
                <h4 className="font-medium text-sm">Free Express Delivery</h4>
                <p className="text-xs text-muted-foreground">Usually delivered in 2-3 business days</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
