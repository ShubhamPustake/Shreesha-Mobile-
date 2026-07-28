"use client"

import { useState } from "react"
import { Search, Plus, Smartphone, MoreHorizontal, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { addProduct, updateProduct, deleteProduct } from "@/actions/products"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pencil, Trash2 } from "lucide-react"
import { QuickAddProductModal } from "./QuickAddProductModal"

type Category = { id: string, name: string, brandId?: string | null, brand?: { name: string } | null }
type Brand = { id: string, name: string }
type Product = {
  id: string
  name: string
  description: string | null
  type: string
  basePrice: number
  category: { name: string }
  brand: { name: string }
}

export function ProductsClient({
  products,
  categories,
  brands
}: {
  products: Product[]
  categories: Category[]
  brands: Brand[]
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("ALL")
  const [filterBrand, setFilterBrand] = useState("ALL")
  const [filterCategory, setFilterCategory] = useState("ALL")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)

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
        body: JSON.stringify({ productName: formData.name })
      })
      const data = await res.json()
      
      if (res.ok && data.specs) {
        setFormData(prev => ({
          ...prev,
          description: data.specs
        }))
        toast.success("AI successfully fetched specifications!", { id: toastId })
      } else {
        toast.error(data.error || "Failed to fetch AI specifications.", { id: toastId })
      }
    } catch (error) {
      toast.error("An error occurred while fetching AI specifications.", { id: toastId })
    } finally {
      setIsAiLoading(false)
    }
  }

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "MOBILE",
    basePrice: "",
    categoryId: categories.length > 0 ? categories[0].id : "",
    brandId: brands.length > 0 ? brands[0].id : ""
  })

  const filteredProducts = products.filter(p => {
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.category.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const typeMatch = filterType === "ALL" || p.type === filterType
    const brandMatch = filterBrand === "ALL" || p.brand.name === filterBrand
    const categoryMatch = filterCategory === "ALL" || p.category.name === filterCategory

    return searchMatch && typeMatch && brandMatch && categoryMatch
  })

  const availableCategories = formData.brandId 
    ? categories.filter(c => !c.brandId || c.brandId === formData.brandId)
    : categories

  const handleEditClick = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      type: product.type,
      basePrice: product.basePrice.toString(),
      categoryId: categories.find(c => c.name === product.category.name)?.id || "",
      brandId: brands.find(b => b.name === product.brand.name)?.id || ""
    })
    setEditingId(product.id)
    setIsEditOpen(true)
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    setLoading(true)
    
    if (!formData.categoryId || !formData.brandId) {
      toast.error("Please select a Category and Brand.")
      setLoading(false)
      return
    }

    const res = await updateProduct(editingId, {
      ...formData,
      basePrice: parseFloat(formData.basePrice)
    })

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Product updated successfully!")
      setIsEditOpen(false)
      setEditingId(null)
      setFormData({
        name: "",
        description: "",
        type: "MOBILE",
        basePrice: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        brandId: brands.length > 0 ? brands[0].id : ""
      })
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    const res = await deleteProduct(id)
    if (res.error) toast.error(res.error)
    else toast.success("Product deleted successfully!")
  }

  return (
    <div className="glass-panel rounded-2xl border-border/50 overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[400px]">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-border/50 flex flex-col gap-4 bg-card/30">
        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-9 bg-background/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] bg-background/50">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="MOBILE">Mobile</SelectItem>
                <SelectItem value="TABLET">Tablet</SelectItem>
                <SelectItem value="ACCESSORY">Accessory</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBrand} onValueChange={setFilterBrand}>
              <SelectTrigger className="w-[140px] bg-background/50">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Brands</SelectItem>
                {brands.map(b => (
                  <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[140px] bg-background/50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <QuickAddProductModal categories={categories} brands={brands} />
          </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Modify the details of this base product.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateProduct} className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-name">Product Name *</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs text-primary" 
                    onClick={handleAiAutoFill}
                    disabled={isAiLoading || !formData.name}
                  >
                    <Sparkles className="h-3 w-3 mr-1" /> Auto-fill Specs
                  </Button>
                </div>
                <Input id="edit-name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Product Type</Label>
                  <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v || "MOBILE"})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOBILE">Mobile</SelectItem>
                      <SelectItem value="TABLET">Tablet</SelectItem>
                      <SelectItem value="ACCESSORY">Accessory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-basePrice">Base Price (₹) *</Label>
                  <Input id="edit-basePrice" type="number" min="0" required value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select value={formData.categoryId} onValueChange={v => setFormData({...formData, categoryId: v || ""})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.brand ? `${c.brand.name} > ${c.name}` : c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Brand *</Label>
                  <Select value={formData.brandId} onValueChange={v => setFormData({...formData, brandId: v || ""})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Specifications)</Label>
                <Textarea id="edit-description" className="min-h-[150px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Base Price</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Smartphone className="h-8 w-8 opacity-20" />
                    <p>No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {product.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{product.description || "No description"}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {product.type.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>{product.brand.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell className="text-right font-medium">₹{product.basePrice.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(product)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-600 focus:bg-red-50 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
