'use client'

import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { ThemeSwitcher } from './theme-switcher'

export default function Nav() {
  const path = usePathname()

  const links = [
    {
      path: '/',
      text: 'Home',
    },
    {
      path: '/about',
      text: 'About',
    },
    {
      path: '/work',
      text: 'Work',
    },
    {
      path: '/blog',
      text: 'Blog',
    },
  ]

  return (
    <div className="fixed top-5 left-0 z-50 w-full flex justify-center">
      <nav className="text-main-foreground border-border shadow-shadow rounded-base bg-main font-base flex items-center max-w-2xl mx-auto gap-1 sm:gap-6 border-2 p-1.5 px-1 sm:p-2.5 sm:px-8 text-sm sm:text-base overflow-x-auto">
        <div className="flex flex-1 items-center gap-1 sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              className={clsx(
                'hover:border-border rounded-base border-2 px-2 py-1 sm:px-4 sm:py-2 transition-colors',
                path === link.path ? 'border-border' : 'border-transparent',
              )}
              href={link.path}
            >
              {link.text}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-center ml-1 sm:ml-6">
          <ThemeSwitcher />
        </div>
      </nav>
    </div>
  )
}
