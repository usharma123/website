'use client'

import Link from 'next/link'
import { useRef, useState, type PointerEvent, type ReactNode } from 'react'

import PROJECTS from '@/data/projects'
import type { PostMeta } from '@/lib/posts'
import { APPS, DESKTOP_APPS, type WinId } from '../apps'
import type { Win } from '../state'
import { dismissGesture, navigationGesture, type PhoneView } from './gestures'
import styles from './phone.module.css'

type Props = {
  view: PhoneView
  onView: (view: PhoneView) => void
  wins: Win[]
  focusedId?: WinId
  titleOf: (id: WinId) => string
  iconFor: (id: WinId, size: number) => ReactNode
  onOpen: (id: WinId) => void
  onClose: (id: WinId) => void
  onPost: (slug: string) => void
  posts: PostMeta[]
}

export default function Phone(props: Props) {
  const { view, onView, focusedId, titleOf } = props
  return (
    <div className={styles.phone} data-view={view}>
      {view === 'app' ? (
        <header className={styles.appHeader}>
          <button
            type="button"
            onClick={() => onView('home')}
            aria-label="Go to home screen"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 5-7 7 7 7" />
            </svg>
            <span>Home</span>
          </button>
          <span>{focusedId ? titleOf(focusedId) : ''}</span>
          <button
            type="button"
            onClick={() => onView('recents')}
            aria-label="Show recent apps"
          >
            <SwitcherIcon />
          </button>
        </header>
      ) : null}
      {view === 'home' ? <HomeScreen {...props} /> : null}
      {view === 'recents' ? <RecentApps {...props} /> : null}
      {view === 'search' ? <PhoneSearch {...props} /> : null}
      <HomeGesture onView={onView} />
    </div>
  )
}

function HomeScreen({ onView, onOpen, onPost, iconFor, posts }: Props) {
  const [page, setPage] = useState(0)
  const pages = useRef<HTMLDivElement>(null)
  const pinned = PROJECTS.filter((p) => p.featured).slice(0, 8)
  const latest = posts[0]
  function goPage(next: number) {
    const el = pages.current
    if (!el) return
    el.scrollTo({
      left: next * el.clientWidth,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }
  return (
    <div className={styles.home}>
      <header className={styles.homeHeader}>
        <span>utsav.sh</span>
        <button
          type="button"
          onClick={() => onView('recents')}
          aria-label="Show recent apps"
        >
          <SwitcherIcon />
        </button>
      </header>
      <div
        ref={pages}
        className={styles.pages}
        aria-label="Home screen pages"
        onScroll={(e) => {
          const el = e.currentTarget
          setPage(Math.round(el.scrollLeft / el.clientWidth))
        }}
      >
        <section className={styles.page} aria-label="Apps page">
          <div className={styles.widgets}>
            <button
              type="button"
              className={styles.profileWidget}
              onClick={() => onOpen(DESKTOP_APPS[0])}
            >
              <span className={styles.monogram}>u/s</span>
              <strong>
                Utsav
                <br />
                Sharma
              </strong>
              <span>Software engineer</span>
            </button>
            {latest ? (
              <Link
                href={`/blog/${latest.slug}`}
                scroll={false}
                className={styles.postWidget}
                onNavigate={(event) => {
                  event.preventDefault()
                  onPost(latest.slug)
                }}
              >
                <span className={styles.widgetLabel}>Latest writing ↗</span>
                <strong>{latest.title}</strong>
                <span>Open to read</span>
              </Link>
            ) : null}
          </div>
          <div className={styles.grid}>
            {DESKTOP_APPS.map((id) => (
              <AppIcon
                key={id}
                id={id}
                label={APPS[id].label ?? APPS[id].title}
                icon={iconFor(id, 36)}
                onClick={() => onOpen(id)}
              />
            ))}
          </div>
        </section>
        <section className={styles.page} aria-label="Projects page">
          <div className={styles.pageHeading}>
            <span>On the side</span>
            <h2>Things I've built.</h2>
            <p>Tap a project to take a look.</p>
          </div>
          <div className={styles.grid}>
            {pinned.map((p) => (
              <AppIcon
                key={p.slug}
                id={`project:${p.slug}`}
                label={p.name}
                icon={iconFor(`project:${p.slug}`, 36)}
                onClick={() => onOpen(`project:${p.slug}`)}
              />
            ))}
            <AppIcon
              id="projects"
              label="All projects"
              icon={iconFor('projects', 36)}
              onClick={() => onOpen('projects')}
            />
          </div>
        </section>
      </div>
      <div className={styles.homeTools}>
        <div className={styles.pageDots} aria-label="Choose home screen page">
          {[0, 1].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={i === 0 ? 'Show apps page' : 'Show projects page'}
              aria-current={page === i ? 'page' : undefined}
              onClick={() => goPage(i)}
            >
              <span />
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.searchPill}
          onClick={() => onView('search')}
        >
          <SearchIcon /> Search
        </button>
      </div>
      <nav className={styles.dock} aria-label="Dock">
        {(['projects', 'writing', 'terminal', 'blackjack'] as const).map(
          (id) => (
            <AppIcon
              key={id}
              id={id}
              label={APPS[id].label ?? id}
              icon={iconFor(id, 34)}
              onClick={() => onOpen(id)}
              dock
            />
          ),
        )}
      </nav>
    </div>
  )
}

function AppIcon({
  id,
  label,
  icon,
  onClick,
  dock,
}: {
  id: WinId
  label: string
  icon: ReactNode
  onClick: () => void
  dock?: boolean
}) {
  return (
    <button
      type="button"
      className={`${styles.app} ${dock ? styles.dockApp : ''}`}
      onClick={onClick}
      aria-label={`Open ${label}`}
    >
      <span className={styles.appIcon} data-app-id={id}>
        {icon}
      </span>
      {dock ? null : <span className={styles.appLabel}>{label}</span>}
    </button>
  )
}

function RecentApps({
  wins,
  titleOf,
  iconFor,
  onClose,
  onOpen,
  onView,
}: Props) {
  const ordered = [...wins].sort((a, b) => b.z - a.z)
  return (
    <section className={styles.recents} aria-label="Recent apps">
      <header className={styles.screenHeader}>
        <h1>Recent apps</h1>
        <button type="button" onClick={() => onView('home')}>
          Done
        </button>
      </header>
      <p className={styles.instruction}>Tap to return. Swipe up to close.</p>
      <div className={styles.recentTrack}>
        {ordered.map((win) => (
          <RecentCard
            key={win.id}
            title={titleOf(win.id)}
            icon={iconFor(win.id, 52)}
            onOpen={() => onOpen(win.id)}
            onClose={() => onClose(win.id)}
          />
        ))}
        {ordered.length === 0 ? (
          <p className={styles.empty}>
            No open apps. Everything is on your home screen.
          </p>
        ) : null}
      </div>
      <button
        type="button"
        className={styles.homeLink}
        onClick={() => onView('home')}
      >
        Back to home screen
      </button>
    </section>
  )
}

function RecentCard({
  title,
  icon,
  onOpen,
  onClose,
}: {
  title: string
  icon: ReactNode
  onOpen: () => void
  onClose: () => void
}) {
  const start = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)
  return (
    <article
      className={styles.recentCard}
      onPointerDown={(e) => {
        start.current = { x: e.clientX, y: e.clientY }
        swiped.current = false
      }}
      onPointerCancel={() => {
        start.current = null
      }}
      onPointerUp={(e) => {
        const p = start.current
        start.current = null
        if (p && dismissGesture(e.clientX - p.x, e.clientY - p.y)) {
          swiped.current = true
          onClose()
        }
      }}
    >
      <div className={styles.recentTitle}>
        <span>{title}</span>
        <button type="button" aria-label={`Close ${title}`} onClick={onClose}>
          ×
        </button>
      </div>
      <button
        type="button"
        className={styles.recentOpen}
        onClick={() => {
          if (!swiped.current) onOpen()
        }}
        aria-label={`Return to ${title}`}
      >
        {icon}
        <strong>{title}</strong>
        <span>Tap to return</span>
      </button>
    </article>
  )
}

type SearchResult = {
  key: string
  title: string
  kind: string
  open: () => void
}

function PhoneSearch({ onView, onOpen, onPost, posts }: Props) {
  const [query, setQuery] = useState('')
  const results: SearchResult[] = [
    ...DESKTOP_APPS.map((id) => ({
      key: id,
      title: APPS[id].label ?? APPS[id].title,
      kind: 'App',
      open: () => onOpen(id),
    })),
    ...PROJECTS.map((p) => ({
      key: `project:${p.slug}`,
      title: p.name,
      kind: 'Project',
      open: () => onOpen(`project:${p.slug}`),
    })),
    ...posts.map((p) => ({
      key: `post:${p.slug}`,
      title: p.title,
      kind: 'Writing',
      open: () => onPost(p.slug),
    })),
  ]
    .filter((r) => r.title.toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, 20)
  return (
    <section className={styles.search} aria-label="Phone search">
      <header className={styles.screenHeader}>
        <h1>Search</h1>
        <button type="button" onClick={() => onView('home')}>
          Cancel
        </button>
      </header>
      <form
        className={styles.searchField}
        onSubmit={(e) => {
          e.preventDefault()
          results[0]?.open()
        }}
      >
        <SearchIcon />
        <input
          aria-label="Search apps, projects, and posts"
          placeholder="Apps, projects, writing…"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          enterKeyHint="go"
        />
      </form>
      <div className={styles.searchResults}>
        {results.map((r) => (
          <button type="button" key={r.key} onClick={r.open}>
            <span>{r.title}</span>
            <small>{r.kind} ↗</small>
          </button>
        ))}
        {results.length === 0 ? (
          <p>No matches yet. Try a project name or topic.</p>
        ) : null}
      </div>
    </section>
  )
}

function HomeGesture({ onView }: { onView: (view: PhoneView) => void }) {
  const start = useRef<{ x: number; y: number; time: number } | null>(null)
  const swiped = useRef(false)
  function end(e: PointerEvent<HTMLButtonElement>) {
    const p = start.current
    start.current = null
    if (!p) return
    const view = navigationGesture(
      e.clientX - p.x,
      e.clientY - p.y,
      performance.now() - p.time,
    )
    if (view) {
      swiped.current = true
      onView(view)
    }
  }
  return (
    <button
      type="button"
      className={styles.homeGesture}
      aria-label="Home. Swipe up and hold for recent apps."
      title="Swipe up for Home; hold for recent apps"
      onPointerDown={(e) => {
        start.current = { x: e.clientX, y: e.clientY, time: performance.now() }
        swiped.current = false
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerUp={end}
      onPointerCancel={() => {
        start.current = null
      }}
      onClick={() => {
        if (!swiped.current) onView('home')
        swiped.current = false
      }}
    >
      <span />
    </button>
  )
}

function SwitcherIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="8" y="5" width="12" height="16" rx="3" />
      <path d="M5 17H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10" />
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  )
}
