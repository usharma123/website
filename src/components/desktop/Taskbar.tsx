'use client'

import { useEffect, useRef, useState } from 'react'

import { PROFILE } from '@/data/resume'
import { APPS, DESKTOP_APPS, Icon, type IconName, type WinId } from './apps'
import { useDesktop } from './Desktop'
import type { Win } from './state'

type Props = {
  wins: Win[]
  focusedId?: WinId
  titleOf: (id: WinId) => string
  iconOf: (id: WinId) => IconName
  onTask: (id: WinId) => void
}

export default function Taskbar({
  wins,
  focusedId,
  titleOf,
  iconOf,
  onTask,
}: Props) {
  return (
    <footer className="border-ink bg-chrome absolute inset-x-0 bottom-0 z-[100000] flex h-11 items-center gap-1.5 border-t-[1.5px] px-1.5">
      <StartMenu />
      <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {wins.map((w) => {
          const active = focusedId === w.id && !w.minimized
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => onTask(w.id)}
              aria-pressed={active}
              className={`${w.auto ? 'max-md:hidden' : ''} flex h-8 max-w-[180px] shrink-0 items-center gap-1.5 rounded border-[1.5px] px-2 text-[12.5px] font-medium ${
                active
                  ? 'border-ink bg-paper shadow-[inset_0_-2px_0_var(--color-accent)]'
                  : 'text-muted hover:border-ink/30 hover:text-ink border-transparent'
              }`}
            >
              <Icon name={iconOf(w.id)} size={16} />
              <span className="truncate">{titleOf(w.id)}</span>
            </button>
          )
        })}
      </div>
      <div className="text-muted hidden items-center gap-3 pr-2 font-mono text-[12px] sm:flex">
        <span>{PROFILE.location.replace('Pennsylvania', 'PA')}</span>
        <Clock />
      </div>
    </footer>
  )
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(t)
  }, [])
  // Rendered only in the browser so the server's clock never leaks in.
  if (!now) return <span className="w-[64px]" />
  return (
    <time className="text-ink w-[64px] text-right" dateTime={now.toISOString()}>
      {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
    </time>
  )
}

function StartMenu() {
  const { open } = useDesktop()
  const [isOpen, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  const item =
    'flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left text-[13.5px] hover:bg-ink hover:text-paper'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setOpen((o) => !o)}
        className={`border-ink flex h-8 items-center gap-2 rounded border-[1.5px] px-2.5 text-[13px] font-semibold ${
          isOpen ? 'bg-ink text-paper' : 'bg-marker'
        }`}
      >
        <span className="font-mono text-[11px] tracking-tight">u/s</span>
        <span className="hidden sm:inline">Utsav</span>
      </button>

      {isOpen ? (
        <div className="border-ink bg-paper absolute bottom-11 left-0 w-64 rounded-lg border-[1.5px] p-1.5 shadow-[0_24px_48px_-24px_rgb(20_27_38/0.45)]">
          <div className="border-rule border-b-[1.5px] border-dashed px-2 pt-1 pb-2">
            <div className="font-semibold">{PROFILE.name}</div>
            <div className="text-muted text-[12.5px]">{PROFILE.headline}</div>
          </div>
          <div className="py-1">
            {DESKTOP_APPS.map((id) => (
              <button
                key={id}
                type="button"
                className={item}
                onClick={() => {
                  open(id)
                  setOpen(false)
                }}
              >
                <Icon name={APPS[id].icon} size={20} />
                {APPS[id].label}
              </button>
            ))}
          </div>
          <div className="border-rule border-t-[1.5px] border-dashed pt-1">
            <a
              className={item}
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub <span className="ml-auto">↗</span>
            </a>
            <a
              className={item}
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <span className="ml-auto">↗</span>
            </a>
            <a className={item} href={`mailto:${PROFILE.email}`}>
              Email <span className="ml-auto">↗</span>
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}
