'use client'

import { motion } from 'framer-motion'
import {
  IconType,
  SiGithub,
  SiGmail,
  SiLinkedin,
} from '@icons-pack/react-simple-icons'

export default function Links() {
  const links: { icon: IconType; href: string; label: string }[] = [
    {
      icon: SiGmail,
      href: 'mailto:utsav1@seas.upenn.edu',
      label: 'Email',
    },
    {
      icon: SiGithub,
      href: 'https://github.com/usharma123',
      label: 'GitHub',
    },
    {
      icon: SiLinkedin,
      href: 'https://www.linkedin.com/in/usharma124/',
      label: 'LinkedIn',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 1.8,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mr-auto mt-16 flex w-full flex-wrap items-center gap-6"
    >
      {links.map((link, id) => {
        const Icon = link.icon
        return (
          <motion.a
            key={id}
            variants={itemVariants}
            target="_blank"
            href={link.href}
            className="group relative p-3 rounded-[var(--radius-base)] border-2 border-[var(--color-border)] bg-[var(--color-secondary-background)] shadow-[var(--shadow-shadow)] transition-all neo-button"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            aria-label={link.label}
          >
            <Icon 
              title="" 
              className="w-6 h-6 transition-transform group-hover:scale-110" 
            />
            {/* Tooltip */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium bg-[var(--color-border)] text-[var(--color-background)] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {link.label}
            </span>
          </motion.a>
        )
      })}
    </motion.div>
  )
}
