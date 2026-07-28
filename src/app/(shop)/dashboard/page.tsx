import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Package, Wrench, Star } from "lucide-react"
import { FeedbackForm } from "@/components/shop/FeedbackForm"
import { getUserFeedback } from "@/actions/feedback"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const feedbacks = await getUserFeedback()

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
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>You have no recent orders.</p>
              </div>
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
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>You have no active repairs.</p>
              </div>
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
