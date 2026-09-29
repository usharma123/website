export type AppId =
  | 'readme'
  | 'projects'
  | 'writing'
  | 'resume'
  | 'terminal'
  | 'contact'
  | 'trash'
  | 'post'
export type WinId = AppId | `project:${string}`

type Slot = { left?: string; right?: string; top: string }

export type AppSpec = {
  title: string
  /** Label under the desktop icon; apps without one aren't on the desktop. */
  label?: string
  icon: IconName
  /** Real route for this window, so it can be linked to and prerendered. */
  path?: string
  w: number
  h: number
  /** Where the window sits when it's rendered on the server. */
  slot?: Slot
}

export const APPS: Record<AppId, AppSpec> = {
  readme: {
    title: 'README.md',
    label: 'README.md',
    icon: 'doc',
    path: '/about',
    w: 560,
    h: 640,
    slot: { left: 'max(128px, calc(50% - 560px))', top: '40px' },
  },
  projects: {
    title: 'Projects',
    label: 'Projects',
    icon: 'folder',
    path: '/work',
    w: 740,
    h: 640,
    slot: { right: 'max(24px, calc(50% - 620px))', top: '96px' },
  },
  writing: {
    title: 'Writing',
    label: 'Writing',
    icon: 'notebook',
    path: '/blog',
    w: 660,
    h: 620,
  },
  resume: {
    title: 'Résumé',
    label: 'Résumé',
    icon: 'clipboard',
    path: '/resume',
    w: 720,
    h: 660,
  },
  terminal: {
    title: 'Terminal',
    label: 'Terminal',
    icon: 'terminal',
    w: 640,
    h: 420,
  },
  contact: { title: 'Contact', label: 'Contact', icon: 'mail', w: 440, h: 320 },
  trash: { title: 'Trash', icon: 'trash', w: 480, h: 360 },
  post: { title: 'Post', icon: 'page', w: 800, h: 1000 },
}

export const PROJECT_SPEC: Omit<AppSpec, 'title'> = {
  icon: 'box',
  w: 620,
  h: 640,
}

export const DESKTOP_APPS: AppId[] = [
  'readme',
  'projects',
  'writing',
  'resume',
  'terminal',
  'contact',
]

export function appForPath(pathname: string): AppId | null {
  if (pathname.startsWith('/blog/')) return 'post'
  const hit = (Object.keys(APPS) as AppId[]).find(
    (id) => APPS[id].path === pathname,
  )
  return hit ?? null
}

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

const ICONS: Record<IconName, React.ReactNode> = {
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
      <path d="M4 19h40v23H4z" className={`fill-[#5667e6] ${S}`} />
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
      <path d="M9 8h30v35H9z" className={`fill-[#c8ae80] ${S}`} />
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
  box: (
    <>
      <path d="M24 5l18 9v20l-18 9-18-9V14z" className={`fill-sage ${S}`} />
      <path d="M6 14l18 9 18-9M24 23v20" className={S} />
    </>
  ),
}
