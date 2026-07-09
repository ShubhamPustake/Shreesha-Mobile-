import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tags, Package, TrendingUp } from "lucide-react"
import { BrandsClient } from "@/components/admin/BrandsClient"

const prisma = new PrismaClient()

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  })

  const totalBrands = brands.length
  
  const totalProducts = brands.reduce((sum, brand) => sum + brand._count.products, 0)
  
  const topBrand = brands.length > 0 
    ? [...brands].sort((a, b) => b._count.products - a._count.products)[0]
    : null

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Brands</h1>
          <p className="text-muted-foreground mt-1">Manage the brands you carry in your store.</p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="glass-panel" size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Brands</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBrands}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel" size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Branded Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card className="glass-panel" size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Brand</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topBrand ? topBrand.name : "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {topBrand ? `${topBrand._count.products} products` : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interactive Client Component */}
      <BrandsClient brands={brands} />
    </div>
  )
}
