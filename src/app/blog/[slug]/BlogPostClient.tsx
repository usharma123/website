"use client";
import { motion } from "framer-motion";

export default function BlogPostClient({ data, children }: { data: any; children: React.ReactNode }) {
  return (
    <motion.article
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="overflow-hidden p-6 rounded-[var(--radius-base)] border-2 border-[var(--color-border)] shadow-[var(--shadow-shadow)] bg-[var(--color-secondary-background)]"
    >
      <h1 className="text-4xl font-heading mb-2" style={{ color: "var(--main)" }}>
        {data.title}
      </h1>
      <div className="text-sm text-[var(--color-foreground)] mb-2">{data.pubDate}</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {data.tags?.map((tag: string) => (
          <span
            key={tag}
            className="px-2 py-1 rounded bg-[var(--color-main)] text-[var(--color-main-foreground)] text-xs font-semibold"
          >
            {tag}
          </span>
        ))}
      </div>
      {children}
    </motion.article>
  );
}