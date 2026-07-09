"use client"

import { useState } from "react"
import { Search, Plus, Tags, Package, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { addBrand, updateBrand, deleteBrand } from "@/actions/brands"

type Brand = {
  id: string
  name: string
  logo: string | null
  _count: {
    products: number
  }
}

export function BrandsClient({
  brands
}: {
  brands: Brand[]
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Edit State
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
  })

  const openAddModal = () => {
    setEditingBrandId(null)
    setFormData({ name: "", logo: "" })
    setIsAddOpen(true)
  }

  const openEditModal = (brand: Brand) => {
    setEditingBrandId(brand.id)
    setFormData({ name: brand.name, logo: brand.logo || "" })
    setIsAddOpen(true)
  }

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const payload = new FormData(e.currentTarget)

    let res;
    if (editingBrandId) {
      res = await updateBrand(editingBrandId, payload)
    } else {
      res = await addBrand(payload)
    }

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(`Brand ${editingBrandId ? 'updated' : 'created'} successfully!`)
      setIsAddOpen(false)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    
    const res = await deleteBrand(id)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Brand deleted successfully!")
    }
  }

  return (
    <div className="glass-panel rounded-2xl border-border/50 overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[400px]">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/30">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search brands..." 
            className="pl-9 bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger onClick={openAddModal} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto gap-2">
            <Plus className="h-4 w-4" />
            Add Brand
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingBrandId ? "Edit Brand" : "Add New Brand"}</DialogTitle>
              <DialogDescription>
                {editingBrandId 
                  ? "Update the details for this brand." 
                  : "Create a new brand to associate your products with (e.g., Apple, Samsung)."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name *</Label>
                <Input id="name" name="name" required placeholder="e.g. OnePlus" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Brand Logo (Image)</Label>
                <Input id="logo" name="logo" type="file" accept="image/*" />
                {editingBrandId && formData.logo && (
                  <p className="text-xs text-muted-foreground mt-1">Leave blank to keep existing logo.</p>
                )}
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Brand"}
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
              <TableHead>Brand Name</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead className="text-right">Products Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Tags className="h-8 w-8 opacity-20" />
                    <p>No brands found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBrands.map((brand) => (
                <TableRow key={brand.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" />
                        ) : (
                          brand.name.charAt(0)
                        )}
                      </div>
                      <span>{brand.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {brand.logo ? (
                      <a href={brand.logo} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[200px] inline-block">
                        {brand.logo.split('/').pop()}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      <Package className="w-3 h-3 mr-1" />
                      {brand._count.products}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(brand)} title="Edit">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(brand.id)} title="Delete">
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
