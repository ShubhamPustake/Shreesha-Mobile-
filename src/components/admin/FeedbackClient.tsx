"use client"

import { useState } from "react"
import { Star, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { updateFeedbackStatus } from "@/actions/feedback"

export function FeedbackClient({ initialFeedback }: { initialFeedback: any[] }) {
  const [feedbacks, setFeedbacks] = useState(initialFeedback)

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await updateFeedbackStatus(id, status)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`Feedback marked as ${status}`)
        setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status } : f))
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {feedbacks.length === 0 ? (
        <div className="col-span-full text-center py-12 text-muted-foreground bg-card glass-panel rounded-xl border border-border/50">
          No feedback found.
        </div>
      ) : (
        feedbacks.map((feedback) => (
          <Card key={feedback.id} className="glass-panel flex flex-col justify-between">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold">{feedback.user.name || "Unknown"}</h4>
                  <p className="text-xs text-muted-foreground">{feedback.user.email}</p>
                </div>
                <div className="flex gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < feedback.rating ? "fill-current" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
              </div>
              <p className="italic text-sm text-foreground/80 mb-4 line-clamp-4">
                "{feedback.comment}"
              </p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  feedback.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' :
                  feedback.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                  'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {feedback.status}
                </span>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                    onClick={() => handleUpdateStatus(feedback.id, "APPROVED")}
                    disabled={feedback.status === "APPROVED"}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => handleUpdateStatus(feedback.id, "REJECTED")}
                    disabled={feedback.status === "REJECTED"}
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
