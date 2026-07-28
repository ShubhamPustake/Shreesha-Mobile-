"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { quickAddProduct } from "@/actions/quick-add-product"

type Category = { id: string, name: string, brandId?: string | null, brand?: { name: string } | null }
type Brand = { id: string, name: string }

export function QuickAddProductModal({
  categories,
  brands,
  onSuccess
}: {
  categories: Category[]
  brands: Brand[]
  onSuccess?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)

  const defaultFormData = {
    name: "",
    brandId: brands.length > 0 ? brands[0].id : "",
    categoryId: categories.length > 0 ? categories[0].id : "",
    model: "",
    color: "",
    ram: "",
    storage: "",
    mrp: "",
    sellingPrice: "",
    stock: "",
    image: "",
    description: "",
    processor: "",
    displaySize: "",
    rearCamera: "",
    frontCamera: "",
    battery: "",
    os: "",
    warranty: ""
  }

  const [formData, setFormData] = useState(defaultFormData)

  const availableCategories = formData.brandId 
    ? categories.filter(c => !c.brandId || c.brandId === formData.brandId)
    : categories

  const handleAiAutoFill = async () => {
    if (!formData.name) {
      toast.error("Please enter a Product Name first.")
      return
    }
    setIsAiLoading(true)
    const toastId = toast.loading("Asking AI for specifications...")
    try {
      const res = await fetch("/api/ai/fetch-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: formData.name, format: "json" })
      })
      const data = await res.json()
      
      if (res.ok && data.specs) {
        setFormData(prev => ({
          ...prev,
          processor: data.specs["Processor"] || prev.processor,
          displaySize: data.specs["Display Size"] || prev.displaySize,
          rearCamera: data.specs["Rear Camera"] || prev.rearCamera,
          frontCamera: data.specs["Front Camera"] || prev.frontCamera,
          battery: data.specs["Battery Capacity"] || prev.battery,
          os: data.specs["Operating System"] || prev.os,
          warranty: data.specs["Warranty"] || prev.warranty,
          ram: data.specs["RAM"] || prev.ram,
          storage: data.specs["Storage"] || prev.storage,
        }))
        toast.success("AI successfully filled specifications!", { id: toastId })
      } else {
        toast.error(data.error || "Failed to fetch AI specifications.", { id: toastId })
      }
    } catch (error) {
      toast.error("An error occurred while fetching AI specifications.", { id: toastId })
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.categoryId || !formData.brandId) {
      toast.error("Please select a Category and Brand.")
      setLoading(false)
      return
    }

    const res = await quickAddProduct(formData)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Product and Variant created successfully!")
      setIsOpen(false)
      setFormData(defaultFormData)
      if (onSuccess) onSuccess()
    }
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto" />}>
        <Plus className="h-4 w-4" /> Add Product
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Create a base product and its initial variant simultaneously. All 19 fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          
          {/* 1. Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">1. Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="q-name">Product Name *</Label>
                  <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary" onClick={handleAiAutoFill} disabled={isAiLoading || !formData.name}>
                    <Sparkles className="h-3 w-3 mr-1" /> Auto-fill Specs
                  </Button>
                </div>
                <Input id="q-name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. iPhone 15 Pro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-model">Model *</Label>
                <Input id="q-model" required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="e.g. A3102" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-brand">Brand *</Label>
                <Select value={formData.brandId} onValueChange={v => setFormData({...formData, brandId: v || ""})}>
                  <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>
                    {brands.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-category">Category *</Label>
                <Select value={formData.categoryId} onValueChange={v => setFormData({...formData, categoryId: v || ""})}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {availableCategories.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.brand ? `${c.brand.name} > ${c.name}` : c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-image">Main Product Image URL *</Label>
              <Input id="q-image" required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://example.com/image.jpg" />
              {formData.image && (
                <div className="mt-3 w-40 h-40 relative rounded-md overflow-hidden border border-border shadow-sm">
                  {/* Using standard img to avoid next/image hostname restrictions for random URLs */}
                  <img src={formData.image} alt="Product Preview" className="object-cover w-full h-full" onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f8fafc/94a3b8?text=Invalid+Image+URL'
                  }} />
                </div>
              )}
            </div>
          </div>

          {/* 2. Pricing & Inventory (Variant specific) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">2. Pricing & Inventory</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="q-mrp">MRP (₹) *</Label>
                <Input id="q-mrp" type="number" min="0" required value={formData.mrp} onChange={e => setFormData({...formData, mrp: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-sellingPrice">Selling Price (₹) *</Label>
                <Input id="q-sellingPrice" type="number" min="0" required value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-stock">Stock Quantity *</Label>
                <Input id="q-stock" type="number" min="0" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-color">Color *</Label>
                <Input id="q-color" required value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} placeholder="e.g. Titanium Blue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-ram">RAM *</Label>
                <Input id="q-ram" required value={formData.ram} onChange={e => setFormData({...formData, ram: e.target.value})} placeholder="e.g. 8GB" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-storage">Storage *</Label>
                <Input id="q-storage" required value={formData.storage} onChange={e => setFormData({...formData, storage: e.target.value})} placeholder="e.g. 256GB" />
              </div>
            </div>
          </div>

          {/* 3. Technical Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">3. Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="q-processor">Processor *</Label>
                <Input id="q-processor" required value={formData.processor} onChange={e => setFormData({...formData, processor: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-displaySize">Display Size *</Label>
                <Input id="q-displaySize" required value={formData.displaySize} onChange={e => setFormData({...formData, displaySize: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-rearCamera">Rear Camera *</Label>
                <Input id="q-rearCamera" required value={formData.rearCamera} onChange={e => setFormData({...formData, rearCamera: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-frontCamera">Front Camera *</Label>
                <Input id="q-frontCamera" required value={formData.frontCamera} onChange={e => setFormData({...formData, frontCamera: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-battery">Battery Capacity *</Label>
                <Input id="q-battery" required value={formData.battery} onChange={e => setFormData({...formData, battery: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-os">Operating System *</Label>
                <Input id="q-os" required value={formData.os} onChange={e => setFormData({...formData, os: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-warranty">Warranty *</Label>
                <Input id="q-warranty" required value={formData.warranty} onChange={e => setFormData({...formData, warranty: e.target.value})} placeholder="e.g. 1 Year Manufacturer" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-description">Short Description *</Label>
              <Textarea id="q-description" required className="min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t mt-6">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? "Saving..." : "Create Product & Variant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
