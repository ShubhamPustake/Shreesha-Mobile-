"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type ThemeColor = "blue" | "green" | "orange" | "purple" | "red"

interface ColorThemeContextType {
  color: ThemeColor
  setColor: (color: ThemeColor) => void
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined)

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [color, setColorState] = useState<ThemeColor>("blue")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedColor = localStorage.getItem("color-theme") as ThemeColor
    if (storedColor) {
      setColorState(storedColor)
      applyColorTheme(storedColor)
    }
  }, [])

  const applyColorTheme = (newColor: ThemeColor) => {
    const root = document.documentElement
    
    // Remove all theme classes first
    root.classList.remove("theme-blue", "theme-green", "theme-orange", "theme-purple", "theme-red")
    
    if (newColor !== "blue") {
      root.classList.add(`theme-${newColor}`)
    }
  }

  const setColor = (newColor: ThemeColor) => {
    setColorState(newColor)
    localStorage.setItem("color-theme", newColor)
    applyColorTheme(newColor)
  }

  // Avoid rendering anything that depends on the client-side state until mounted
  // but we MUST provide the context so children don't throw during SSR.
  const contextValue = { 
    color: mounted ? color : "blue" as ThemeColor, 
    setColor 
  }

  return (
    <ColorThemeContext.Provider value={contextValue}>
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext)
  if (!context) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider")
  }
  return context
}
