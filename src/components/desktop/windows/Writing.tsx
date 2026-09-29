'use client'

import Link from 'next/link'
import { useDesktop } from '../Desktop'
import { Toolbar } from '../Window'

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function Writing() {
  const { posts, openPost } = useDesktop()
  return (
    <div>
      <Toolbar>
        <span className="text-muted font-mono text-[12px]">~/writing</span>
        <span className="text-muted ml-auto font-mono text-[12px]">
          {posts.length} posts, newest first
        </span>
      </Toolbar>
      <ol>
        {posts.map((p) => (
          <li key={p.slug} className="border-rule border-b">
            <Link
              scroll={false}
              href={`/blog/${p.slug}`}
              onNavigate={(e) => {
                e.preventDefault()
                openPost(p.slug)
              }}
              className="group hover:bg-accent-soft grid gap-x-4 px-4 py-3.5 sm:grid-cols-[96px_1fr]"
            >
              <time
                className="text-muted pt-0.5 font-mono text-[12px]"
                dateTime={p.pubDate}
              >
                {formatDate(p.pubDate)}
              </time>
              <span>
                <span className="block font-semibold group-hover:underline">
                  {p.title}
                </span>
                <span className="text-muted mt-0.5 line-clamp-2 block text-[14px] leading-snug">
                  {p.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
