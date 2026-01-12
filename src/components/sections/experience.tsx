'use client'

import { motion } from 'framer-motion'
import PAST_ROLES from '@/data/experience'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.35,
      staggerChildren: 0.22,
    },
  },
} as const

const cardVariants = {
  hidden: { opacity: 0, x: -60, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as const

const accentColors = ['var(--accent-yellow)', 'var(--accent-teal)', 'var(--accent-purple)', 'var(--accent-lime)']

export default function Experience() {
  return (
    <div className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative mb-10"
      >
        <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight">
          <span className="highlight">Experience</span>
        </h2>

        {/* Decorative element */}
        <motion.div
          className="absolute -top-1 right-0 w-4 h-4 bg-[var(--color-main)] border-2 border-[var(--color-border)] hidden sm:block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        />
      </motion.div>

      {/* Timeline container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative pl-10 sm:pl-14"
      >
        {/* Animated vertical timeline line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-[13px] sm:left-[17px] top-3 bottom-3 w-1 origin-top bg-[var(--color-border)]"
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, var(--main), var(--accent-teal) 50%, var(--accent-yellow))',
            }}
          />
        </motion.div>

        {PAST_ROLES.map((role, id) => {
          const isPresent = role.endDate === 'Present'
          const accentColor = accentColors[id % accentColors.length]

          return (
            <motion.div
              key={id}
              variants={cardVariants}
              className="relative mb-10 last:mb-0 group"
            >
              {/* Timeline node */}
              <div className="absolute -left-10 sm:-left-14 top-1 flex items-center justify-center">
                {/* Pulse ring for current role */}
                {isPresent && (
                  <motion.div
                    className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                    style={{ background: `${accentColor}40` }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Main dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + id * 0.22, duration: 0.5, type: 'spring', stiffness: 180 }}
                  className={`
                    relative z-10 w-7 h-7 sm:w-8 sm:h-8
                    border-3 border-[var(--color-border)]
                    ${isPresent ? '' : 'bg-[var(--color-secondary-background)]'}
                    group-hover:scale-115 transition-transform duration-250
                  `}
                  style={{ background: isPresent ? accentColor : undefined }}
                >
                  {/* Inner dot for current */}
                  {isPresent && (
                    <div className="absolute inset-[6px] sm:inset-[7px] bg-[var(--color-main-foreground)]" />
                  )}
                </motion.div>
              </div>

              {/* Card */}
              <motion.div
                whileHover={{
                  x: 8,
                  y: -3,
                  transition: { duration: 0.25 },
                }}
                className="relative bg-[var(--color-secondary-background)] border-3 border-[var(--color-border)] rounded-[var(--radius-base)] shadow-[var(--shadow-shadow)] overflow-hidden neo-card"
              >
                {/* Accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ background: accentColor }}
                />

                {/* Corner decoration */}
                <motion.div
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 border-2 border-[var(--color-border)] hidden sm:block"
                  style={{ background: accentColor }}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 12 }}
                  transition={{ delay: 0.7 + id * 0.15, type: 'spring' }}
                />

                <div className="p-5 sm:p-6 pl-6 sm:pl-7">
                  {/* Header with date badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                      <motion.h3
                        className="text-lg sm:text-xl font-heading font-bold leading-tight tracking-tight"
                        whileHover={{ color: 'var(--main)' }}
                      >
                        {role.role}
                      </motion.h3>
                      <p
                        className="text-base font-semibold mt-1"
                        style={{ color: accentColor }}
                      >
                        @ {role.company}
                      </p>
                    </div>

                    {/* Date badge */}
                    <div
                      className={`
                        inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius-base)]
                        border-3 border-[var(--color-border)] text-xs sm:text-sm font-heading font-semibold
                        whitespace-nowrap shrink-0
                      `}
                      style={{
                        background: isPresent ? accentColor : 'var(--background)',
                        color: isPresent ? 'var(--main-foreground)' : 'var(--foreground)',
                      }}
                    >
                      {isPresent && (
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-main-foreground)] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-main-foreground)]" />
                        </span>
                      )}
                      {role.startDate} — {role.endDate}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base leading-relaxed opacity-85">
                    {role.description}
                  </p>
                </div>

                {/* Bottom decorative element */}
                <div className="absolute bottom-2 right-3 flex gap-1.5 opacity-40">
                  <div className="w-2 h-2 bg-[var(--color-border)]" />
                  <div className="w-2 h-2 rotate-45" style={{ background: accentColor }} />
                  <div className="w-2 h-2 rounded-full bg-[var(--color-border)]" />
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
