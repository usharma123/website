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
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
}

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
}

export default function BlogPageClient({ posts }: { posts: PostMeta[] }) {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <motion.h1
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-heading mb-8 text-black dark:text-white"
      >
        Blog
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {posts.map((post, index) => (
          <motion.article
            key={post.slug}
            variants={cardVariants}
            whileHover={{ 
              y: -6,
              transition: { duration: 0.2 }
            }}
            className="p-6 rounded-[var(--radius-base)] border-2 border-[var(--color-border)] shadow-[var(--shadow-shadow)] bg-[var(--color-secondary-background)] neo-card"
          >
            <Link href={`/blog/${post.slug}`}>
              <motion.h2
                className="text-2xl font-heading mb-2 hover:underline decoration-2 underline-offset-4"
                style={{ color: 'var(--main)' }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {post.title}
              </motion.h2>
            </Link>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="text-sm text-[var(--color-foreground)] mb-2"
            >
              {post.pubDate}
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="flex flex-wrap gap-2 mb-3"
            >
              {post.tags.map((tag) => (
                <motion.span
                  key={tag}
                  variants={tagVariants}
                  whileHover={{ scale: 1.1, rotate: [-2, 2, 0] }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 rounded-[var(--radius-base)] bg-[var(--color-main)] text-[var(--color-main-foreground)] text-xs font-semibold border-2 border-[var(--color-border)] cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            <p className="text-[var(--color-foreground)]">{post.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </main>
  );
}

