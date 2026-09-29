'use client'

import { useState } from 'react'

import EXPERIENCE from '@/data/experience'
import RESEARCH from '@/data/research'
import { EDUCATION } from '@/data/resume'
import { shortMonth } from '@/lib/format'
import SkillGrid from '../SkillGrid'
import { Toolbar } from '../Window'

const TABS = ['Experience', 'Research', 'Education', 'Skills'] as const
type Tab = (typeof TABS)[number]

export default function Resume() {
  const [tab, setTab] = useState<Tab>('Experience')
  return (
    <div>
      <Toolbar>
        <div role="tablist" className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded border-[1.5px] px-2.5 py-0.5 ${
                tab === t
                  ? 'border-ink bg-paper font-semibold'
                  : 'text-muted hover:text-ink border-transparent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Toolbar>

      <div className="px-6 py-5">
        {tab === 'Experience' ? (
          <Entries
            items={EXPERIENCE.map((r) => ({
              key: `${r.company}-${r.role}`,
              title: r.role,
              org: r.company,
              when: `${shortMonth(r.startDate)} – ${shortMonth(r.endDate)}`,
              where: r.location,
              body: r.description,
              tags: r.tags,
            }))}
          />
        ) : null}
        {tab === 'Research' ? (
          <Entries
            items={RESEARCH.map((r) => ({
              key: r.title,
              title: r.title,
              org: r.org,
              when: `${shortMonth(r.startDate)} – ${shortMonth(r.endDate)}`,
              body: r.description,
              tags: r.stack,
              note: r.highlight,
            }))}
          />
        ) : null}
        {tab === 'Education' ? (
          <Entries
            items={EDUCATION.map((e) => ({
              key: e.school,
              title: e.school,
              org: `${e.degree}, ${e.field}`,
              when: `${e.startDate} – ${e.endDate}`,
              where: e.location,
            }))}
          />
        ) : null}
        {tab === 'Skills' ? <SkillGrid /> : null}
      </div>
    </div>
  )
}

type Entry = {
  key: string
  title: string
  org: string
  when: string
  where?: string
  body?: string
  tags?: string[]
  note?: string
}

function Entries({ items }: { items: Entry[] }) {
  return (
    <ol className="border-ink relative space-y-6 border-l-[1.5px] pl-5">
      {items.map((e) => (
        <li key={e.key} className="relative">
          <span className="border-ink bg-marker absolute top-[7px] -left-[26px] size-[10px] rounded-full border-[1.5px]" />
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h3 className="font-semibold">{e.title}</h3>
            <span className="text-muted ml-auto font-mono text-[12px]">
              {e.when}
            </span>
          </div>
          <p className="text-muted text-[14px]">
            {e.org}
            {e.where ? ` · ${e.where}` : ''}
          </p>
          {e.body ? (
            <p className="mt-1.5 text-[14.5px] leading-relaxed">{e.body}</p>
          ) : null}
          {e.note ? (
            <p className="bg-marker mt-1.5 inline-block px-1 text-[13px] font-medium">
              {e.note}
            </p>
          ) : null}
          {e.tags?.length ? (
            <p className="text-muted mt-1.5 font-mono text-[11.5px]">
              {e.tags.join(' / ')}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
