'use client'

import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ThemeSwitcher } from './theme-switcher'

export default function Nav() {
  const path = usePathname()

  const links = [
    { path: '/', text: 'Home' },
    { path: '/about', text: 'About' },
    { path: '/work', text: 'Work' },
    { path: '/blog', text: 'Blog' },
  ]

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      className="mt-5 w-full flex justify-center"
    >
      <nav className="text-main-foreground border-border shadow-shadow rounded-base bg-main font-base flex items-center max-w-2xl mx-auto gap-1 sm:gap-6 border-2 p-1.5 px-1 sm:p-2.5 sm:px-8 text-sm sm:text-base overflow-x-auto">
        <div className="flex flex-1 items-center gap-1 sm:gap-6 relative">
          {links.map((link, index) => {
            const isActive = path === link.path || 
              (link.path !== '/' && path.startsWith(link.path))
            
            return (
              <Link
                key={link.path}
                href={link.path}
                className="relative px-2 py-1 sm:px-4 sm:py-2"
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="relative z-10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.text}
                </motion.span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 border-2 border-border rounded-base bg-[var(--color-secondary-background)]/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex items-center justify-center ml-1 sm:ml-6"
        >
          <ThemeSwitcher />
        </motion.div>
      </nav>
    </motion.div>
  )
}
