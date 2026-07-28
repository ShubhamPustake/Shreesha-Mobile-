"use client"

import { useState } from "react"
import { Star, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { addFeedback } from "@/actions/feedback"

export function FeedbackForm() {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error("Please enter a comment")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await addFeedback({ rating, comment })
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Thank you for your feedback!")
        setComment("")
        setRating(5)
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">How would you rate your experience?</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star 
                className={`w-8 h-8 ${rating >= star ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/50"}`} 
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Share your thoughts</label>
        <Textarea 
          placeholder="Tell us what you liked or how we can improve..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto flex items-center gap-2">
        <Send className="w-4 h-4" />
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  )
}
