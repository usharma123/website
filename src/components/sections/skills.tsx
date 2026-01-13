'use client'

import { motion } from 'framer-motion'
import React from 'react'
import SKILLS from '@/data/skills'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.06,
    },
  },
} as const

const iconVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 180,
      damping: 14,
    },
  },
} as const

export default function Skills() {
  return (
    <div className="mb-14">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight">
          <span className="highlight-teal">Skills</span> & Tools
        </h2>

        {/* Decorative element */}
        <motion.div
          className="absolute -top-1 right-0 w-4 h-4 bg-[var(--color-accent-lime)] border-2 border-[var(--color-border)] rotate-45 hidden sm:block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative bg-[var(--color-secondary-background)] border-l-6 border-[var(--color-accent-teal)] rounded-[var(--radius-base)] shadow-[var(--shadow-shadow)] p-6 sm:p-8 w-full md:max-w-[48rem] neo-card overflow-hidden"
      >
        {/* Corner decoration */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-accent-yellow)] border-3 border-[var(--color-border)] hidden sm:block" />

        <div className="relative">
          {/* vertical divider */}
          <div className="absolute inset-y-0 left-[calc(7rem+0.75rem)] w-1 bg-[var(--color-border)]" />

          {/* FRONTEND */}
          <div className="flex items-center gap-x-6 pb-5 mb-5 border-b-3 border-[var(--color-border)]">
            <div className="w-28 flex-shrink-0">
              <h3 className="font-heading font-bold text-base sm:text-lg whitespace-nowrap">
                {SKILLS[0].field}
              </h3>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-x-5 gap-y-4"
            >
              {SKILLS[0].skills.map((skill, idx) => (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        variants={iconVariants}
                        whileHover={{
                          scale: 1.25,
                          rotate: [0, -12, 12, 0],
                          transition: { duration: 0.35 },
                        }}
                        whileTap={{ scale: 0.85 }}
                        className="cursor-pointer p-2 rounded-[var(--radius-base)] border-2 border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-accent-yellow)] transition-all"
                      >
                        <skill.icon className="h-7 w-7 sm:h-8 sm:w-8 transition-colors" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent className="font-heading font-semibold border-3 border-[var(--color-border)] bg-[var(--color-secondary-background)] text-[var(--color-foreground)] shadow-[3px_3px_0_0_var(--border)]">
                      {skill.skill}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </motion.div>
          </div>

          {/* BACKEND */}
          <div className="flex items-center gap-x-6">
            <div className="w-28 flex-shrink-0">
              <h3 className="font-heading font-bold text-base sm:text-lg whitespace-nowrap">
                {SKILLS[1].field}
              </h3>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-x-5 gap-y-4"
            >
              {SKILLS[1].skills.map((skill, idx) => (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        variants={iconVariants}
                        whileHover={{
                          scale: 1.25,
                          rotate: [0, -12, 12, 0],
                          transition: { duration: 0.35 },
                        }}
                        whileTap={{ scale: 0.85 }}
                        className="cursor-pointer p-2 rounded-[var(--radius-base)] border-2 border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-accent-teal)] transition-all"
                      >
                        <skill.icon className="h-7 w-7 sm:h-8 sm:w-8 transition-colors" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent className="font-heading font-semibold border-3 border-[var(--color-border)] bg-[var(--color-secondary-background)] text-[var(--color-foreground)] shadow-[3px_3px_0_0_var(--border)]">
                      {skill.skill}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom decorative dots */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-60">
          <div className="w-2.5 h-2.5 bg-[var(--color-accent-teal)] border-2 border-[var(--color-border)]" />
          <div className="w-2.5 h-2.5 bg-[var(--color-accent-yellow)] border-2 border-[var(--color-border)] rotate-45" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-main)] border-2 border-[var(--color-border)]" />
        </div>
      </motion.div>
    </div>
  )
}
