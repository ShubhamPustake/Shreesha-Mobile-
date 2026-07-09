import { Check, Clock, Wrench, Truck, Package, PackageCheck } from "lucide-react"

export type RepairStatus = 
  | "received"
  | "picked_up"
  | "diagnostic"
  | "repairing"
  | "ready"
  | "completed"

const TIMELINE_STEPS = [
  { id: "received", label: "Request Received", icon: Package, description: "Your repair request has been logged." },
  { id: "picked_up", label: "Device Received", icon: Truck, description: "We have your device at our center." },
  { id: "diagnostic", label: "Diagnostic", icon: Clock, description: "Assessing the issue and preparing estimate." },
  { id: "repairing", label: "Repairing", icon: Wrench, description: "Our experts are fixing your device." },
  { id: "ready", label: "Ready for Delivery", icon: PackageCheck, description: "Repair is complete. Awaiting dispatch." },
  { id: "completed", label: "Completed", icon: Check, description: "Device delivered to customer." },
]

interface RepairTimelineProps {
  currentStatus: RepairStatus
}

export function RepairTimeline({ currentStatus }: RepairTimelineProps) {
  const currentIndex = TIMELINE_STEPS.findIndex(step => step.id === currentStatus)

  return (
    <div className="py-8">
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border/50 md:left-1/2 md:-ml-[1px]" />
        
        <div className="space-y-12">
          {TIMELINE_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex
            const isCurrent = index === currentIndex
            const Icon = step.icon

            return (
              <div key={step.id} className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Content Side (Hidden on Mobile if on wrong side, shown normally) */}
                <div className={`hidden md:block w-5/12 ${index % 2 === 0 ? 'text-left pl-8' : 'text-right pr-8'}`}>
                  <h4 className={`text-lg font-bold ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>

                {/* Mobile Content Side */}
                <div className="md:hidden ml-16 flex-1">
                  <h4 className={`text-lg font-bold ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>

                {/* Icon Marker */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 border-background bg-card z-10 shadow-sm transition-all duration-300">
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${
                    isCurrent ? 'bg-primary text-primary-foreground animate-pulse' 
                    : isCompleted ? 'bg-accent text-accent-foreground' 
                    : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
