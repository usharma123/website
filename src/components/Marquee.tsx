'use client'

import { motion } from 'framer-motion'

interface MarqueeProps {
  items: string[]
  speed?: number
  direction?: 'left' | 'right'
  className?: string
}

export default function Marquee({
  items,
  speed = 25,
  direction = 'left',
  className = '',
}: MarqueeProps) {
  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items]

  return (
    <div className={`marquee-container overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: direction === 'left' ? [0, '-50%'] : ['-50%', 0],
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="flex items-center gap-4 text-sm sm:text-base font-heading font-semibold uppercase tracking-wide"
          >
            <span className="w-2 h-2 bg-[var(--color-main)] border-2 border-[var(--color-border)] rotate-45" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
