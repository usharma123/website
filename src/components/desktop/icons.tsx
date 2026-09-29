import type { ReactNode } from 'react'

/* ---- Icons ---------------------------------------------------------------
   Drawn on a 48-unit grid with a 2px ink stroke so they read as one set. */

export type IconName =
  | 'doc'
  | 'folder'
  | 'notebook'
  | 'clipboard'
  | 'terminal'
  | 'mail'
  | 'trash'
  | 'page'
  | 'box'
  | 'home'
  | 'cards'

const S = 'stroke-ink'

export function Icon({ name, size = 44 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  )
}

const ICONS: Record<IconName, ReactNode> = {
  cards: (
    <>
      <rect x="6" y="6" width="26" height="34" rx="3" transform="rotate(-10 19 23)" className={`fill-marker ${S}`} />
      <rect x="17" y="9" width="26" height="34" rx="3" className={`fill-paper ${S}`} />
      <path d="M30 17c-2 3-7 5-7 8a4 4 0 0 0 7 2 4 4 0 0 0 7-2c0-3-5-5-7-8z" className="fill-ink" />
      <path d="M30 26v8m-4 0h8" className={S} />
    </>
  ),
  doc: (
    <>
      <path d="M11 5h18l9 9v29H11z" className={`fill-paper ${S}`} />
      <path d="M29 5v9h9" className={`fill-chrome ${S}`} />
      <path d="M16 22h16M16 28h16M16 34h10" className={S} />
    </>
  ),
  page: (
    <>
      <path d="M11 5h26v38H11z" className={`fill-paper ${S}`} />
      <path d="M11 5h26v8H11z" className={`fill-accent ${S}`} />
      <path d="M16 20h16M16 26h16M16 32h12" className={S} />
    </>
  ),
  folder: (
    <>
      <path d="M4 11h14l4 5h22v26H4z" className={`fill-accent ${S}`} />
      <path d="M4 19h40v23H4z" className={`fill-[#4a78c2] ${S}`} />
    </>
  ),
  notebook: (
    <>
      <path d="M12 5h26v38H12z" className={`fill-marker ${S}`} />
      <path d="M18 5v38" className={S} />
      <path d="M8 12h7M8 20h7M8 28h7M8 36h7" className={S} />
      <path d="M23 15h10M23 21h10" className={S} />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 8h30v35H9z" className={`fill-clay ${S}`} />
      <path d="M13 14h22v25H13z" className={`fill-paper ${S}`} />
      <path d="M18 5h12v6H18z" className={`fill-chrome ${S}`} />
      <path d="M17 21h14M17 27h14M17 33h8" className={S} />
    </>
  ),
  terminal: (
    <>
      <path d="M4 9h40v30H4z" className={`fill-ink ${S}`} />
      <path d="M11 18l6 5-6 5" className="stroke-paper" />
      <path d="M21 29h10" className="stroke-marker" />
    </>
  ),
  mail: (
    <>
      <path d="M5 12h38v26H5z" className={`fill-paper ${S}`} />
      <path d="M5 12l19 15 19-15" className={S} />
    </>
  ),
  trash: (
    <>
      <path d="M11 14h26l-3 29H14z" className={`fill-chrome ${S}`} />
      <path d="M8 14h32M19 14V8h10v6" className={S} />
      <path d="M20 20v17M28 20v17" className={S} />
    </>
  ),
  home: (
    <>
      <path d="M6 22L24 7l18 15v20H6z" className={`fill-paper ${S}`} />
      <path d="M6 22L24 7l18 15" className={S} />
      <path d="M19 42V30h10v12" className={`fill-marker ${S}`} />
      <path d="M11 22h26" className="stroke-accent" />
    </>
  ),
  box: (
    <>
      <path d="M24 5l18 9v20l-18 9-18-9V14z" className={`fill-clay ${S}`} />
      <path d="M6 14l18 9 18-9M24 23v20" className={S} />
    </>
  ),
}
