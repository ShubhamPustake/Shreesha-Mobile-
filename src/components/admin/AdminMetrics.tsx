import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee, Wrench, Package, Users } from "lucide-react"

export async function AdminMetrics() {
  // Fetch real data from DB
  const totalOrders = await prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "COMPLETED" } })
  const totalRepairs = await prisma.repair.aggregate({ _sum: { finalCost: true }, where: { status: { in: ["COMPLETED", "DELIVERED"] } } })
  const totalRevenue = (totalOrders._sum.totalAmount || 0) + (totalRepairs._sum.finalCost || 0)

  const activeRepairs = await prisma.repair.count({
    where: { status: { notIn: ["COMPLETED", "DELIVERED", "CANCELLED"] } }
  })

  const inventoryAlerts = await prisma.productVariant.count({
    where: { stock: { lt: 5 } }
  })

  const newCustomers = await prisma.user.count({
    where: { role: "CUSTOMER" }
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <Card className="glass-panel" size="sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            Live Total Revenue
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-panel" size="sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Repairs</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeRepairs}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Currently in progress
          </p>
        </CardContent>
      </Card>

      <Card className="glass-panel" size="sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Alerts</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inventoryAlerts}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Items low on stock
          </p>
        </CardContent>
      </Card>

      <Card className="glass-panel" size="sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newCustomers}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Registered accounts
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
