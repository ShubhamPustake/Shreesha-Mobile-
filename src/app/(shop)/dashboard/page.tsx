import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Package, Wrench, Star } from "lucide-react"
import { FeedbackForm } from "@/components/shop/FeedbackForm"
import { getUserFeedback } from "@/actions/feedback"
import { getUserOrders } from "@/actions/orders"
import { getUserRepairs } from "@/actions/repairs"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const feedbacks = await getUserFeedback()
  const orders = await getUserOrders()
  const repairs = await getUserRepairs()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {session.user.name || "Customer"}. Manage your orders, repairs, and feedback here.
        </p>
      </div>

      <Tabs defaultValue="feedback" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="w-4 h-4" /> Orders
          </TabsTrigger>
          <TabsTrigger value="repairs" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" /> Repairs
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>View your recent orders and their status.</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>You have no recent orders.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order.id} className="p-4 rounded-xl bg-background border border-border/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-semibold text-primary">Order #{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline" className={
                          order.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-500' :
                          order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' :
                          'bg-yellow-500/10 text-yellow-500'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="mt-4 space-y-3">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3 text-sm">
                            <div className="relative w-12 h-12 bg-slate-100 rounded-md overflow-hidden flex-shrink-0 border border-border">
                              {item.image ? (
                                <Image src={item.image} alt={item.productName || 'Product'} fill className="object-cover" />
                              ) : (
                                <Package className="w-6 h-6 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.productName || 'Product'}</p>
                              <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                            </div>
                            <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50 flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repairs">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>My Repairs</CardTitle>
              <CardDescription>Track your device repairs.</CardDescription>
            </CardHeader>
            <CardContent>
              {repairs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>You have no active repairs.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {repairs.map((repair: any) => (
                    <div key={repair.id} className="p-4 rounded-xl bg-background border border-border/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-semibold text-primary">Repair #{repair.id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">{new Date(repair.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline" className={
                          repair.status === 'COMPLETED' || repair.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' :
                          repair.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' :
                          'bg-blue-500/10 text-blue-500'
                        }>
                          {repair.status}
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium">{repair.deviceBrand} {repair.deviceModel}</p>
                        <p className="text-sm text-muted-foreground mt-1">Issue: {repair.issue}</p>
                      </div>
                      {repair.estimatedCost && (
                        <div className="mt-4 pt-4 border-t border-border/50 flex justify-between font-bold">
                          <span>Estimated Cost</span>
                          <span>₹{repair.estimatedCost.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Submit Feedback</CardTitle>
                <CardDescription>We value your feedback. Let us know how we did!</CardDescription>
              </CardHeader>
              <CardContent>
                <FeedbackForm />
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/10 bg-muted/30">
              <CardHeader>
                <CardTitle>Your Past Feedback</CardTitle>
                <CardDescription>Reviews you've previously submitted.</CardDescription>
              </CardHeader>
              <CardContent>
                {feedbacks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>You haven't submitted any feedback yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedbacks.map((f: any) => (
                      <div key={f.id} className="p-4 rounded-xl bg-background border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < f.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`} 
                              />
                            ))}
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            f.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' :
                            f.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                            'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {f.status}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 italic">"{f.comment}"</p>
                        <p className="text-xs text-muted-foreground mt-2 text-right">
                          {new Date(f.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
