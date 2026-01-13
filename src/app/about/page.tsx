'use client'

import { motion } from 'framer-motion'
import Experience from '@/components/sections/experience'
import Skills from '@/components/sections/skills'

export default function About() {
  return (
    <div className="font-base mt-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">
          <span className="inline-block bg-[var(--color-accent-yellow)] px-2 py-0.5 border-3 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--border)] mr-2">About</span>
          Me
        </h1>

        {/* Decorative shapes */}
        <motion.div
          className="absolute -top-1 right-4 w-5 h-5 bg-[var(--color-accent-teal)] border-3 border-[var(--color-border)] rotate-12 hidden sm:block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        />
      </motion.div>

      {/* Bio Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative bg-[var(--color-secondary-background)] border-3 border-[var(--color-border)] shadow-[6px_6px_0px_0px_var(--border)] p-6 sm:p-8 mb-12 overflow-hidden"
      >
        {/* Side accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-main)] to-[var(--color-accent-teal)]" />

        {/* Corner decoration */}
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-accent-yellow)] border-3 border-[var(--color-border)] hidden sm:block" />

        <div className="text-base sm:text-lg leading-relaxed pl-3">
          <p>
            I&apos;m a builder at the intersection of{' '}
            <span className="font-semibold bg-[var(--color-accent-yellow)]/80 px-1 border-2 border-[var(--color-border)]">AI</span>,{' '}
            <span className="font-semibold bg-[var(--color-accent-teal)]/80 px-1 border-2 border-[var(--color-border)]">finance</span>, and{' '}
            <span className="font-semibold bg-[var(--color-accent-purple)]/80 px-1 border-2 border-[var(--color-border)]">healthcare</span>, passionate about turning complex, manual workflows into smart systems.
            I co-founded Patent-It AI to streamline patent and legal diligence, cutting hours of work to minutes.
            With a background in biomedical sciences, AI, and clinical research, I&apos;ve led teams across projects from GAN-based medical imaging to agentic RAG tools for litigation.
          </p>
        </div>

        {/* Bottom dots */}
        <motion.div
          className="absolute bottom-3 right-3 flex gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-2.5 h-2.5 bg-[var(--color-main)] border-2 border-[var(--color-border)]" />
          <div className="w-2.5 h-2.5 bg-[var(--color-accent-yellow)] border-2 border-[var(--color-border)] rotate-45" />
          <div className="w-2.5 h-2.5 bg-[var(--color-accent-teal)] border-2 border-[var(--color-border)]" />
        </motion.div>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="neo-divider mb-12"
      />

      <Skills />

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="neo-divider mb-12"
      />

      <Experience />
    </div>
  )
}
