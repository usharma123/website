'use client'

import { motion } from 'framer-motion'

interface Shape {
  type: 'square' | 'circle' | 'cross'
  size: number
  x: string
  y: string
  delay: number
  duration: number
  rotate?: number
}

const shapes: Shape[] = [
  { type: 'square', size: 20, x: '10%', y: '20%', delay: 0, duration: 6, rotate: 45 },
  { type: 'circle', size: 16, x: '85%', y: '15%', delay: 1, duration: 5 },
  { type: 'cross', size: 24, x: '90%', y: '60%', delay: 0.5, duration: 7 },
  { type: 'square', size: 14, x: '5%', y: '70%', delay: 2, duration: 5.5 },
  { type: 'circle', size: 12, x: '75%', y: '80%', delay: 1.5, duration: 6.5 },
  { type: 'cross', size: 18, x: '15%', y: '45%', delay: 0.8, duration: 5.8 },
]

function ShapeComponent({ shape }: { shape: Shape }) {
  const baseClasses = 'absolute border-2 border-[var(--color-border)]'
  
  if (shape.type === 'square') {
    return (
      <motion.div
        className={`${baseClasses} bg-[var(--color-main)]`}
        style={{
          width: shape.size,
          height: shape.size,
          left: shape.x,
          top: shape.y,
          rotate: shape.rotate || 0,
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [shape.rotate || 0, (shape.rotate || 0) + 10, shape.rotate || 0],
        }}
        transition={{
          duration: shape.duration,
          delay: shape.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    )
  }

  if (shape.type === 'circle') {
    return (
      <motion.div
        className={`${baseClasses} rounded-full bg-[var(--color-secondary-background)]`}
        style={{
          width: shape.size,
          height: shape.size,
          left: shape.x,
          top: shape.y,
        }}
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: shape.duration,
          delay: shape.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    )
  }

  // Cross shape
  return (
    <motion.div
      className="absolute"
      style={{
        left: shape.x,
        top: shape.y,
      }}
      animate={{
        y: [0, -18, 0],
        rotate: [0, 90, 0],
      }}
      transition={{
        duration: shape.duration,
        delay: shape.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className="absolute bg-[var(--color-border)]"
        style={{
          width: shape.size,
          height: 3,
          top: shape.size / 2 - 1.5,
          left: 0,
        }}
      />
      <div
        className="absolute bg-[var(--color-border)]"
        style={{
          width: 3,
          height: shape.size,
          left: shape.size / 2 - 1.5,
          top: 0,
        }}
      />
    </motion.div>
  )
}

export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
      {shapes.map((shape, index) => (
        <ShapeComponent key={index} shape={shape} />
      ))}
    </div>
  )
}

