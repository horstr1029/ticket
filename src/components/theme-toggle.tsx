"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`size-8 ${className ?? ""}`}
      onClick={toggleTheme}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon className="size-4" style={{ color: "var(--rk-text2)" }} />
      ) : (
        <Sun className="size-4" style={{ color: "var(--rk-text2)" }} />
      )}
    </Button>
  )
}
