'use client'

import { motion } from 'framer-motion'
import PAST_ROLES from '@/data/experience'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
} as const

const cardVariants = {
  hidden: { opacity: 0, x: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
} as const

export default function Experience() {
  return (
    <div className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10 text-xl font-heading sm:text-2xl"
      >
        Experience
      </motion.h2>

      {/* Timeline container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative pl-8 sm:pl-12"
      >
        {/* Animated vertical timeline line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-[3px] origin-top"
          style={{
            background: 'linear-gradient(to bottom, var(--main), var(--main) 60%, transparent)',
          }}
        />

        {PAST_ROLES.map((role, id) => {
          const isPresent = role.endDate === 'Present'
          
          return (
            <motion.div
              key={id}
              variants={cardVariants}
              className="relative mb-10 last:mb-0 group"
            >
              {/* Timeline node */}
              <div className="absolute -left-8 sm:-left-12 top-0 flex items-center justify-center">
                {/* Outer ring with pulse for current role */}
                {isPresent && (
                  <motion.div
                    className="absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--color-main)]/20"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                
                {/* Main dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + id * 0.2, duration: 0.4, type: 'spring', stiffness: 200 }}
                  className={`
                    relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full 
                    border-[3px] border-[var(--color-border)] 
                    ${isPresent 
                      ? 'bg-[var(--color-main)]' 
                      : 'bg-[var(--color-secondary-background)]'
                    }
                    group-hover:scale-110 transition-transform duration-200
                  `}
                >
                  {/* Inner dot for current */}
                  {isPresent && (
                    <div className="absolute inset-[5px] sm:inset-[6px] rounded-full bg-[var(--color-main-foreground)]" />
                  )}
                </motion.div>
              </div>

              {/* Card */}
              <motion.div
                whileHover={{ 
                  x: 6,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                className="relative bg-[var(--color-secondary-background)] border-2 border-[var(--color-border)] rounded-[var(--radius-base)] shadow-[var(--shadow-shadow)] overflow-hidden group-hover:shadow-[6px_6px_0px_0px_var(--border)] transition-shadow duration-200"
              >
                {/* Accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-main)]" />
                
                <div className="p-5 sm:p-6 pl-6 sm:pl-7">
                  {/* Header with date badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <motion.h3
                        className="text-lg font-heading sm:text-xl leading-tight"
                        whileHover={{ color: 'var(--main)' }}
                      >
                        {role.role}
                      </motion.h3>
                      <p className="text-base font-medium text-[var(--color-main)] mt-0.5">
                        @ {role.company}
                      </p>
                    </div>
                    
                    {/* Date badge */}
                    <div className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-base)] 
                      border-2 border-[var(--color-border)] text-xs sm:text-sm font-medium
                      ${isPresent 
                        ? 'bg-[var(--color-main)] text-[var(--color-main-foreground)]' 
                        : 'bg-[var(--color-background)]'
                      }
                      whitespace-nowrap shrink-0
                    `}>
                      {isPresent && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-main-foreground)] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-main-foreground)]"></span>
                        </span>
                      )}
                      {role.startDate} — {role.endDate}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm sm:text-base leading-relaxed opacity-90">
                    {role.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
