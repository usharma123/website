'use client'

import { motion } from 'framer-motion'

interface Shape {
  type: 'square' | 'circle' | 'cross' | 'triangle' | 'ring' | 'diamond'
  size: number
  x: string
  y: string
  delay: number
  duration: number
  rotate?: number
  color?: 'main' | 'yellow' | 'teal' | 'purple' | 'lime' | 'border'
}

const shapes: Shape[] = [
  // Left side shapes
  { type: 'square', size: 24, x: '8%', y: '18%', delay: 0, duration: 6, rotate: 45, color: 'main' },
  { type: 'circle', size: 18, x: '5%', y: '55%', delay: 1.2, duration: 5.5, color: 'yellow' },
  { type: 'triangle', size: 20, x: '12%', y: '75%', delay: 0.8, duration: 6.5, color: 'teal' },
  { type: 'diamond', size: 16, x: '3%', y: '35%', delay: 2, duration: 5, color: 'purple' },

  // Right side shapes
  { type: 'ring', size: 22, x: '88%', y: '12%', delay: 0.5, duration: 7, color: 'main' },
  { type: 'square', size: 18, x: '92%', y: '45%', delay: 1.5, duration: 5.8, rotate: 15, color: 'lime' },
  { type: 'cross', size: 26, x: '85%', y: '68%', delay: 0.3, duration: 6.2, color: 'border' },
  { type: 'circle', size: 14, x: '90%', y: '82%', delay: 2.2, duration: 5.2, color: 'yellow' },

  // Additional accent shapes
  { type: 'diamond', size: 12, x: '15%', y: '90%', delay: 1.8, duration: 6.8, color: 'main' },
  { type: 'triangle', size: 16, x: '80%', y: '25%', delay: 0.7, duration: 5.3, color: 'teal' },
]

const colorMap = {
  main: 'var(--main)',
  yellow: 'var(--accent-yellow)',
  teal: 'var(--accent-teal)',
  purple: 'var(--accent-purple)',
  lime: 'var(--accent-lime)',
  border: 'var(--border)',
}

function ShapeComponent({ shape }: { shape: Shape }) {
  const baseClasses = 'absolute'
  const color = colorMap[shape.color || 'main']

  if (shape.type === 'square') {
    return (
      <motion.div
        className={baseClasses}
        style={{
          width: shape.size,
          height: shape.size,
          left: shape.x,
          top: shape.y,
          rotate: shape.rotate || 0,
          background: color,
          border: '3px solid var(--border)',
        }}
        animate={{
          y: [0, -25, 0],
          rotate: [shape.rotate || 0, (shape.rotate || 0) + 15, shape.rotate || 0],
          scale: [1, 1.05, 1],
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
        className={`${baseClasses} rounded-full`}
        style={{
          width: shape.size,
          height: shape.size,
          left: shape.x,
          top: shape.y,
          background: color,
          border: '3px solid var(--border)',
        }}
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
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

  if (shape.type === 'ring') {
    return (
      <motion.div
        className={`${baseClasses} rounded-full`}
        style={{
          width: shape.size,
          height: shape.size,
          left: shape.x,
          top: shape.y,
          background: 'transparent',
          border: `4px solid ${color}`,
          boxShadow: `inset 0 0 0 3px var(--border)`,
        }}
        animate={{
          y: [0, -18, 0],
          rotate: [0, 180, 360],
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

  if (shape.type === 'diamond') {
    return (
      <motion.div
        className={baseClasses}
        style={{
          width: shape.size,
          height: shape.size,
          left: shape.x,
          top: shape.y,
          background: color,
          border: '3px solid var(--border)',
          transform: 'rotate(45deg)',
        }}
        animate={{
          y: [0, -22, 0],
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

  if (shape.type === 'triangle') {
    return (
      <motion.div
        className={baseClasses}
        style={{
          width: 0,
          height: 0,
          left: shape.x,
          top: shape.y,
          borderLeft: `${shape.size / 2}px solid transparent`,
          borderRight: `${shape.size / 2}px solid transparent`,
          borderBottom: `${shape.size}px solid ${color}`,
          filter: 'drop-shadow(2px 2px 0 var(--border))',
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
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
        y: [0, -22, 0],
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
        style={{
          position: 'absolute',
          width: shape.size,
          height: 4,
          top: shape.size / 2 - 2,
          left: 0,
          background: color,
          border: '1px solid var(--border)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 4,
          height: shape.size,
          left: shape.size / 2 - 2,
          top: 0,
          background: color,
          border: '1px solid var(--border)',
        }}
      />
    </motion.div>
  )
}

export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-50 dark:opacity-40">
      {shapes.map((shape, index) => (
        <ShapeComponent key={index} shape={shape} />
      ))}
    </div>
  )
}
