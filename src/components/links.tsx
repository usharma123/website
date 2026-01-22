'use client'

import { motion } from 'framer-motion'
import { SiGithub, SiGmail } from '@icons-pack/react-simple-icons'
import { Linkedin, LucideIcon } from 'lucide-react'

type IconComponent = typeof SiGithub | LucideIcon

interface LinkItem {
  icon: IconComponent
  href: string
  label: string
  color: string
}

export default function Links() {
  const links: LinkItem[] = [
    {
      icon: SiGmail,
      href: 'https://mail.google.com/mail/?view=cm&to=utsav1@seas.upenn.edu',
      label: 'Email',
      color: 'var(--accent-yellow)',
    },
    {
      icon: SiGithub,
      href: 'https://github.com/usharma123',
      label: 'GitHub',
      color: 'var(--accent-teal)',
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/usharma124/',
      label: 'LinkedIn',
      color: 'var(--accent-lime)',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 1.2,
        staggerChildren: 0.15,
      },
    },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.7 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  } as const

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mr-auto mt-10 flex w-full flex-wrap items-center gap-4"
    >
      {links.map((link, id) => {
        const Icon = link.icon
        return (
          <motion.a
            key={id}
            variants={itemVariants}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-4 border-4 border-[var(--color-border)] bg-[var(--color-secondary-background)] shadow-[6px_6px_0px_0px_var(--border)] transition-all overflow-hidden"
            whileHover={{
              x: -4,
              y: -4,
              boxShadow: '10px 10px 0px 0px var(--border)',
            }}
            whileTap={{ x: 6, y: 6, boxShadow: 'none' }}
            aria-label={link.label}
          >
            {/* Hover background effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: link.color }}
            />

            <Icon className="relative z-10 w-7 h-7 transition-transform group-hover:scale-110" />

            {/* Bold Tooltip */}
            <motion.span
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-[var(--color-border)] text-[var(--color-background)] border-3 border-[var(--color-border)] opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-[3px_3px_0_0_var(--main)]"
            >
              {link.label}
            </motion.span>

            {/* Corner decoration */}
            <div
              className="absolute -top-1.5 -right-1.5 w-4 h-4 border-3 border-[var(--color-border)] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: link.color }}
            />
          </motion.a>
        )
      })}
    </motion.div>
  )
}
