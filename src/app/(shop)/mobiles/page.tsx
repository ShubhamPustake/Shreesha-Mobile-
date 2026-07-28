"use client"

import { useState } from "react"
import Link from "next/link"
import { Filter, Star, Truck, RefreshCcw, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const MOBILE_PRODUCTS = [
  {
    id: "m1",
    name: "Apple iPhone 15 (128 GB) - Black",
    brand: "Apple",
    price: 72999,
    originalPrice: 79900,
    rating: 4.6,
    reviews: 12450,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop",
    features: ["A16 Bionic chip with 5-core GPU", "48MP Main camera", "Dynamic Island"],
    ram: "6 GB",
    storage: "128 GB",
    badge: "Best Seller"
  },
  {
    id: "m2",
    name: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB, 256GB Storage)",
    brand: "Samsung",
    price: 129999,
    originalPrice: 134999,
    rating: 4.8,
    reviews: 8400,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop",
    features: ["Snapdragon 8 Gen 3", "200MP Camera", "S-Pen Included"],
    ram: "12 GB",
    storage: "256 GB",
    badge: "Shreesha's Choice"
  },
  {
    id: "m3",
    name: "OnePlus 12R (Cool Blue, 8GB RAM, 128GB Storage)",
    brand: "OnePlus",
    price: 39999,
    originalPrice: 42999,
    rating: 4.5,
    reviews: 5600,
    image: "https://images.unsplash.com/photo-1706606991536-e39841f5f50a?q=80&w=600&auto=format&fit=crop",
    features: ["Snapdragon 8 Gen 2", "5500 mAh Battery", "100W SUPERVOOC"],
    ram: "8 GB",
    storage: "128 GB"
  },
  {
    id: "m4",
    name: "Redmi 13C (Stardust Black, 4GB RAM, 128GB Storage) | Powered by 4G MediaTek Helio G85",
    brand: "Xiaomi",
    price: 7999,
    originalPrice: 11999,
    rating: 4.1,
    reviews: 21500,
    image: "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?q=80&w=600&auto=format&fit=crop",
    features: ["MediaTek Helio G85", "50MP AI Triple Camera", "90Hz Display"],
    ram: "4 GB",
    storage: "128 GB",
    badge: "Great Deal"
  },
  {
    id: "m5",
    name: "Nothing Phone (2) (White, 12GB RAM, 256GB Storage)",
    brand: "Nothing",
    price: 44999,
    originalPrice: 49999,
    rating: 4.4,
    reviews: 3200,
    image: "https://images.unsplash.com/photo-1691440263529-65b7d6006f0e?q=80&w=600&auto=format&fit=crop",
    features: ["Glyph Interface", "Snapdragon 8+ Gen 1", "50MP Dual Camera"],
    ram: "12 GB",
    storage: "256 GB"
  }
]

export default function MobilesPage() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedRam, setSelectedRam] = useState<string[]>([])
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)
  
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const toggleRam = (ram: string) => {
    setSelectedRam(prev => 
      prev.includes(ram) ? prev.filter(r => r !== ram) : [...prev, ram]
    )
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedRam([])
    setSelectedPrice(null)
  }

  const filteredProducts = MOBILE_PRODUCTS.filter(p => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false
    if (selectedRam.length > 0 && !selectedRam.includes(p.ram)) return false
    if (selectedPrice) {
      if (selectedPrice === "Under ₹10,000" && p.price >= 10000) return false
      if (selectedPrice === "₹10,000 - ₹30,000" && (p.price < 10000 || p.price > 30000)) return false
      if (selectedPrice === "₹30,000 - ₹60,000" && (p.price < 30000 || p.price > 60000)) return false
      if (selectedPrice === "Over ₹60,000" && p.price <= 60000) return false
    }
    return true
  })

  const brands = Array.from(new Set(MOBILE_PRODUCTS.map(p => p.brand)))
  const rams = ["4 GB", "6 GB", "8 GB", "12 GB"]
  const priceRanges = ["Under ₹10,000", "₹10,000 - ₹30,000", "₹30,000 - ₹60,000", "Over ₹60,000"]

  return (
    <div className="bg-[#f2f4f8] min-h-screen pb-12">
      {/* Amazon-like Top Bar */}
      <div className="bg-white border-b border-border shadow-sm px-4 py-3 mb-6">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">1-{filteredProducts.length} of over 10,000 results for</span>
            <span className="text-primary font-bold ml-1">"Mobiles"</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6">
        {/* Amazon-like Left Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 bg-white p-4 rounded-lg shadow-sm border border-border h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Filters</h3>
            {(selectedBrands.length > 0 || selectedRam.length > 0 || selectedPrice !== null) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-blue-600 hover:text-blue-800">
                <RefreshCcw className="h-3 w-3 mr-1" /> Clear
              </Button>
            )}
          </div>
          
          <Separator className="mb-4" />
          
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Brands</h4>
            <div className="space-y-2">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="checkbox" 
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                  /> 
                  {brand}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-3">RAM</h4>
            <div className="space-y-2">
              {rams.map(ram => (
                <label key={ram} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="checkbox" 
                    checked={selectedRam.includes(ram)}
                    onChange={() => toggleRam(ram)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                  /> 
                  {ram}
                </label>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Price</h4>
            <div className="space-y-2">
              {priceRanges.map(range => (
                <label key={range} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="radio" 
                    name="priceRange"
                    checked={selectedPrice === range}
                    onChange={() => setSelectedPrice(range)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                  /> 
                  {range}
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* Product List View */}
        <div className="flex-1 flex flex-col gap-4">
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-lg border border-border shadow-sm">
              <h3 className="text-xl font-semibold mb-2">No results</h3>
              <p className="text-muted-foreground">Try checking your spelling or use more general terms.</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg border border-border shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
                
                {/* Image Section */}
                <Link href={`/products/${product.id}`} className="block w-full sm:w-64 h-64 sm:h-auto shrink-0 p-4 bg-white relative flex items-center justify-center border-b sm:border-b-0 sm:border-r border-border hover:opacity-90 transition-opacity">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="max-h-full max-w-full object-contain p-2 mix-blend-multiply"
                  />
                </Link>
                
                {/* Details Section */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  <Link href={`/products/${product.id}`} className="block mb-1">
                    <h2 className="text-lg sm:text-xl font-medium text-blue-600 hover:text-red-600 hover:underline line-clamp-2">
                      {product.name}
                    </h2>
                  </Link>

                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-blue-600 hover:underline cursor-pointer text-sm ml-1">{product.reviews.toLocaleString()}</span>
                  </div>

                  {product.badge && (
                    <div className="mb-3">
                      <Badge variant="secondary" className="bg-[#232F3E] text-white hover:bg-[#232F3E] rounded-sm uppercase text-[10px] tracking-wider px-2 py-0.5">
                        {product.badge}
                      </Badge>
                    </div>
                  )}

                  <ul className="list-disc list-inside text-sm text-muted-foreground mb-4 space-y-1">
                    {product.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-semibold">₹{product.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground line-through">M.R.P: ₹{product.originalPrice.toLocaleString()}</span>
                      <span className="text-sm text-green-600 font-medium">
                        ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <Truck className="w-4 h-4" />
                      <span>FREE delivery by <strong>Tomorrow, 11 AM</strong></span>
                    </div>

                    <Button className="bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200] shadow-sm rounded-full px-6">
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add to cart
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
