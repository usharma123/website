'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-11 h-11 rounded-[var(--radius-base)] border-3 border-transparent" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-11 h-11 rounded-[var(--radius-base)] p-2 border-3 border-[var(--color-border)] bg-[var(--color-secondary-background)] shadow-[3px_3px_0_0_var(--border)] hover:bg-[var(--color-accent-yellow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)] overflow-hidden transition-colors"
      whileHover={{
        scale: 1.08,
        boxShadow: '5px 5px 0 0 var(--border)',
      }}
      whileTap={{
        scale: 0.9,
        rotate: 15,
        boxShadow: '0 0 0 0 var(--border)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="stroke-[var(--color-foreground)] size-5 sm:size-6" strokeWidth={2.5} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="stroke-[var(--color-foreground)] size-5 sm:size-6" strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  )
}
