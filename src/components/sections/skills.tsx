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
      delayChildren: 0.2,
      staggerChildren: 0.05,
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
      stiffness: 200,
      damping: 15,
    },
  },
} as const

export default function Skills() {
  return (
    <div className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-xl font-heading sm:text-2xl"
      >
        Skills
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="bg-white/80 dark:bg-[#18191a]
                   border-l-4 border-[var(--color-main)]
                   rounded-[var(--radius-base)]
                   shadow-[var(--shadow-shadow)]
                   p-6
                   w-full md:max-w-[48rem]
                   neo-card"
      >
        <div className="relative">
          {/* vertical divider */}
          <div className="absolute inset-y-0
                          left-[calc(7rem+0.75rem)]
                          w-px bg-black dark:bg-white" />

          {/* FRONTEND */}
          <div className="flex items-center gap-x-6 pb-4 mb-4 border-b border-black dark:border-white">
            <div className="w-28 flex-shrink-0">
              <h3 className="font-heading text-lg sm:text-xl whitespace-nowrap">
                {SKILLS[0].field}
              </h3>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              {SKILLS[0].skills.map((skill, idx) => (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        variants={iconVariants}
                        whileHover={{ 
                          scale: 1.2,
                          rotate: [0, -10, 10, 0],
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer"
                      >
                        <skill.icon className="h-8 w-8 sm:h-9 sm:w-9 transition-colors hover:text-[var(--color-main)]" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>{skill.skill}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </motion.div>
          </div>

          {/* BACKEND */}
          <div className="flex items-center gap-x-6">
            <div className="w-28 flex-shrink-0">
              <h3 className="font-heading text-lg sm:text-xl whitespace-nowrap">
                {SKILLS[1].field}
              </h3>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              {SKILLS[1].skills.map((skill, idx) => (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        variants={iconVariants}
                        whileHover={{ 
                          scale: 1.2,
                          rotate: [0, -10, 10, 0],
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer"
                      >
                        <skill.icon className="h-8 w-8 sm:h-9 sm:w-9 transition-colors hover:text-[var(--color-main)]" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>{skill.skill}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
