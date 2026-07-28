import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, Package, TrendingUp } from "lucide-react"
import { CategoriesClient } from "@/components/admin/CategoriesClient"

const prisma = new PrismaClient()

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      brand: true,
      _count: {
        select: {
          products: true
        }
      }
    }
  });

  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' }
  });

  const totalCategories = categories.length
  
  const totalProducts = categories.reduce((sum, cat) => sum + cat._count.products, 0)
  
  const topCategory = categories.length > 0 
    ? [...categories].sort((a, b) => b._count.products - a._count.products)[0]
    : null

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your product catalog.</p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="glass-panel" size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel" size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categorized Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card className="glass-panel" size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Category</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topCategory ? topCategory.name : "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {topCategory ? `${topCategory._count.products} products` : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interactive Client Component */}
      <CategoriesClient categories={categories} brands={brands} />
    </div>
  )
}
