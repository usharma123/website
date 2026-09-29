'use client'

import Link from 'next/link'
import EXPERIENCE from '@/data/experience'
import { EDUCATION } from '@/data/resume'
import type { PostMeta } from '@/lib/posts'
import { useDesktop } from './context'

/** A "now" note stuck to the desktop, built from the résumé data so it
 *  stays current without anyone remembering to edit it. */
export default function StickyNote({ latest }: { latest?: PostMeta }) {
  const { openPost } = useDesktop()
  const job = EXPERIENCE[0]
  const school = EDUCATION[0]

  return (
    <aside className="border-ink bg-marker absolute top-[300px] left-4 w-[calc(100%-2rem)] max-w-[260px] rotate-[-1.5deg] border-[1.5px] p-3.5 font-mono text-[12px] leading-relaxed shadow-[0_12px_24px_-12px_rgb(20_27_38/0.5)] md:top-auto md:bottom-[64px] md:left-3 md:w-[164px] md:rotate-[1.5deg] md:text-[11.5px]">
      <div className="mb-2 font-semibold">now:</div>
      <ul className="space-y-1.5">
        <li>→ SWE @ {job.company.replace(/ Group$/, '')}</li>
        <li>→ MS CS @ Penn ’{school.endDate.slice(2)}</li>
        {latest ? (
          <li>
            → latest post:{' '}
            <Link
              href={`/blog/${latest.slug}`}
              scroll={false}
              onNavigate={(e) => {
                e.preventDefault()
                openPost(latest.slug)
              }}
              className="hover:bg-ink hover:text-marker text-left underline decoration-1 underline-offset-2"
            >
              {latest.title.split(':')[0]}
            </Link>
          </li>
        ) : null}
      </ul>
    </aside>
  )
}
