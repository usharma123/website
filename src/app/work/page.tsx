'use client'

import { motion } from 'framer-motion'
import PROJECTS from '@/data/projects'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { MagneticButton } from '@/components/motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.18,
    },
  },
} as const

const cardVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -12 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as const

const accentColors = ['var(--accent-yellow)', 'var(--accent-teal)', 'var(--accent-purple)', 'var(--accent-lime)']

export default function Work() {
  return (
    <div className="mt-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">
          My{' '}
          <span className="inline-block bg-[var(--color-accent-lime)] px-2 py-0.5 border-3 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--border)]">Work</span>
        </h1>

        {/* Decorative element */}
        <motion.div
          className="absolute -top-1 right-4 w-5 h-5 bg-[var(--color-main)] border-3 border-[var(--color-border)] rotate-45 hidden sm:block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        />
      </motion.div>

      {/* Project Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-8"
      >
        {PROJECTS.map((project, id) => {
          const accentColor = accentColors[id % accentColors.length]

          return (
            <motion.div
              key={id}
              variants={cardVariants}
              whileHover={{
                y: -6,
                transition: { duration: 0.25 },
              }}
              className="relative border-3 border-[var(--color-border)] shadow-[6px_6px_0px_0px_var(--border)] bg-[var(--color-main)] p-5 sm:p-6 group overflow-hidden hover:shadow-[10px_10px_0px_0px_var(--border)] transition-shadow"
              style={{ perspective: '1000px' }}
            >
              {/* Accent corner */}
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 border-3 border-[var(--color-border)] hidden sm:block"
                style={{ background: accentColor }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + id * 0.1, type: 'spring' }}
              />

              {/* Project number badge */}
              <motion.div
                className="absolute top-4 left-4 w-7 h-7 flex items-center justify-center bg-[var(--color-secondary-background)] border-3 border-[var(--color-border)] font-heading font-semibold text-xs z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + id * 0.1, type: 'spring' }}
              >
                {String(id + 1).padStart(2, '0')}
              </motion.div>

              {/* Image */}
              <motion.div
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.3 }}
              >
                <AspectRatio
                  className="border-3 border-[var(--color-border)] shadow-[var(--shadow-shadow)] rounded-[var(--radius-base)] overflow-hidden"
                  ratio={71 / 26}
                >
                  {project.previewImage && (
                    <motion.img
                      className="rounded-[var(--radius-base)] w-full h-full object-cover object-center"
                      src={project.previewImage}
                      alt={project.name}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </AspectRatio>
              </motion.div>

              {/* Content */}
              <div className="text-main-foreground font-base mt-6">
                <div className="flex items-start justify-between gap-4">
                  <motion.h2
                    className="font-heading font-bold text-lg sm:text-xl tracking-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {project.name}
                  </motion.h2>

                  {/* Tag */}
                  <div
                    className="shrink-0 px-2 py-1 border-2 border-[var(--color-border)] font-heading font-semibold text-[0.65rem] shadow-[2px_2px_0px_0px_var(--border)]"
                    style={{ background: accentColor }}
                  >
                    Project
                  </div>
                </div>

                <p className="mt-3 text-sm sm:text-base leading-relaxed opacity-90">
                  {project.description}
                </p>

                {/* Action Buttons */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MagneticButton
                    href={project.liveLink}
                    target="_blank"
                    className="relative border-3 border-[var(--color-border)] bg-[var(--color-secondary-background)] text-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--border)] font-heading font-semibold cursor-pointer px-4 py-2.5 text-center text-sm hover:bg-[var(--color-accent-yellow)] hover:shadow-[6px_6px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden"
                  >
                    <span className="relative z-10">Visit</span>
                  </MagneticButton>
                  <MagneticButton
                    href={project.repoUrl}
                    target="_blank"
                    className="relative border-3 border-[var(--color-border)] bg-[var(--color-secondary-background)] text-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--border)] font-heading font-semibold cursor-pointer px-4 py-2.5 text-center text-sm hover:bg-[var(--color-accent-teal)] hover:shadow-[6px_6px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden"
                  >
                    <span className="relative z-10">Github</span>
                  </MagneticButton>
                </div>
              </div>

              {/* Bottom decorative dots */}
              <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-60">
                <div className="w-2 h-2 bg-[var(--color-border)] rounded-full" />
                <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
                <div className="w-2 h-2 bg-[var(--color-border)]" />
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Bottom divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-12 neo-divider"
      />
    </div>
  )
}
