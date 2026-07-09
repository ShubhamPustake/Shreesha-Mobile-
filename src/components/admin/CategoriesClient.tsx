"use client"

import { useState } from "react"
import { Search, Plus, Layers, Package, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { addCategory, updateCategory, deleteCategory } from "@/actions/categories"

type Category = {
  id: string
  name: string
  description: string | null
  brandId: string | null
  brand: {
    name: string
  } | null
  _count: {
    products: number
  }
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CategoriesClient({
  categories,
  brands
}: {
  categories: Category[]
  brands: { id: string, name: string }[]
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brandId: ""
  })

  const openAddModal = () => {
    setEditingCategoryId(null)
    setFormData({ name: "", description: "", brandId: "" })
    setIsAddOpen(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategoryId(category.id)
    setFormData({ 
      name: category.name, 
      description: category.description || "", 
      brandId: category.brandId || "" 
    })
    setIsAddOpen(true)
  }

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.brandId) {
      toast.error("Please select a Brand for this category.")
      setLoading(false)
      return
    }

    let res;
    if (editingCategoryId) {
      res = await updateCategory(editingCategoryId, formData)
    } else {
      res = await addCategory(formData)
    }

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(`Category ${editingCategoryId ? 'updated' : 'created'} successfully!`)
      setIsAddOpen(false)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    const res = await deleteCategory(id)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Category deleted successfully!")
    }
  }

  return (
    <div className="glass-panel rounded-2xl border-border/50 overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[400px]">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/30">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search categories..." 
            className="pl-9 bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger onClick={openAddModal} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCategoryId ? "Edit Category" : "Add New Category"}</DialogTitle>
              <DialogDescription>
                {editingCategoryId 
                  ? "Update the details for this category." 
                  : "Create a new category to group your products (e.g., Mobiles, Accessories, Laptops)."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input id="name" required placeholder="e.g. Smartwatches" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Optional brief description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brandId">Brand *</Label>
                <Select value={formData.brandId} onValueChange={(value) => setFormData({...formData, brandId: value || ""})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand...">
                      {formData.brandId 
                        ? brands.find(b => b.id === formData.brandId)?.name 
                        : "Select a brand..."}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Category"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Layers className="h-8 w-8 opacity-20" />
                    <p>No categories found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {category.name.charAt(0)}
                      </div>
                      <span>{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.brand ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                        {category.brand.name}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.description || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      <Package className="w-3 h-3 mr-1" />
                      {category._count.products}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(category)} title="Edit">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)} title="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
