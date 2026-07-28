import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Tags, LayoutGrid, IndianRupee } from "lucide-react"
import { ProductsClient } from "@/components/admin/ProductsClient"

const prisma = new PrismaClient()

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      type: {
        not: "SPARE_PART"
      }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      brand: true
    }
  })

  const categories = await prisma.category.findMany({
    include: { brand: true }
  })
  const brands = await prisma.brand.findMany()

  const totalProducts = products.length
  const totalCategories = categories.length
  const totalBrands = brands.length

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage all base products, devices, and accessories.</p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="glass-panel" size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel" size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>

        <Card className="glass-panel" size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Brands</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBrands}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interactive Client Component */}
      <ProductsClient 
        products={products} 
        categories={categories} 
        brands={brands} 
      />
    </div>
  )
}
