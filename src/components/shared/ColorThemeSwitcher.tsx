"use client"

import { useColorTheme } from "@/components/ColorThemeProvider"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

const themes = [
  { name: "Royal Blue", value: "blue", color: "bg-blue-600" },
  { name: "Emerald Green", value: "green", color: "bg-emerald-500" },
  { name: "Sunset Orange", value: "orange", color: "bg-orange-500" },
  { name: "Amethyst Purple", value: "purple", color: "bg-purple-500" },
  { name: "Crimson Red", value: "red", color: "bg-red-500" },
] as const

export function ColorThemeSwitcher() {
  const { color, setColor } = useColorTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 relative" title="Choose Color Theme">
        <Palette className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((theme) => (
          <DropdownMenuItem 
            key={theme.value}
            onClick={() => setColor(theme.value)}
            className={`cursor-pointer flex items-center justify-between ${color === theme.value ? "bg-muted" : ""}`}
          >
            <span>{theme.name}</span>
            <div className={`w-4 h-4 rounded-full ${theme.color}`} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
