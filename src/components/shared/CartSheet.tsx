"use client"

import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { useCartStore } from "@/store/cartStore"
import Link from "next/link"

export function CartSheet() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore()
  const itemCount = getItemCount()

  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full relative" })}>
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col glass-panel border-l border-white/10">
        <SheetHeader>
          <SheetTitle>Your Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="h-20 w-20 bg-muted rounded-md flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-sm font-semibold text-primary mt-1">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex-col gap-4 border-t border-border/50 pt-4">
            <div className="flex items-center justify-between w-full font-semibold text-lg">
              <span>Total</span>
              <span>₹{getTotal().toLocaleString()}</span>
            </div>
            <Link href="/checkout" className={buttonVariants({ size: "lg", className: "w-full" })}>
              Proceed to Checkout
            </Link>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
