'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import * as React from 'react'

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()

  return (
    <>
      <button 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="transition-all rounded-full p-2 border-2 border-transparent hover:border-black hover:bg-[var(--color-main,#e0e0e0)] hover:bg-opacity-60 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main,#e0e0e0)]"
      >
        <Sun className="stroke-main-foreground hidden size-4 sm:size-6 dark:inline" />
        <Moon className="stroke-main-foreground inline size-4 sm:size-6 dark:hidden" />
        <span className="sr-only">Toggle theme</span>
      </button>
    </>
  )
}
