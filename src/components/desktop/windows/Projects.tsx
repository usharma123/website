'use client'

import { useState } from 'react'

import PROJECTS, { KIND_LABEL, type Project } from '@/data/projects'
import { useDesktop } from '../context'
import ProjectPreview from '../ProjectPreview'
import { Toolbar } from '../Window'

const KINDS: { id: Project['kind'] | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'agents', label: 'Agents & QA' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'web', label: 'Web' },
  { id: 'research', label: 'Research' },
]

export default function Projects() {
  const { openProject } = useDesktop()
  const [kind, setKind] = useState<(typeof KINDS)[number]['id']>('all')

  const featured = PROJECTS.filter((p) => p.featured)
  const rows =
    kind === 'all'
      ? PROJECTS.filter((p) => !p.featured)
      : PROJECTS.filter((p) => p.kind === kind)

  return (
    <div>
      <Toolbar>
        <span className="text-muted mr-auto font-mono text-[12px]">
          ~/projects
        </span>
        <div role="tablist" className="flex flex-wrap gap-1">
          {KINDS.map((k) => (
            <button
              key={k.id}
              role="tab"
              type="button"
              aria-selected={kind === k.id}
              onClick={() => setKind(k.id)}
              className={`rounded border-[1.5px] px-2 py-0.5 ${
                kind === k.id
                  ? 'border-ink bg-paper font-semibold'
                  : 'text-muted hover:text-ink border-transparent'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
      </Toolbar>

      {kind === 'all' ? (
        <section className="p-4">
          <h3 className="text-muted mb-3 font-mono text-[12px]">
            pinned — the ones I’d talk about first
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {featured.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => openProject(p.slug)}
                className="group border-ink bg-paper overflow-hidden rounded-md border-[1.5px] text-left"
              >
                <ProjectPreview project={p} />
                <div className="border-ink border-t-[1.5px] p-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold group-hover:underline">
                      {p.name}
                    </span>
                    <span className="text-muted ml-auto font-mono text-[11px]">
                      {KIND_LABEL[p.kind]}
                    </span>
                  </div>
                  <p className="text-muted mt-1 line-clamp-2 text-[13.5px] leading-snug">
                    {p.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="px-4 pb-4">
        {kind === 'all' ? (
          <h3 className="text-muted mb-2 font-mono text-[12px]">
            everything else
          </h3>
        ) : (
          <div className="h-4" />
        )}
        <table className="w-full border-collapse text-left text-[13.5px]">
          <thead className="text-muted font-mono text-[11.5px]">
            <tr className="border-ink border-b-[1.5px]">
              <th className="py-1.5 pr-3 font-normal">name</th>
              <th className="hidden py-1.5 pr-3 font-normal sm:table-cell">
                what it is
              </th>
              <th className="py-1.5 font-normal">kind</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.slug}
                tabIndex={0}
                onClick={() => openProject(p.slug)}
                onKeyDown={(e) => e.key === 'Enter' && openProject(p.slug)}
                className="border-rule hover:bg-accent-soft focus-visible:bg-accent-soft cursor-pointer border-b align-top"
              >
                <td className="py-2 pr-3 font-semibold whitespace-nowrap">
                  {p.name}
                </td>
                <td className="text-muted hidden py-2 pr-3 sm:table-cell">
                  {p.description}
                </td>
                <td className="text-muted py-2 font-mono text-[11.5px] whitespace-nowrap">
                  {KIND_LABEL[p.kind]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
