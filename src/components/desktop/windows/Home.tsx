'use client'

import { useEffect, useState, type ReactNode } from 'react'

import EXPERIENCE from '@/data/experience'
import PROJECTS from '@/data/projects'
import { EDUCATION, PROFILE } from '@/data/resume'
import { formatDate, shortMonth } from '@/lib/format'
import { useDesktop } from '../context'
import ProjectPreview from '../ProjectPreview'

const FEATURED = PROJECTS.filter((p) => p.featured)
const TABS = ['Things I’ve built', 'Things I’ve written', 'Where I’ve been']
const ROTATE_MS = 7000

/** The landing window: who this is, how the desktop works, and a rotating
 *  look at the work. */
export default function Home() {
  return (
    <div className="px-6 py-7 @3xl:px-12 @3xl:py-10">
      <div className="flex items-center gap-2.5">
        <span className="border-ink bg-marker grid size-8 place-items-center rounded-md border-[1.5px] font-mono text-[11px] font-semibold">
          u/s
        </span>
        <span className="text-[17px] font-semibold tracking-[-0.01em]">
          {PROFILE.name}
        </span>
      </div>

      <div className="mt-8 grid gap-8 @3xl:grid-cols-[1fr_320px] @3xl:items-start @3xl:gap-12">
        <div>
          <h1 className="text-[38px] leading-[1.04] font-semibold tracking-[-0.035em] @3xl:text-[54px]">
            You’re on{' '}
            <span className="bg-accent-soft text-accent rounded-lg box-decoration-clone px-2">
              Utsav’s computer.
            </span>
          </h1>
          <p className="mt-5 max-w-[560px] text-[17px] leading-[1.65] @3xl:text-[18.5px]">
            Make yourself at home. I’m a software engineer at CLS, and the rest
            of the time I build{' '}
            <Mark>developer tools, agent infrastructure and terminal apps</Mark>
            , then write about how they work. Everything here is real — open
            whatever looks interesting.
          </p>
          <p className="text-muted mt-4 text-[15px]">
            {EXPERIENCE[0].role} at CLS · MS CS, Penn ’
            {EDUCATION[0].endDate.slice(2)} · {PROFILE.location.split(',')[0]}
          </p>
        </div>
        <GuestCard />
      </div>

      <Showcase />
    </div>
  )
}

function Mark({ children }: { children: ReactNode }) {
  return (
    <mark className="bg-marker/70 text-ink rounded-[3px] box-decoration-clone px-1">
      {children}
    </mark>
  )
}

function GuestCard() {
  const { open, openSearch } = useDesktop()
  return (
    <div className="border-ink bg-paper rounded-lg border-[1.5px] p-5 shadow-[0_18px_40px_-24px_rgb(20_27_38/0.45)]">
      <div className="flex items-center gap-2">
        <span className="text-[16px] font-semibold">Guest session</span>
        <span className="text-muted ml-auto flex items-center gap-1.5 font-mono text-[11px]">
          <span className="size-2 rounded-full bg-[#3fae7a]" /> signed in
        </span>
      </div>
      <ul className="mt-3 space-y-2 text-[14.5px]">
        <Tip>
          <Kbd>⌘K</Kbd> searches everything
        </Tip>
        <Tip>
          <Kbd>`</Kbd> opens a terminal — it takes questions too
        </Tip>
        <Tip>Right-click the desktop for more</Tip>
      </ul>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button primary onClick={() => open('projects')}>
          Browse projects
        </Button>
        <Button onClick={() => open('terminal')}>Open terminal</Button>
      </div>
      <button
        type="button"
        onClick={openSearch}
        className="text-muted hover:text-ink mt-3 w-full text-center text-[12.5px] underline-offset-2 hover:underline"
      >
        or search for something specific
      </button>
    </div>
  )
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="text-accent mt-px font-semibold">✓</span>
      <span>{children}</span>
    </li>
  )
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="border-ink/40 bg-chrome rounded border border-b-2 px-1.5 py-px font-mono text-[12px]">
      {children}
    </kbd>
  )
}

function Button({
  primary,
  onClick,
  children,
}: {
  primary?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-ink rounded-md border-[1.5px] border-b-[4px] px-3 py-2 text-[14px] font-semibold transition-[transform,border-width] active:translate-y-[2.5px] active:border-b-[1.5px] ${
        primary ? 'bg-accent text-paper' : 'bg-paper hover:bg-chrome'
      }`}
    >
      {children}
    </button>
  )
}

function Showcase() {
  const [tab, setTab] = useState(0)
  return (
    <div className="border-ink mt-10 overflow-hidden rounded-lg border-[1.5px]">
      <div role="tablist" className="bg-chrome flex overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={`flex-1 px-4 py-2.5 text-[13.5px] font-semibold whitespace-nowrap ${
              tab === i
                ? 'bg-accent text-paper'
                : 'text-muted hover:text-ink border-ink/15 border-r last:border-r-0'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="bg-paper border-ink border-t-[1.5px]">
        {tab === 0 ? <Built /> : null}
        {tab === 1 ? <Written /> : null}
        {tab === 2 ? <Been /> : null}
      </div>
    </div>
  )
}

function Built() {
  const { openProject, openPost } = useDesktop()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const p = FEATURED[i]

  // Rotate through the pinned projects unless the visitor is reading one,
  // has paused, or prefers reduced motion.
  useEffect(() => {
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(
      () => setI((n) => (n + 1) % FEATURED.length),
      ROTATE_MS,
    )
    return () => clearTimeout(t)
  }, [i, paused])

  return (
    <div
      className="grid @3xl:grid-cols-[1.25fr_1fr]"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <button
        type="button"
        onClick={() => openProject(p.slug)}
        className="border-ink/15 block border-b @3xl:border-r @3xl:border-b-0"
        aria-label={`Open ${p.name}`}
      >
        <ProjectPreview project={p} tall />
      </button>
      <div className="flex flex-col p-6">
        <div className="text-muted flex items-center font-mono text-[12px]">
          <span>
            {String(i + 1).padStart(2, '0')} /{' '}
            {String(FEATURED.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-label={paused ? 'Resume rotation' : 'Pause rotation'}
            className="border-ink/30 hover:border-ink ml-auto grid size-7 place-items-center rounded border"
          >
            {paused ? '▶' : '❚❚'}
          </button>
        </div>
        <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.02em]">
          {p.name}
        </h2>
        <p className="text-muted mt-1.5 text-[15px] leading-relaxed">
          {p.description}.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openProject(p.slug)}
          >
            Open project
          </button>
          {p.post ? (
            <button
              type="button"
              className="btn"
              onClick={() => openPost(p.post!)}
            >
              Read the write-up
            </button>
          ) : null}
        </div>
        <div className="mt-auto flex gap-1.5 pt-6">
          {FEATURED.map((f, n) => (
            <button
              key={f.slug}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show ${f.name}`}
              aria-current={n === i}
              className={`h-1.5 rounded-full transition-all ${
                n === i ? 'bg-accent w-8' : 'bg-ink/20 hover:bg-ink/40 w-4'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Written() {
  const { posts, openPost, open } = useDesktop()
  return (
    <div className="p-2">
      {posts.slice(0, 3).map((p) => (
        <button
          key={p.slug}
          type="button"
          onClick={() => openPost(p.slug)}
          className="hover:bg-accent-soft grid w-full gap-x-6 rounded-md px-4 py-3.5 text-left @2xl:grid-cols-[110px_1fr]"
        >
          <time className="text-muted pt-0.5 font-mono text-[12px]">
            {formatDate(p.pubDate)}
          </time>
          <span>
            <span className="block text-[16px] font-semibold">{p.title}</span>
            <span className="text-muted mt-0.5 line-clamp-2 block text-[14px]">
              {p.description}
            </span>
          </span>
        </button>
      ))}
      <Footer onClick={() => open('writing')}>
        All {posts.length} posts →
      </Footer>
    </div>
  )
}

function Been() {
  const { open } = useDesktop()
  const stops = [
    ...EXPERIENCE.slice(0, 3).map((r) => ({
      what: r.role,
      where: r.company,
      when: `${shortMonth(r.startDate)} – ${shortMonth(r.endDate)}`,
    })),
    ...EDUCATION.map((e) => ({
      what: `${e.degree}, ${e.field}`,
      where: e.school,
      when: `${e.startDate} – ${e.endDate}`,
    })),
  ]
  return (
    <div className="p-2">
      <ol className="px-4 py-2">
        {stops.map((s) => (
          <li
            key={`${s.where}-${s.what}`}
            className="border-rule grid gap-x-6 border-b py-2.5 last:border-b-0 @2xl:grid-cols-[1fr_auto]"
          >
            <span>
              <span className="font-semibold">{s.where}</span>
              <span className="text-muted"> · {s.what}</span>
            </span>
            <span className="text-muted font-mono text-[12px]">{s.when}</span>
          </li>
        ))}
      </ol>
      <Footer onClick={() => open('resume')}>Full résumé →</Footer>
    </div>
  )
}

function Footer({
  onClick,
  children,
}: {
  onClick: () => void
  children: ReactNode
}) {
  return (
    <div className="px-4 pt-1 pb-3">
      <button type="button" onClick={onClick} className="link text-[14px]">
        {children}
      </button>
    </div>
  )
}
