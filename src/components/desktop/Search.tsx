'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import PROJECTS from '@/data/projects'
import { PROFILE } from '@/data/resume'
import { formatDate } from '@/lib/format'
import { APPS, DESKTOP_APPS, GAMES } from './apps'
import { useDesktop } from './context'
import { Icon, type IconName } from './icons'

type Result = {
  key: string
  group: 'Apps' | 'Projects' | 'Writing' | 'Actions'
  title: string
  detail?: string
  icon: IconName
  /** Extra text to match against, beyond the title. */
  keywords?: string
  run: () => void
}

/** Title hits beat keyword hits; earlier and tighter matches score higher. */
function score(q: string, r: Result) {
  const title = r.title.toLowerCase()
  const i = title.indexOf(q)
  if (i === 0) return 100
  if (i > 0) return 80 - i
  const hay = `${r.detail ?? ''} ${r.keywords ?? ''}`.toLowerCase()
  if (hay.includes(q)) return 40
  // Loose subsequence match on the title, e.g. "gtui" → "GSuiteTUI".
  let j = 0
  for (const ch of title) if (ch === q[j]) j++
  return j === q.length ? 20 : 0
}

export default function Search({ onClose }: { onClose: () => void }) {
  const { open, openProject, openPost, posts } = useDesktop()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  // A native modal dialog traps focus and inerts the desktop behind it.
  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (!el.open) el.showModal()
    input.current?.focus()
    // Clicks on the backdrop land on the dialog element itself.
    const onBackdrop = (e: MouseEvent) => {
      if (e.target === el) onClose()
    }
    el.addEventListener('click', onBackdrop)
    return () => el.removeEventListener('click', onBackdrop)
  }, [onClose])

  const all = useMemo<Result[]>(
    () => [
      ...[...DESKTOP_APPS, ...GAMES, 'trash' as const].map((id) => ({
        key: `app:${id}`,
        group: 'Apps' as const,
        title: APPS[id].label ?? APPS[id].title,
        icon: APPS[id].icon,
        run: () => open(id),
      })),
      ...PROJECTS.map((p) => ({
        key: `project:${p.slug}`,
        group: 'Projects' as const,
        title: p.name,
        detail: p.description,
        icon: 'box' as const,
        keywords: p.kind,
        run: () => openProject(p.slug),
      })),
      ...posts.map((p) => ({
        key: `post:${p.slug}`,
        group: 'Writing' as const,
        title: p.title,
        detail: formatDate(p.pubDate),
        icon: 'page' as const,
        keywords: `${p.description} ${p.tags.join(' ')}`,
        run: () => openPost(p.slug),
      })),
      {
        key: 'copy-email',
        group: 'Actions',
        title: 'Copy email address',
        detail: PROFILE.email,
        icon: 'mail',
        keywords: 'contact reach hire',
        run: () => void navigator.clipboard.writeText(PROFILE.email),
      },
      {
        key: 'github',
        group: 'Actions',
        title: 'Open GitHub',
        icon: 'folder',
        keywords: 'code source repos',
        run: () => window.open(PROFILE.github, '_blank', 'noreferrer'),
      },
      {
        key: 'linkedin',
        group: 'Actions',
        title: 'Open LinkedIn',
        icon: 'clipboard',
        keywords: 'resume cv career',
        run: () => window.open(PROFILE.linkedin, '_blank', 'noreferrer'),
      },
    ],
    [open, openProject, openPost, posts],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q)
      return all.filter((r) => r.group === 'Apps' || r.key === 'copy-email')
    return all
      .map((r) => ({ r, s: score(q, r) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 10)
      .map((x) => x.r)
  }, [all, query])

  function choose(r: Result | undefined) {
    if (!r) return
    r.run()
    onClose()
  }

  useEffect(() => {
    list.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  return (
    <dialog
      ref={dialog}
      aria-label="Search"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      className="backdrop:bg-ink/30 mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-[560px] overflow-visible bg-transparent p-0"
    >
      <div className="border-ink bg-paper overflow-hidden rounded-xl border-[1.5px] shadow-[0_32px_64px_-24px_rgb(20_27_38/0.6)]">
        <div className="border-rule flex items-center gap-3 border-b px-4">
          <span className="text-muted font-mono text-[13px]">⌘K</span>
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
              else if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((a) => Math.min(a + 1, results.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((a) => Math.max(a - 1, 0))
              } else if (e.key === 'Enter') choose(results[active])
            }}
            placeholder="Search projects, posts, apps…"
            aria-label="Search"
            aria-controls="search-results"
            aria-activedescendant={
              results[active] ? `search-${results[active].key}` : undefined
            }
            className="placeholder:text-muted h-12 flex-1 bg-transparent text-[16px] outline-none"
          />
        </div>

        <ul
          ref={list}
          id="search-results"
          role="listbox"
          className="max-h-[380px] overflow-auto p-1.5"
        >
          {results.length === 0 ? (
            <li className="text-muted px-3 py-6 text-center text-[14px]">
              Nothing matches “{query}”.
            </li>
          ) : null}
          {results.map((r, i) => (
            <li
              key={r.key}
              id={`search-${r.key}`}
              role="option"
              aria-selected={i === active}
              data-index={i}
              onPointerMove={() => setActive(i)}
              onClick={() => choose(r)}
              className={`flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 ${
                i === active ? 'bg-accent-soft' : ''
              }`}
            >
              <Icon name={r.icon} size={24} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">
                  {r.title}
                </span>
                {r.detail ? (
                  <span className="text-muted block truncate text-[12.5px]">
                    {r.detail}
                  </span>
                ) : null}
              </span>
              <span className="text-muted font-mono text-[11px]">
                {r.group.toLowerCase()}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-rule text-muted flex gap-4 border-t px-4 py-2 font-mono text-[11px]">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </dialog>
  )
}
