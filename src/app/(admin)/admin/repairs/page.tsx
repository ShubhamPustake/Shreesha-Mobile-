"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Wrench, ChevronRight, Clock, MapPin, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RepairStatus } from "@/components/shared/RepairTimeline"

import { getRepairJobs } from "@/actions/repairs"

type RepairJob = {
  id: string;
  device: string;
  issue: string;
  customer: string;
  date: string;
  status: string;
  serviceType: string;
  location: string;
  customerPhone?: string;
}

const STATUS_CONFIG: Record<string, { label: string, color: string }> = {
  received: { label: "Received", color: "bg-muted text-muted-foreground" },
  picked_up: { label: "Device Received", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  diagnostic: { label: "Diagnostic", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  repairing: { label: "Repairing", color: "bg-primary/10 text-primary border-primary/20" },
  ready: { label: "Ready", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  completed: { label: "Completed", color: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
}

export default function RepairsDashboard() {
  const [search, setSearch] = useState("")
  const [jobs, setJobs] = useState<RepairJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getRepairJobs()
        setJobs(data)
      } catch (err) {
        console.error("Failed to load repair jobs:", err)
      } finally {
        setLoading(false)
      }
    }
    loadJobs()
  }, [])

  const filteredJobs = jobs.filter(job => 
    job.id.toLowerCase().includes(search.toLowerCase()) || 
    job.customer.toLowerCase().includes(search.toLowerCase()) ||
    job.device.toLowerCase().includes(search.toLowerCase()) ||
    (job.customerPhone && job.customerPhone.includes(search))
  )

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Repair Jobs</h2>
          <p className="text-muted-foreground">Manage and track all ongoing repair services.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
          <Button className="gap-2"><Wrench className="h-4 w-4" /> New Job</Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Column: Job List */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col bg-card glass-panel rounded-xl border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by ID, customer, or device..." 
                className="pl-9 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Loading repair jobs...</div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No matching repair jobs.</div>
            ) : filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className="p-4 rounded-lg border border-transparent hover:border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-mono text-xs font-semibold text-primary">{job.id}</div>
                  <Badge variant="outline" className={STATUS_CONFIG[job.status]?.color || STATUS_CONFIG["received"].color}>
                    {STATUS_CONFIG[job.status]?.label || "Unknown"}
                  </Badge>
                </div>
                <h4 className="font-semibold">{job.device}</h4>
                <p className="text-sm text-muted-foreground line-clamp-1">{job.issue}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.date}</span>
                  <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> {job.serviceType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Job Details (Mocking selection of SRX-8924) */}
        <div className="hidden lg:flex flex-1 flex-col bg-card glass-panel rounded-xl border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold">SRX-8924</h3>
                <Badge variant="outline" className={STATUS_CONFIG["repairing"].color}>Repairing</Badge>
              </div>
              <p className="text-muted-foreground">Apple iPhone 13 Pro - Screen Replacement</p>
            </div>
            <Button>Update Status</Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Customer Details */}
            <section>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Customer Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">John Doe</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">+91 98765 43210</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Service Type</p>
                  <p className="font-medium flex items-center gap-2"><Truck className="h-4 w-4" /> Pickup & Drop</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium flex items-center gap-2"><MapPin className="h-4 w-4" /> Mumbai Central</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Repair Progress */}
            <section>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Repair Progress</h4>
              <div className="space-y-4">
                {Object.entries(STATUS_CONFIG).map(([key, config], index) => {
                  const statusKey = key as RepairStatus;
                  const isCurrent = statusKey === "repairing"
                  const isPast = index < 3 // 'repairing' is index 3
                  
                  return (
                    <div key={key} className="flex items-center gap-4">
                      <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${isCurrent ? 'border-primary bg-primary animate-pulse' : isPast ? 'border-primary bg-primary' : 'border-border bg-background'}`} />
                      <div className={`flex-1 p-3 rounded-lg border ${isCurrent ? 'bg-primary/5 border-primary/20' : 'bg-transparent border-transparent'}`}>
                        <p className={`font-medium ${isCurrent || isPast ? 'text-foreground' : 'text-muted-foreground'}`}>{config.label}</p>
                        {isCurrent && <p className="text-xs text-muted-foreground mt-1">Technician Alex is currently working on the device.</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
            
          </div>
        </div>

      </div>
    </div>
  )
}
