"use client"

import { useState } from "react"
import Link from "next/link"
import { Filter, ChevronDown, RefreshCcw } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Mock Data for Spare Parts
const PRODUCTS = [
  { id: "p1", name: "iPhone 13 Original OLED Display", price: 12500, category: "Spare Parts", brand: "Apple", device: "iPhone 13", partType: "Screen", stock: 5, image: "https://images.unsplash.com/photo-1596742578443-7682ef5251cd?q=80&w=600&auto=format&fit=crop" },
  { id: "p6", name: "iPhone 13 Battery Replacement", price: 2500, category: "Spare Parts", brand: "Apple", device: "iPhone 13", partType: "Battery", stock: 15, image: "https://images.unsplash.com/photo-1620054774358-1f19f18cb6eb?q=80&w=600&auto=format&fit=crop" },
  { id: "p2", name: "Samsung Galaxy S22 Ultra Battery Replacement", price: 3500, category: "Spare Parts", brand: "Samsung", device: "Galaxy S22 Ultra", partType: "Battery", stock: 12, image: "https://images.unsplash.com/photo-1620054774358-1f19f18cb6eb?q=80&w=600&auto=format&fit=crop" },
  { id: "p3", name: "OnePlus 9 Charging Port Module", price: 1200, category: "Spare Parts", brand: "OnePlus", device: "OnePlus 9", partType: "Charging Port", stock: 8, image: "https://images.unsplash.com/photo-1563207153-f404bfb0d367?q=80&w=600&auto=format&fit=crop" },
  { id: "p4", name: "Xiaomi Redmi Note 10 Pro Back Panel", price: 850, category: "Spare Parts", brand: "Xiaomi", device: "Redmi Note 10 Pro", partType: "Back Panel", stock: 20, image: "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?q=80&w=600&auto=format&fit=crop" },
  { id: "p5", name: "iPhone 12 Pro Max Camera Lens Glass", price: 450, category: "Spare Parts", brand: "Apple", device: "iPhone 12 Pro Max", partType: "Camera", stock: 50, image: "https://images.unsplash.com/photo-1588665790518-86d38e23fc6c?q=80&w=600&auto=format&fit=crop" },
]

export default function SparePartsPage() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

  const availableBrands = Array.from(new Set(PRODUCTS.map(p => p.brand)))
  const availableDevices = selectedBrand 
    ? Array.from(new Set(PRODUCTS.filter(p => p.brand === selectedBrand).map(p => p.device)))
    : []
  const availablePartTypes = selectedDevice
    ? Array.from(new Set(PRODUCTS.filter(p => p.device === selectedDevice).map(p => p.partType)))
    : []

  const filteredProducts = PRODUCTS.filter(p => {
    if (selectedBrand && p.brand !== selectedBrand) return false
    if (selectedDevice && p.device !== selectedDevice) return false
    return true
  })

  const clearFilters = () => {
    setSelectedBrand(null)
    setSelectedDevice(null)
  }

  // Group by partType
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.partType]) acc[product.partType] = []
    acc[product.partType].push(product)
    return acc
  }, {} as Record<string, typeof PRODUCTS>)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs & Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Spare Parts</h1>
        <p className="text-muted-foreground">High quality, genuine replacement parts for all major mobile brands.</p>
      </div>

      {/* Horizontal Top Filters */}
      <div className="glass-panel p-4 rounded-xl border-border/50 mb-8 flex flex-col md:flex-row items-end gap-4">
        <div className="flex items-center gap-2 font-semibold text-lg md:mr-4">
          <Filter className="h-5 w-5" /> Filters
        </div>
        
        <div className="w-full md:w-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brand</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedBrand || ""}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedBrand(val === "" ? null : val);
                setSelectedDevice(null);
              }}
            >
              <option value="">All Brands</option>
              {availableBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Device</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedDevice || ""}
              disabled={!selectedBrand}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedDevice(val === "" ? null : val);
              }}
            >
              <option value="">{selectedBrand ? "All Devices" : "Select Brand First"}</option>
              {availableDevices.map(device => (
                <option key={device} value={device}>{device}</option>
              ))}
            </select>
          </div>
        </div>

        {(selectedBrand || selectedDevice) && (
          <Button variant="outline" onClick={clearFilters} className="h-10 shrink-0 gap-2">
            <RefreshCcw className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      {/* Product Grid */}
      <div className="flex flex-col">
        {!selectedDevice ? (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border text-muted-foreground">
            Please select a Brand and Device to view available spare parts.
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedProducts).map(([partType, products]) => (
              <div key={partType}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold">{partType} for {selectedDevice}</h2>
                  <Separator className="flex-1" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden border-border/50 group h-full flex flex-col">
                      <Link href={`/products/${product.id}`} className="block relative aspect-[4/3] bg-card overflow-hidden p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                        />
                        {product.stock < 10 && (
                          <Badge variant="destructive" className="absolute top-3 left-3">Only {product.stock} left</Badge>
                        )}
                      </Link>
                      <CardContent className="p-4 flex-1 flex flex-col bg-card">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-medium text-sm mb-1 hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                        </Link>
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                          <span className="font-bold text-lg text-primary">₹{product.price.toLocaleString()}</span>
                          <Link href={`/products/${product.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                            Details
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
