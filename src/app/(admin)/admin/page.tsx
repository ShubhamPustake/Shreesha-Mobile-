import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee, Wrench, Package, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Globe, LogOut, FileText } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { logoutAction } from "@/actions/auth"
import { prisma } from "@/lib/prisma"
import { AdminMetrics } from "@/components/admin/AdminMetrics"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {

  const recentOrders = await prisma.order.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { productVariant: true } } }
  })

  const recentRepairs = await prisma.repair.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

  const activities = [
    ...recentOrders.map(o => ({
      time: o.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: "Order Placed",
      desc: o.items.map(i => i.productVariant?.name || i.productName || "Product").join(", "),
      amount: `₹${o.totalAmount.toLocaleString('en-IN')}`,
      date: o.createdAt
    })),
    ...recentRepairs.map(r => ({
      time: r.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: "Repair Booking",
      desc: `${r.deviceBrand} ${r.deviceModel} - ${r.issue}`,
      amount: r.estimatedCost ? `₹${r.estimatedCost.toLocaleString('en-IN')}` : "Pending Quote",
      date: r.createdAt
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening at your store today.</p>
        </div>
      </div>

      <AdminMetrics />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
          <p className="text-muted-foreground mt-1">Latest store operations and transactions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        {/* Sales Chart Area (Mocked visually) */}
        <Card className="lg:col-span-4 glass-panel">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full rounded-xl bg-muted/30 flex items-center justify-center border border-dashed border-muted-foreground/30">
              <div className="text-center text-muted-foreground flex flex-col items-center">
                <TrendingUp className="h-10 w-10 mb-2 opacity-50" />
                <p>Chart visualization goes here</p>
                <p className="text-xs">(Recharts / Chart.js integration)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3 glass-panel">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {activities.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 flex flex-col items-center">
                  <FileText className="h-8 w-8 mb-2 opacity-20" />
                  No recent activity found in database.
                </div>
              ) : activities.map((activity, i) => (
                <div key={i} className="flex items-center">
                  <div className="ml-4 space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{activity.title}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground max-w-[200px] truncate">{activity.desc}</p>
                      <span className="text-sm font-medium text-emerald-500">{activity.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
