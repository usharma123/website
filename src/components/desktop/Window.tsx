'use client'

import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react'

import type { AppSpec } from './apps'
import { Icon } from './icons'
import type { Rect, Win } from './state'
import { PHONE_MEDIA } from './mobile/gestures'

const TASKBAR = 44

type Props = {
  win: Win
  spec: AppSpec & { title: string }
  focused: boolean
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onToggleMax: () => void
  onRect: (rect: Rect) => void
  /** Dropped against the top edge while dragging. */
  onMaximize: () => void
  children: ReactNode
}

export default function Window({
  win,
  spec,
  focused,
  onFocus,
  onClose,
  onMinimize,
  onToggleMax,
  onRect,
  onMaximize,
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  // Coming to the front hands the keyboard to the window's main input.
  useEffect(() => {
    if (focused && !window.matchMedia(PHONE_MEDIA).matches)
      ref.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
  }, [focused, win.z])

  // Drags and resizes write straight to the element and only commit to
  // state on release, so window contents don't re-render on every move.
  function track(e: PointerEvent, mode: 'move' | 'resize') {
    const el = ref.current
    if (
      !el ||
      win.maximized ||
      e.button !== 0 ||
      window.matchMedia(PHONE_MEDIA).matches
    )
      return
    e.preventDefault()
    const start = el.getBoundingClientRect()
    const px = e.clientX
    const py = e.clientY
    const vw = window.innerWidth
    const vh = window.innerHeight - TASKBAR
    let rect: Rect = {
      x: start.left,
      y: start.top,
      w: start.width,
      h: start.height,
    }
    el.style.right = 'auto'

    // Dragging into a screen edge snaps: left/right halves, or the top to
    // maximize. A ghost outline previews where the window will land.
    let snap: 'left' | 'right' | 'max' | null = null
    const ghost = document.createElement('div')
    ghost.className =
      'pointer-events-none absolute rounded-lg border-2 border-dashed border-accent bg-accent/10 transition-all duration-100'
    const snapRect = (s: typeof snap): Rect | null =>
      s === 'left'
        ? { x: 0, y: 0, w: Math.round(vw / 2), h: vh }
        : s === 'right'
          ? { x: Math.round(vw / 2), y: 0, w: vw - Math.round(vw / 2), h: vh }
          : s === 'max'
            ? { x: 0, y: 0, w: vw, h: vh }
            : null

    const move = (ev: globalThis.PointerEvent) => {
      if (mode === 'move') {
        const next =
          ev.clientY <= 2
            ? 'max'
            : ev.clientX <= 4
              ? 'left'
              : ev.clientX >= vw - 4
                ? 'right'
                : null
        if (next !== snap) {
          snap = next
          const r = snapRect(snap)
          if (r) {
            Object.assign(ghost.style, {
              left: `${r.x + 6}px`,
              top: `${r.y + 6}px`,
              width: `${r.w - 12}px`,
              height: `${r.h - 12}px`,
              zIndex: String(win.z - 1),
            })
            el.parentElement?.appendChild(ghost)
          } else ghost.remove()
        }
      }
      const dx = ev.clientX - px
      const dy = ev.clientY - py
      rect =
        mode === 'move'
          ? {
              ...rect,
              x: clamp(start.left + dx, 80 - start.width, vw - 80),
              y: clamp(start.top + dy, 0, vh - 36),
            }
          : {
              ...rect,
              w: clamp(start.width + dx, 320, vw - start.left),
              h: clamp(start.height + dy, 200, vh - start.top),
            }
      Object.assign(el.style, {
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        width: `${rect.w}px`,
        height: `${rect.h}px`,
      })
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.userSelect = ''
      ghost.remove()
      const r = snapRect(snap)
      if (snap === 'max') {
        onRect(rect)
        onMaximize()
      } else if (r) {
        Object.assign(el.style, {
          left: `${r.x}px`,
          top: `${r.y}px`,
          width: `${r.w}px`,
          height: `${r.h}px`,
        })
        onRect(r)
      } else onRect(rect)
    }
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  return (
    <section
      ref={ref}
      aria-label={spec.title}
      data-focused={focused}
      data-app={win.id}
      onPointerDownCapture={onFocus}
      style={{ ...placement(win, spec), zIndex: win.z }}
      className={[
        'win border-ink bg-paper pointer-events-auto absolute flex-col overflow-hidden rounded-lg border-[1.5px]',
        win.maximized ? '!inset-0 !h-full !w-full !rounded-none' : '',
        win.minimized ? 'hidden' : 'flex',
      ].join(' ')}
    >
      <header
        onPointerDown={(e) => track(e, 'move')}
        onDoubleClick={onToggleMax}
        className={`border-ink flex h-9 shrink-0 cursor-grab items-center gap-2 border-b-[1.5px] pr-1.5 pl-2.5 select-none active:cursor-grabbing ${
          focused ? 'bg-marker' : 'bg-chrome text-muted'
        }`}
      >
        <Icon name={spec.icon} size={18} />
        <h2 className="min-w-0 flex-1 truncate text-[13px] font-semibold">
          {spec.title}
        </h2>
        <div className="flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
          <TitleButton label="Minimize" onClick={onMinimize}>
            <path d="M3 8.5h8" />
          </TitleButton>
          <TitleButton
            label={win.maximized ? 'Restore' : 'Maximize'}
            onClick={onToggleMax}
          >
            <path d="M3 3h8v8H3z" />
          </TitleButton>
          <TitleButton label="Close" onClick={onClose}>
            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
          </TitleButton>
        </div>
      </header>

      <div className="window-content @container min-h-0 flex-1 overflow-auto">
        {children}
      </div>

      {win.maximized ? null : (
        <div
          aria-hidden
          onPointerDown={(e) => track(e, 'resize')}
          className="absolute right-0 bottom-0 hidden size-4 cursor-nwse-resize md:block"
          style={{
            background:
              'linear-gradient(135deg, transparent 50%, var(--color-ink) 50%, var(--color-ink) 58%, transparent 58%, transparent 70%, var(--color-ink) 70%, var(--color-ink) 78%, transparent 78%)',
          }}
        />
      )}
    </section>
  )
}

/** A strip pinned under the title bar — tabs, a path, filters. */
export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="border-ink bg-chrome sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b-[1.5px] px-3 py-2 text-[13px]">
      {children}
    </div>
  )
}

function TitleButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="border-ink bg-paper text-ink hover:bg-ink hover:text-paper grid size-[22px] place-items-center rounded border-[1.5px]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        {children}
      </svg>
    </button>
  )
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max))
}

/** Windows opened in the browser have pixel coordinates; ones rendered on
 *  the server fall back to their CSS slot so there's no hydration jump. */
function placement(win: Win, spec: AppSpec): CSSProperties {
  if (win.x !== undefined && win.y !== undefined) {
    return { left: win.x, top: win.y, width: win.w, height: win.h }
  }
  const slot = spec.slot ?? {
    left: `max(128px, calc(50% - ${spec.w / 2}px))`,
    top: '32px',
  }
  return {
    ...slot,
    width: `min(${spec.w}px, calc(100vw - 152px))`,
    height: `min(${spec.h}px, calc(100% - ${slot.top} - 24px))`,
  }
}
