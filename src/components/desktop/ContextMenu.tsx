'use client'

import { useEffect, useRef, type ReactNode } from 'react'

import { useDesktop, type Wallpaper } from './context'

const WALLPAPERS: { id: Wallpaper; label: string }[] = [
  { id: 'dots', label: 'Dots' },
  { id: 'grid', label: 'Blueprint grid' },
  { id: 'plain', label: 'Plain' },
]

type Props = {
  x: number
  y: number
  onClose: () => void
  onArrange: () => void
  onCloseAll: () => void
}

export default function ContextMenu({
  x,
  y,
  onClose,
  onArrange,
  onCloseAll,
}: Props) {
  const { open, openSearch, wallpaper, setWallpaper } = useDesktop()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[role=menuitem]')?.focus()
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const act = (fn: () => void) => () => {
    fn()
    onClose()
  }

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Desktop"
      style={{ left: x, top: y }}
      className="border-ink bg-paper fixed z-[100001] w-56 rounded-lg border-[1.5px] p-1 text-[13px] shadow-[0_24px_48px_-24px_rgb(20_27_38/0.45)]"
      onKeyDown={(e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
        e.preventDefault()
        const items = [
          ...(ref.current?.querySelectorAll<HTMLElement>('[role^=menuitem]') ??
            []),
        ]
        const i = items.indexOf(document.activeElement as HTMLElement)
        const next = e.key === 'ArrowDown' ? i + 1 : i - 1
        items[(next + items.length) % items.length]?.focus()
      }}
    >
      <Item onClick={act(() => open('terminal'))} hint="`">
        New terminal
      </Item>
      <Item onClick={act(openSearch)} hint="⌘K">
        Search…
      </Item>
      <Rule />
      <Item onClick={act(onArrange)}>Arrange windows</Item>
      <Item onClick={act(onCloseAll)}>Close all windows</Item>
      <Rule />
      <div className="text-muted px-2 pt-1 pb-0.5 font-mono text-[11px]">
        wallpaper
      </div>
      {WALLPAPERS.map((w) => (
        <Item
          key={w.id}
          checked={wallpaper === w.id}
          onClick={act(() => setWallpaper(w.id))}
        >
          {w.label}
        </Item>
      ))}
    </div>
  )
}

function Item({
  onClick,
  hint,
  checked,
  children,
}: {
  onClick: () => void
  hint?: string
  checked?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role={checked === undefined ? 'menuitem' : 'menuitemradio'}
      aria-checked={checked}
      onClick={onClick}
      className="hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper flex w-full items-center gap-2 rounded px-2 py-1.5 text-left outline-none"
    >
      {checked !== undefined ? (
        <span className="w-3 text-center">{checked ? '●' : ''}</span>
      ) : null}
      <span className="flex-1">{children}</span>
      {hint ? (
        <span className="font-mono text-[11px] opacity-60">{hint}</span>
      ) : null}
    </button>
  )
}

function Rule() {
  return <div className="border-rule my-1 border-t" />
}
