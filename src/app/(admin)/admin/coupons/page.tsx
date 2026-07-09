import { Construction } from "lucide-react"

export default function CouponsPage() {
  return (
    <div className="p-6 h-full flex flex-col items-center justify-center">
      <div className="glass-panel p-12 text-center rounded-2xl border-border/50 max-w-md">
        <Construction className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold tracking-tight mb-2">Coupons Module</h2>
        <p className="text-muted-foreground">This module is currently under development. Check back later!</p>
      </div>
    </div>
  )
}
