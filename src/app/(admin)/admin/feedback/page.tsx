import { getAllFeedback } from "@/actions/feedback"
import { FeedbackClient } from "@/components/admin/FeedbackClient"

export default async function AdminFeedbackPage() {
  const result = await getAllFeedback()

  // Since we might get an error back (e.g. unauthorized) we default to empty array
  const feedbacks = result.feedbacks || []

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Customer Feedback</h2>
        <p className="text-muted-foreground mt-2">
          Review and manage feedback submitted by customers. Approved feedback may be displayed publicly.
        </p>
      </div>

      <FeedbackClient initialFeedback={feedbacks} />
    </div>
  )
}
