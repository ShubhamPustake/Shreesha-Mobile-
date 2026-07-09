"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Minus, Trash2, UserPlus, CreditCard, Banknote, ScanBarcode, ArrowLeft, ShoppingCart } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { usePosStore, POSItem } from "@/store/posStore"
import { toast } from "sonner"
import Link from "next/link"
import { getInventory } from "@/actions/inventory"
import { processPosCheckout } from "@/actions/checkout"

// Shared Product Type
type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
}

export default function POSPage() {
  const { items, addItem, removeItem, updateQuantity, discount, setDiscount, getSubtotal, getTaxAmount, getTotal, clearCart } = usePosStore()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const categories = ["All", "Mobiles", "Accessories", "Services"]

  useEffect(() => {
    async function loadProducts() {
      try {
        const inventory = await getInventory()
        setProducts(inventory.filter(item => item.stock > 0)) // Only show in-stock items in POS
      } catch (err) {
        console.error("Failed to load POS products:", err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleCheckout = async (method: string) => {
    if (items.length === 0) {
      toast.error("Cart is empty")
      return
    }
    
    // Call server action to process order and update DB
    const res = await processPosCheckout(
      items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
      method,
      discount
    )

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success(`Payment of ₹${getTotal().toLocaleString()} via ${method} successful!`)
    clearCart()
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      
      {/* Left Area: Product Grid */}
      <div className="flex-1 flex flex-col h-full border-r border-border/50">
        
        {/* POS Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-card/50">
          <div className="flex items-center gap-4">
            <Link href="/admin" className={buttonVariants({ variant: "ghost", size: "icon" })}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Point of Sale</h1>
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <Button 
                key={cat} 
                variant={categoryFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-border/50 bg-background">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by name or scan barcode (SKU)..." 
              className="pl-10 h-12 text-lg bg-muted/50 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Button size="icon" variant="ghost" className="absolute right-2 top-2 h-8 w-8">
              <ScanBarcode className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-muted/10">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-6 content-start">
            {loading ? (
              <div className="col-span-full py-10 text-center text-muted-foreground">Loading products from database...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full py-10 text-center text-muted-foreground">No matching products found.</div>
            ) : filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md active:scale-95 glass-panel"
                onClick={() => addItem({ id: product.id, name: product.name, price: product.price, sku: product.sku, quantity: 1 })}
              >
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="text-xs text-muted-foreground mb-1 font-mono">{product.sku}</div>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2 flex-1">{product.name}</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-primary">₹{product.price.toLocaleString()}</span>
                    <Badge variant="secondary" className="text-[10px]">Stock: {product.stock}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Area: Cart & Checkout */}
      <div className="w-[400px] flex-shrink-0 flex flex-col h-full bg-card/30">
        
        {/* Customer Select */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">Walk-in Customer</p>
              <p className="text-xs text-muted-foreground">Click to assign customer</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">Edit</Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p>Cart is empty</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-background/50">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm leading-tight pr-4">{item.name}</h4>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary & Payment */}
        <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-md">
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₹{getSubtotal().toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Discount</span>
                {items.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => setDiscount(discount === 0 ? 500 : 0)}>
                    {discount === 0 ? "Add ₹500 Off" : "Remove"}
                  </Button>
                )}
              </div>
              <span className="text-destructive">- ₹{discount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Tax (18% GST)</span>
              <span>₹{getTaxAmount().toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          
          <Separator className="mb-4" />
          
          <div className="flex justify-between items-end mb-6">
            <span className="text-lg font-medium">Total</span>
            <span className="text-3xl font-bold text-primary">₹{getTotal().toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              size="lg" 
              className="h-14 text-lg bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => handleCheckout("Cash")}
              disabled={items.length === 0}
            >
              <Banknote className="mr-2 h-5 w-5" /> Cash
            </Button>
            <Button 
              size="lg" 
              className="h-14 text-lg"
              onClick={() => handleCheckout("Card / UPI")}
              disabled={items.length === 0}
            >
              <CreditCard className="mr-2 h-5 w-5" /> Card / UPI
            </Button>
          </div>
        </div>

      </div>

    </div>
  )
}
