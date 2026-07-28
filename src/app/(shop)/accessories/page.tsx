"use client"

import { useState } from "react"
import Link from "next/link"
import { Filter, Star, Truck, RefreshCcw, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const ACCESSORIES_PRODUCTS = [
  {
    id: "a1",
    name: "Apple AirPods Pro (2nd Generation) with MagSafe Charging Case",
    brand: "Apple",
    category: "Audio",
    price: 24900,
    originalPrice: 24900,
    rating: 4.8,
    reviews: 18500,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop",
    features: ["Active Noise Cancellation", "Spatial Audio", "Up to 30 hours listening time"],
    badge: "Best Seller"
  },
  {
    id: "a2",
    name: "Samsung 25W Travel Adapter (Without Cable)",
    brand: "Samsung",
    category: "Chargers",
    price: 1299,
    originalPrice: 1699,
    rating: 4.5,
    reviews: 9200,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop",
    features: ["Super Fast Charging", "USB Type-C", "Compact Design"],
    badge: "Must Have"
  },
  {
    id: "a3",
    name: "Spigen Liquid Air Back Cover Case for iPhone 15",
    brand: "Spigen",
    category: "Cases",
    price: 1099,
    originalPrice: 1999,
    rating: 4.6,
    reviews: 3450,
    image: "https://images.unsplash.com/photo-1588620353536-cb11112231eb?q=80&w=600&auto=format&fit=crop",
    features: ["Air Cushion Technology", "Matte Finish", "Military Grade Drop Tested"],
  },
  {
    id: "a4",
    name: "boAt Airdopes 141 Bluetooth Wireless Earbuds",
    brand: "boAt",
    category: "Audio",
    price: 1299,
    originalPrice: 4490,
    rating: 4.2,
    reviews: 124500,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop",
    features: ["42H Playtime", "BEAST Mode", "ENx Technology"],
    badge: "Great Deal"
  },
  {
    id: "a5",
    name: "Apple Watch Series 9 [GPS 41mm] Smartwatch",
    brand: "Apple",
    category: "Wearables",
    price: 41900,
    originalPrice: 41900,
    rating: 4.7,
    reviews: 5600,
    image: "https://images.unsplash.com/photo-1434493789847-2902a52dda56?q=80&w=600&auto=format&fit=crop",
    features: ["S9 SiP", "Double Tap Gesture", "Blood Oxygen app"],
  },
  {
    id: "a6",
    name: "OnePlus 100W SUPERVOOC Power Adapter",
    brand: "OnePlus",
    category: "Chargers",
    price: 2999,
    originalPrice: 3499,
    rating: 4.6,
    reviews: 1200,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop",
    features: ["100W Fast Charging", "Dual Port", "Smart Charge"],
  }
]

export default function AccessoriesPage() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedCategories([])
  }

  const filteredProducts = ACCESSORIES_PRODUCTS.filter(product => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">Accessories</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" /> Filters
              </h2>
              {(selectedBrands.length > 0 || selectedCategories.length > 0) && (
                <button onClick={clearFilters} className="text-xs text-primary hover:underline font-medium">
                  Clear All
                </button>
              )}
            </div>

            <Separator className="my-4" />

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                {["Audio", "Chargers", "Cases", "Wearables"].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <span className="text-sm group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Brand</h3>
              <div className="space-y-2">
                {["Apple", "Samsung", "Spigen", "boAt", "OnePlus"].map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    <span className="text-sm group-hover:text-primary transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Quick Benefits */}
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCcw className="h-4 w-4 text-primary" />
                <span>7 Days Replacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Mobile Accessories</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Showing {filteredProducts.length} products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
                <div className="relative aspect-square p-6 bg-card flex items-center justify-center overflow-hidden">
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 z-10 bg-rose-500 hover:bg-rose-600 text-white border-none">
                      {product.badge}
                    </Badge>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
                  />
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs text-muted-foreground font-medium mb-2">{product.brand} • {product.category}</div>
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
                  </div>
                  
                  <ul className="space-y-1 mb-6 text-xs text-muted-foreground flex-1">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-xl font-bold">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                          <span className="text-xs font-semibold text-emerald-500">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    
                    <Button className="w-full rounded-lg font-medium gap-2">
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-card border border-border rounded-xl">
              <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more products.</p>
              <Button variant="outline" className="mt-6" onClick={clearFilters}>Clear all filters</Button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
