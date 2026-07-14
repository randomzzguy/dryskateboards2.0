"use client"

import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState<boolean>(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme")
      if (stored) {
        setIsLight(stored === "light")
        document.documentElement.classList.toggle("theme-light", stored === "light")
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        setIsLight(true)
        document.documentElement.classList.add("theme-light")
      }
    } catch (e) {
      // ignore
    }
  }, [])

  function toggle() {
    const next = !isLight
    setIsLight(next)
    try {
      document.documentElement.classList.toggle("theme-light", next)
      localStorage.setItem("theme", next ? "light" : "dark")
    } catch (e) {
      // ignore
    }
  }

  return (
    <button
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      onClick={toggle}
      className="px-3 py-1 rounded-md text-xs tracking-widest uppercase border transition-colors duration-200"
      style={{ borderColor: "var(--color-border)", color: "var(--color-foreground)", background: isLight ? "var(--color-card)" : "transparent" }}
    >
      {isLight ? "Light" : "Dark"}
    </button>
  )
}
