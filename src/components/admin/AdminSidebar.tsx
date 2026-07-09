"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  PackageSearch, 
  Wrench, 
  ClipboardList, 
  Settings,
  LogOut,
  Users,
  Smartphone,
  Cpu,
  Briefcase,
  Truck,
  Landmark,
  LineChart,
  Ticket,
  Layers,
  Tags
} from "lucide-react"
import { logoutAction } from "@/actions/auth"

export function AdminSidebar() {
  const pathname = usePathname()

  // Hide sidebar on POS page for maximum screen space and on Login page
  if (pathname === "/admin/pos" || pathname === "/admin/login") {
    return null
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Point of Sale (POS)", href: "/admin/pos", icon: ShoppingCart },
    { name: "Inventory", href: "/admin/inventory", icon: PackageSearch },
    { name: "Products", href: "/admin/products", icon: Smartphone },
    { name: "Brands", href: "/admin/brands", icon: Tags },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Spare Parts", href: "/admin/parts", icon: Cpu },
    { name: "Repairs", href: "/admin/repairs", icon: Wrench },
    { name: "Orders", href: "/admin/orders", icon: ClipboardList },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Suppliers", href: "/admin/suppliers", icon: Truck },
    { name: "Finance", href: "/admin/finance", icon: Landmark },
    { name: "Reports & Analytics", href: "/admin/reports", icon: LineChart },
    { name: "Coupons", href: "/admin/coupons", icon: Ticket },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border/50 bg-card/50 backdrop-blur-md hidden md:flex flex-col h-full glass-panel rounded-none border-t-0 border-b-0 border-l-0">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Link href="/" className="font-bold text-xl tracking-tighter text-primary">
          Shreesha<span className="text-foreground">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin")
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <form action={logoutAction}>
          <button type="submit" className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  )
}
