"use client"

import { usePathname } from "next/navigation"
import { Bell, Search, Menu, UserCircle, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export function AdminHeader() {
  const pathname = usePathname()

  // Hide header on POS page for maximum screen space or on Login page
  if (pathname === "/admin/pos" || pathname === "/admin/login") {
    return null
  }

  // Generate title from pathname
  const getTitle = () => {
    if (pathname === "/admin") return "Dashboard Overview"
    const segment = pathname.split("/").pop()
    if (!segment) return "Dashboard"
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight hidden sm:block">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        <div className="relative w-full max-w-md hidden lg:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search orders, products, or repairs..." 
            className="pl-9 bg-muted/50 border-none"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>

        <Link href="/" className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:flex" })}>
          <Globe className="h-4 w-4 mr-2" />
          View Site
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full h-8 w-8 flex items-center justify-center outline-none hover:bg-muted transition-colors">
            <UserCircle className="h-6 w-6 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@shreeshamobile.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
      </div>
    </header>
  )
}
