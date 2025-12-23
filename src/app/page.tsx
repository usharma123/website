'use client'

import { motion } from 'framer-motion'
import Links from '@/components/links'
import { FloatingShapes } from '@/components/motion'

export default function Home() {
  const words = "Hi, I am a Master's student at UPenn's School of Engineering and Applied Science studying Computer Science and currently working as a software engineer at Xoriant.".split(' ')

  return (
    <>
      <FloatingShapes />
      <div className="flex flex-col sm:flex-row items-start gap-8 font-base mt-12">
        {/* Floating Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02, rotate: 2 }}
          className="relative"
        >
          <motion.img
            src="/avatar.png"
            alt="Utsav Sharma Avatar"
            className="w-40 h-40 sm:w-56 sm:h-56 object-cover rounded-[var(--radius-base)] border-2 border-[var(--color-border)] shadow-[var(--shadow-shadow)] bg-[var(--color-secondary-background)]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Decorative elements around avatar */}
          <motion.div
            className="absolute -top-3 -right-3 w-6 h-6 bg-[var(--color-main)] border-2 border-[var(--color-border)]"
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-[var(--color-secondary-background)] border-2 border-[var(--color-border)]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <div className="flex-1">
          {/* Animated Name */}
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-heading sm:text-4xl"
          >
            Utsav Sharma
          </motion.h1>

          {/* Animated Subtitle */}
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-2 text-lg sm:text-xl text-[var(--color-main)]"
          >
            Avid Learner
          </motion.p>

          {/* Word-by-word animated intro */}
          <div className="mt-8 text-base sm:text-lg">
            <p className="leading-relaxed">
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.4 + index * 0.03,
                    ease: 'easeOut',
                  }}
                  className="inline-block mr-1"
                >
                  {word}
                </motion.span>
              ))}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <br />
              <p>
                This is the neobrutalism portfolio template. Check the{' '}
                <motion.a
                  target="_blank"
                  className="font-heading underline decoration-2 underline-offset-4 hover:text-[var(--color-main)] transition-colors"
                  href="https://github.com/neobrutalism-templates/portfolio"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  github repo
                </motion.a>{' '}
                for more info.
              </p>
            </motion.div>
          </div>

          <Links />
        </div>
      </div>
    </>
  )
}
