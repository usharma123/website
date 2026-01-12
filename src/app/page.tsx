'use client'

import { motion } from 'framer-motion'
import Links from '@/components/links'
import { FloatingShapes } from '@/components/motion'

export default function Home() {
  return (
    <>
      <FloatingShapes />

      {/* Hero Section */}
      <div className="relative">
        {/* Vertical accent line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -left-6 top-0 w-1.5 h-full bg-gradient-to-b from-[var(--color-main)] via-[var(--color-accent-teal)] to-[var(--color-accent-purple)] origin-top"
        />

        <div className="flex flex-col sm:flex-row items-start gap-10 sm:gap-14 font-base">
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative shrink-0 group"
          >
            {/* Tape decoration */}
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[var(--color-accent-yellow)] border-3 border-[var(--color-border)] rotate-[-3deg] z-20 shadow-[3px_3px_0px_0px_var(--border)]"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            />

            <motion.div
              className="relative"
              whileHover={{ rotate: 2, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <img
                src="/avatar.png"
                alt="Utsav Sharma Avatar"
                className="w-44 h-44 sm:w-56 sm:h-56 object-cover border-4 border-[var(--color-border)] shadow-[8px_8px_0px_0px_var(--border)] bg-[var(--color-secondary-background)] transition-shadow group-hover:shadow-[12px_12px_0px_0px_var(--border)]"
              />

              {/* Corner decorations */}
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--color-main)] border-3 border-[var(--color-border)]"
                animate={{ rotate: [0, 90, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -bottom-2 -left-2 w-6 h-6 bg-[var(--color-accent-teal)] border-3 border-[var(--color-border)]"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -bottom-3 -right-3 w-5 h-5 bg-[var(--color-accent-purple)] border-3 border-[var(--color-border)] rotate-45"
                animate={{ rotate: [45, 135, 45] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Status badge */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: -6 }}
              transition={{ delay: 0.9, duration: 0.5, type: 'spring', stiffness: 200 }}
              className="absolute -bottom-4 -right-6 px-3 py-1.5 bg-[var(--color-accent-lime)] border-3 border-[var(--color-border)] shadow-[3px_3px_0px_0px_var(--border)] font-heading font-bold text-xs tracking-wide"
            >
              Open to Work
            </motion.div>
          </motion.div>

          <div className="flex-1">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.1]">
                <motion.span
                  className="inline-block bg-[var(--color-accent-yellow)] px-3 py-1 border-3 border-[var(--color-border)] shadow-[5px_5px_0px_0px_var(--border)] mr-2"
                  whileHover={{
                    y: -4,
                    x: -4,
                    boxShadow: '9px 9px 0px 0px var(--border)',
                    transition: { duration: 0.2 }
                  }}
                >
                  Utsav
                </motion.span>
                <span className="inline-block">Sharma</span>
              </h1>
            </motion.div>

            {/* Role subtitle */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4 text-lg sm:text-xl font-heading font-medium text-[var(--color-foreground)]/70"
            >
              Software Engineer & Builder
            </motion.p>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-5 flex items-center gap-2.5 flex-wrap"
            >
              {[
                { text: 'Full Stack', color: 'var(--color-main)' },
                { text: 'AI/ML', color: 'var(--color-accent-teal)' },
                { text: 'UPenn SEAS', color: 'var(--color-accent-lime)' },
              ].map((tag, i) => (
                <motion.span
                  key={tag.text}
                  className="px-3 py-1.5 border-3 border-[var(--color-border)] shadow-[3px_3px_0px_0px_var(--border)] font-heading font-semibold text-sm"
                  style={{ background: tag.color }}
                  whileHover={{
                    y: -2,
                    x: -2,
                    boxShadow: '5px 5px 0px 0px var(--border)'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  {tag.text}
                </motion.span>
              ))}
            </motion.div>

            {/* Bio Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 p-5 sm:p-6 bg-[var(--color-secondary-background)] border-3 border-[var(--color-border)] shadow-[6px_6px_0px_0px_var(--border)] relative overflow-hidden"
            >
              {/* Corner accent */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-main)] border-3 border-[var(--color-border)] hidden sm:block" />

              {/* Side accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-accent-teal)] to-[var(--color-accent-purple)]" />

              <p className="text-base sm:text-lg leading-relaxed pl-3">
                Master&apos;s student at{' '}
                <span className="font-semibold bg-[var(--color-accent-yellow)]/80 px-1.5 py-0.5 border-2 border-[var(--color-border)] whitespace-nowrap">
                  UPenn School of Engineering
                </span>{' '}
                studying Computer Science. Currently building at{' '}
                <span className="font-semibold bg-[var(--color-accent-teal)]/80 px-1.5 py-0.5 border-2 border-[var(--color-border)]">
                  Xoriant
                </span>{' '}
                as a software engineer.
              </p>
            </motion.div>

            {/* Social Links */}
            <Links />
          </div>
        </div>
      </div>

      {/* Decorative divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-16 neo-divider"
      />

      {/* Bottom dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="neo-divider-dots mt-4"
      >
        <span />
        <span />
        <span />
      </motion.div>
    </>
  )
}
