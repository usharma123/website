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
      delayChildren: 0.2,
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
}

export default function Work() {
  return (
    <div className="mt-16">
      <motion.h1
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="font-heading mb-8 text-2xl sm:text-4xl"
      >
        Work
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6"
      >
        {PROJECTS.map((project, id) => {
          return (
            <motion.div
              key={id}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="border-border shadow-shadow rounded-base bg-main border-2 p-4 sm:p-5 neo-card group"
              style={{ perspective: '1000px' }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <AspectRatio
                  className="border-border shadow-shadow rounded-base -bottom-[2px]! border-2 overflow-hidden"
                  ratio={71 / 26}
                >
                  {project.previewImage && (
                    <motion.img
                      className="rounded-base w-full h-full object-cover object-center transition-transform duration-500"
                      src={project.previewImage}
                      alt={project.name}
                      whileHover={{ scale: 1.05 }}
                    />
                  )}
                </AspectRatio>
              </motion.div>

              <div className="text-main-foreground font-base mt-5">
                <motion.h2
                  className="font-heading text-xl sm:text-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {project.name}
                </motion.h2>

                <p className="mt-2">{project.description}</p>

                <div className="mt-8 grid grid-cols-2 gap-5">
                  <MagneticButton
                    href={project.liveLink}
                    target="_blank"
                    className="border-border bg-secondary-background text-foreground shadow-shadow rounded-base font-base cursor-pointer border-2 px-4 py-2 text-center text-sm sm:text-base neo-button hover:bg-[var(--color-main)] hover:text-[var(--color-main-foreground)] transition-colors"
                  >
                    Visit
                  </MagneticButton>
                  <MagneticButton
                    href={project.repoUrl}
                    target="_blank"
                    className="border-border bg-secondary-background text-foreground shadow-shadow rounded-base font-base cursor-pointer border-2 px-4 py-2 text-center text-sm sm:text-base neo-button hover:bg-[var(--color-main)] hover:text-[var(--color-main-foreground)] transition-colors"
                  >
                    Github
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
