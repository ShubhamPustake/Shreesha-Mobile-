"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, MapPin, User, Phone, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RepairTimeline, RepairStatus } from "@/components/shared/RepairTimeline"
import { getRepairJobById } from "@/actions/repairs"

function TrackRepairContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams?.get("id") || ""
  
  const [trackingId, setTrackingId] = useState(initialId)
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingId.trim()) {
      setError("Please enter a valid Name or Phone Number")
      return
    }

    setIsSearching(true)
    setError("")

    // API Call to fetch repair details
    getRepairJobById(trackingId).then(job => {
      if (job) {
        setResult({
          jobId: job.id,
          status: job.status as RepairStatus,
          device: job.device,
          issue: job.issue,
          customerName: job.customer,
          phone: job.customerPhone,
          serviceType: job.serviceType,
          estimateAmount: 1500, // Mocked for now
          expectedCompletion: "In 2 days", // Mocked
          technician: "Assigned Tech",
        })
      } else {
        setError("No repair job found with the provided ID.")
        setResult(null)
      }
      setIsSearching(false)
    }).catch(err => {
      console.error(err)
      setError("An error occurred while fetching the job.")
      setIsSearching(false)
    })
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Track Your Repair</h1>
        <p className="text-lg text-muted-foreground">Enter your name or registered phone number to check live status.</p>
      </div>

      {/* Search Bar */}
      <Card className="glass-panel border-border/50 max-w-2xl mx-auto mb-12">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                className="pl-10 h-12 text-lg"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8" disabled={isSearching}>
              {isSearching ? "Searching..." : "Track"}
            </Button>
          </form>
          {error && <p className="text-destructive mt-3 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Timeline */}
          <Card className="lg:col-span-2 glass-panel border-border/50 shadow-md overflow-hidden">
            <div className="bg-muted/30 p-6 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{result.device}</h2>
                <p className="text-muted-foreground">{result.issue}</p>
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1 bg-background">
                Job ID: <span className="font-bold ml-1 text-primary">{result.jobId}</span>
              </Badge>
            </div>
            <CardContent className="pt-6">
              <RepairTimeline currentStatus={result.status} />
            </CardContent>
          </Card>

          {/* Job Details Sidebar */}
          <div className="space-y-6">
            <Card className="glass-panel border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-muted-foreground">Estimated Cost</span>
                  <span className="font-bold text-lg text-primary">₹{result.estimateAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-muted-foreground">Expected Completion</span>
                  <span className="font-medium">{result.expectedCompletion}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-muted-foreground">Assigned Technician</span>
                  <span className="font-medium">{result.technician}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Service Type</span>
                  <Badge variant="secondary">{result.serviceType}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Customer Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{result.customerName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{result.phone}</span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              <p>Your device is currently being repaired. We will notify you once it's ready for delivery.</p>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default function TrackRepairPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-20 text-center">Loading tracker...</div>}>
      <TrackRepairContent />
    </Suspense>
  )
}
