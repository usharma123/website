'use client'

import EXPERIENCE from '@/data/experience'
import { EDUCATION } from '@/data/resume'
import type { PostMeta } from '@/lib/posts'
import { useDesktop } from './Desktop'

/** A "now" note stuck to the desktop, built from the résumé data so it
 *  stays current without anyone remembering to edit it. */
export default function StickyNote({ latest }: { latest?: PostMeta }) {
  const { openPost } = useDesktop()
  const job = EXPERIENCE[0]
  const school = EDUCATION[0]

  return (
    <aside className="border-ink bg-marker absolute top-[300px] left-4 w-[calc(100%-2rem)] max-w-[260px] rotate-[-1.5deg] border-[1.5px] p-4 font-mono text-[12.5px] leading-relaxed shadow-[0_12px_24px_-12px_rgb(23_32_27/0.5)] md:top-auto md:bottom-[64px] md:left-4 md:w-[240px] md:rotate-[1.5deg]">
      <div className="mb-2 font-semibold">now:</div>
      <ul className="space-y-1.5">
        <li>
          → {job.role} @ {job.company}
        </li>
        <li>→ Master’s in CS @ Penn, class of ’{school.endDate.slice(2)}</li>
        {latest ? (
          <li>
            → latest post:{' '}
            <button
              type="button"
              onClick={() => openPost(latest.slug)}
              className="hover:bg-ink hover:text-marker text-left underline decoration-1 underline-offset-2"
            >
              {latest.title.split(':')[0]}
            </button>
          </li>
        ) : null}
      </ul>
    </aside>
  )
}
