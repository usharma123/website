'use client'

import { useEffect, type ReactNode } from 'react'

import type { PostMeta } from '@/lib/posts'
import { formatDate } from '@/lib/format'
import { useDesktop } from '../context'

/** The reader window's body. The article itself comes from the post route. */
export default function Post({
  loading,
  children,
}: {
  loading: boolean
  children: ReactNode
}) {
  return (
    <div className="relative min-h-full">
      {loading ? (
        <div className="bg-paper/80 text-muted absolute inset-0 z-10 grid place-items-center font-mono text-[12.5px]">
          opening…
        </div>
      ) : null}
      {children}
    </div>
  )
}

/** Rendered by the post route: tells the desktop which post is loaded. */
export function PostMount({ slug }: { slug: string }) {
  const { mountPost } = useDesktop()
  useEffect(() => mountPost(slug), [mountPost, slug])
  return null
}

export function PostHeader({ meta }: { meta: PostMeta }) {
  return (
    <header className="border-rule mb-8 border-b-[1.5px] border-dashed pb-6">
      <p className="text-muted font-mono text-[12px]">
        <time dateTime={meta.pubDate}>{formatDate(meta.pubDate)}</time>
        {meta.tags.length ? <> · {meta.tags.join(', ')}</> : null}
      </p>
      <h1 className="mt-2 text-[32px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance">
        {meta.title}
      </h1>
      <p className="text-muted mt-3 text-[17px] leading-snug">
        {meta.description}
      </p>
    </header>
  )
}
