'use client'

import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ThemeSwitcher } from './theme-switcher'

export default function Nav() {
  const path = usePathname()

  const links = [
    { path: '/', text: 'Home', color: 'var(--accent-yellow)' },
    { path: '/about', text: 'About', color: 'var(--accent-teal)' },
    { path: '/work', text: 'Work', color: 'var(--accent-lime)' },
    { path: '/blog', text: 'Blog', color: 'var(--accent-purple)' },
  ]

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 w-full flex justify-center relative z-50"
    >
      <nav className="relative text-main-foreground border-[var(--color-border)] shadow-[6px_6px_0px_0px_var(--border)] bg-[var(--color-main)] font-heading flex items-center max-w-2xl mx-auto gap-1 sm:gap-2 border-3 p-1.5 px-3 sm:p-2 sm:px-5 text-sm sm:text-base tracking-tight font-semibold">
        {/* Corner accents */}
        <motion.div
          className="absolute -top-2 -left-2 w-5 h-5 bg-[var(--color-accent-yellow)] border-3 border-[var(--color-border)] hidden sm:block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
        />
        <motion.div
          className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-accent-teal)] border-3 border-[var(--color-border)] rotate-45 hidden sm:block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
        />

        <div className="flex flex-1 items-center gap-0.5 sm:gap-1 relative">
          {links.map((link, index) => {
            const isActive = path === link.path ||
              (link.path !== '/' && path.startsWith(link.path))

            return (
              <Link
                key={link.path}
                href={link.path}
                className="relative px-2.5 py-1.5 sm:px-4 sm:py-2"
              >
                <motion.span
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
                  className="relative z-10 font-semibold text-xs sm:text-sm"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.text}
                </motion.span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 border-3 border-[var(--color-border)] shadow-[3px_3px_0px_0px_var(--border)]"
                    style={{ background: link.color }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="hidden sm:block w-0.5 h-8 bg-[var(--color-border)] mx-2"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex items-center justify-center ml-1"
        >
          <ThemeSwitcher />
        </motion.div>
      </nav>
    </motion.div>
  )
}
