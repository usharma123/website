'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

type PostMeta = {
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  slug: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.12,
    },
  },
} as const

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as const

const tagVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      type: 'spring',
      stiffness: 200,
    },
  },
} as const

const tagColors = ['var(--accent-yellow)', 'var(--accent-teal)', 'var(--accent-purple)', 'var(--accent-lime)']

export default function BlogPageClient({ posts }: { posts: PostMeta[] }) {
  return (
    <main className="max-w-3xl mx-auto py-8 px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-10"
      >
        <h1 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight">
          <span className="highlight">Blog</span> Posts
        </h1>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-2 right-0 w-6 h-6 bg-[var(--color-accent-teal)] border-3 border-[var(--color-border)] rotate-12 hidden sm:block"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 12 }}
          transition={{ delay: 0.5, type: 'spring' }}
        />
        <motion.div
          className="absolute top-8 right-8 w-4 h-4 rounded-full bg-[var(--color-main)] border-2 border-[var(--color-border)] hidden sm:block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
        />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-7"
      >
        {posts.map((post, index) => (
          <motion.article
            key={post.slug}
            variants={cardVariants}
            whileHover={{
              y: -8,
              transition: { duration: 0.3 },
            }}
            className="relative p-6 sm:p-7 rounded-[var(--radius-base)] border-3 border-[var(--color-border)] shadow-[var(--shadow-shadow)] bg-[var(--color-secondary-background)] neo-card overflow-hidden"
          >
            {/* Accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5"
              style={{ background: tagColors[index % tagColors.length] }}
            />

            {/* Corner decoration */}
            <motion.div
              className="absolute -top-1.5 -right-1.5 w-6 h-6 border-3 border-[var(--color-border)] hidden sm:block"
              style={{ background: tagColors[index % tagColors.length] }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 12 }}
              transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
            />

            {/* Post number badge */}
            <motion.div
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[var(--color-background)] border-3 border-[var(--color-border)] font-heading font-bold text-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
            >
              {String(index + 1).padStart(2, '0')}
            </motion.div>

            <Link href={`/blog/${post.slug}`} className="block">
              <motion.h2
                className="text-xl sm:text-2xl font-heading font-bold mb-3 tracking-tight hover:underline decoration-3 underline-offset-4 pr-12"
                style={{ color: 'var(--main)' }}
                whileHover={{ x: 6 }}
                transition={{ duration: 0.25 }}
              >
                {post.title}
              </motion.h2>
            </Link>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 + index * 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-background)] border-2 border-[var(--color-border)] rounded-[var(--radius-base)] text-xs sm:text-sm font-heading font-semibold mb-4"
            >
              {post.pubDate}
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="flex flex-wrap gap-2 mb-4"
            >
              {post.tags.map((tag, tagIndex) => (
                <motion.span
                  key={tag}
                  variants={tagVariants}
                  whileHover={{ scale: 1.12, rotate: [-3, 3, 0] }}
                  whileTap={{ scale: 0.92 }}
                  className="px-3 py-1.5 rounded-full text-[var(--color-main-foreground)] text-xs font-heading font-semibold border-3 border-[var(--color-border)] cursor-default shadow-[2px_2px_0_0_var(--border)]"
                  style={{ background: tagColors[tagIndex % tagColors.length] }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            <p className="text-[var(--color-foreground)] text-sm sm:text-base leading-relaxed opacity-85">
              {post.description}
            </p>

            {/* Bottom decorative dots */}
            <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-50">
              <div className="w-2 h-2 bg-[var(--color-border)] rounded-full" />
              <div className="w-2 h-2 rotate-45" style={{ background: tagColors[index % tagColors.length] }} />
              <div className="w-2 h-2 bg-[var(--color-border)]" />
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* Bottom divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-12 neo-divider"
      />
    </main>
  );
}
