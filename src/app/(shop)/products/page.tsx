import Link from "next/link"
import { Filter, ChevronDown } from "lucide-react"
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

// Mock Data
const PRODUCTS = [
  { id: "1", name: "iPhone 15 Pro Max", price: 159900, category: "Mobiles", brand: "Apple", stock: 12, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop" },
  { id: "2", name: "Samsung Galaxy S24 Ultra", price: 129999, category: "Mobiles", brand: "Samsung", stock: 8, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop" },
  { id: "3", name: "Sony WH-1000XM5", price: 29990, category: "Accessories", brand: "Sony", stock: 15, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop" },
  { id: "4", name: "Apple AirPods Pro (2nd Gen)", price: 24900, category: "Accessories", brand: "Apple", stock: 25, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop" },
  { id: "5", name: "OnePlus 12", price: 64999, category: "Mobiles", brand: "OnePlus", stock: 10, image: "https://images.unsplash.com/photo-1706606991536-e39841f5f50a?q=80&w=600&auto=format&fit=crop" },
  { id: "6", name: "Nothing Phone (2)", price: 44999, category: "Mobiles", brand: "Nothing", stock: 5, image: "https://images.unsplash.com/photo-1691440263529-65b7d6006f0e?q=80&w=600&auto=format&fit=crop" },
]

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">All Products</h1>
        <p className="text-muted-foreground">Browse our collection of premium devices and accessories.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 glass-panel p-5 rounded-xl border-border/50">
            <div className="flex items-center gap-2 font-semibold text-lg mb-4">
              <Filter className="h-5 w-5" /> Filters
            </div>
            <Separator className="mb-4" />
            
            <Accordion className="w-full">
              <AccordionItem value="categories" className="border-b-0">
                <AccordionTrigger className="hover:no-underline py-3">Categories</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-input text-primary focus:ring-primary" defaultChecked /> Mobiles</label></li>
                    <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-input text-primary focus:ring-primary" defaultChecked /> Accessories</label></li>
                    <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-input text-primary focus:ring-primary" /> Spare Parts</label></li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="brands" className="border-b-0">
                <AccordionTrigger className="hover:no-underline py-3">Brands</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-input text-primary focus:ring-primary" /> Apple</label></li>
                    <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-input text-primary focus:ring-primary" /> Samsung</label></li>
                    <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-input text-primary focus:ring-primary" /> OnePlus</label></li>
                    <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-input text-primary focus:ring-primary" /> Sony</label></li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price" className="border-b-0">
                <AccordionTrigger className="hover:no-underline py-3">Price Range</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    <li><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="price" className="text-primary focus:ring-primary" /> Under ₹10,000</label></li>
                    <li><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="price" className="text-primary focus:ring-primary" /> ₹10,000 - ₹30,000</label></li>
                    <li><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="price" className="text-primary focus:ring-primary" /> ₹30,000 - ₹60,000</label></li>
                    <li><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="price" className="text-primary focus:ring-primary" /> Over ₹60,000</label></li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-muted-foreground">Showing {PRODUCTS.length} products</span>
            <Button variant="outline" size="sm" className="gap-2">
              Sort by: Featured <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <Card key={product.id} className="overflow-hidden border-border/50 group h-full flex flex-col">
                <Link href={`/products/${product.id}`} className="block relative aspect-square bg-muted overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.stock < 10 && (
                    <Badge variant="destructive" className="absolute top-3 left-3">Only {product.stock} left</Badge>
                  )}
                </Link>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-medium text-primary uppercase tracking-wider">{product.brand}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-4 hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <span className="font-bold text-xl">₹{product.price.toLocaleString()}</span>
                    <Link href={`/products/${product.id}`} className={buttonVariants({ variant: "secondary" })}>
                      Details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
