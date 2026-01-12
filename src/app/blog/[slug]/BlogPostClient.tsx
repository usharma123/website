"use client";
import { motion } from "framer-motion";

const tagColors = ['var(--accent-yellow)', 'var(--accent-teal)', 'var(--accent-purple)', 'var(--accent-lime)']

export default function BlogPostClient({ data, children }: { data: any; children: React.ReactNode }) {
  return (
    <motion.article
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden p-6 sm:p-8 rounded-[var(--radius-base)] border-3 border-[var(--color-border)] shadow-[var(--shadow-shadow)] bg-[var(--color-secondary-background)]"
    >
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--color-main)]" />

      {/* Top tape decoration */}
      <motion.div
        className="absolute -top-2 left-12 w-20 h-6 bg-[var(--color-accent-teal)] border-3 border-[var(--color-border)] rotate-[-2deg]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      />

      {/* Corner decoration */}
      <div className="absolute -top-2 -right-2 w-7 h-7 bg-[var(--color-accent-yellow)] border-3 border-[var(--color-border)] hidden sm:block" />

      <motion.h1
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl sm:text-4xl font-heading font-bold mb-4 tracking-tight"
        style={{ color: "var(--main)" }}
      >
        {data.title}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-background)] border-3 border-[var(--color-border)] rounded-[var(--radius-base)] text-xs sm:text-sm font-heading font-semibold mb-4"
      >
        {data.pubDate}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {data.tags?.map((tag: string, index: number) => (
          <motion.span
            key={tag}
            whileHover={{ scale: 1.1, rotate: [-2, 2, 0] }}
            className="px-3 py-1.5 rounded-full text-[var(--color-main-foreground)] text-xs font-heading font-semibold border-3 border-[var(--color-border)] shadow-[2px_2px_0_0_var(--border)]"
            style={{ background: tagColors[index % tagColors.length] }}
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="neo-divider mb-6"
      />

      <div className="markdown-body prose prose-lg max-w-none">
        {children}
      </div>

      {/* Bottom decorative element */}
      <motion.div
        className="absolute bottom-4 right-4 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="w-3 h-3 bg-[var(--color-main)] border-2 border-[var(--color-border)]" />
        <div className="w-3 h-3 bg-[var(--color-accent-yellow)] border-2 border-[var(--color-border)] rotate-45" />
        <div className="w-3 h-3 rounded-full bg-[var(--color-accent-teal)] border-2 border-[var(--color-border)]" />
      </motion.div>
    </motion.article>
  );
}
