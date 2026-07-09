"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Search, User, Menu } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartSheet } from "@/components/shared/CartSheet"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { signOut } from "next-auth/react"

export function Header({ session }: { session?: any }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-xl shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
              <Image src="/logo.png" alt="Shreesha Mobile Logo" fill className="object-cover" />
            </div>
            <span className="font-extrabold text-2xl tracking-tighter bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">
              Shreesha<span className="text-foreground">Mobile</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
          {[
            { name: "Category", href: "/category" },
            { name: "Mobiles", href: "/mobiles" },
            { name: "Accessories", href: "/accessories" },
            { name: "Book Repair", href: "/repairs" },
            { name: "Track Repair", href: "/track" },
            { name: "Contact Us", href: "/contact" },
          ].map((item) => (
            <Link key={item.name} href={item.href} className="relative group text-muted-foreground hover:text-foreground transition-colors py-2">
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
          ))}
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex items-center relative w-full max-w-sm ml-4 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
          <Input 
            type="search" 
            placeholder="Search products..." 
            className="pl-10 h-10 rounded-full bg-secondary/60 border-transparent focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:bg-background transition-all shadow-inner" 
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2">
          
          {!session ? (
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Log in
              </Link>
              <Link href="/login?tab=register" className={buttonVariants({ variant: "default", size: "sm" })}>
                Sign Up
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full hover:bg-primary/10 hover:text-primary transition-colors" })}>
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium text-primary mb-1">
                  Hi, {session.user?.name?.split(' ')[0] || "User"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard" className="w-full cursor-pointer">My Account</Link>
                </DropdownMenuItem>
                {session.user?.role !== "CUSTOMER" && (
                  <DropdownMenuItem>
                    <Link href="/admin" className="w-full cursor-pointer">Admin Portal</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ThemeToggle />
          <CartSheet />

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden" })}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="glass-panel w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">Home</Link>
                <Link href="/category" className="text-lg font-medium">Category</Link>
                <Link href="/mobiles" className="text-lg font-medium">Mobiles</Link>
                <Link href="/accessories" className="text-lg font-medium">Accessories</Link>
                <Link href="/repairs" className="text-lg font-medium">Book Repair</Link>
                <Link href="/track" className="text-lg font-medium">Track Repair</Link>
                <Link href="/contact" className="text-lg font-medium">Contact Us</Link>
              </nav>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  )
}
