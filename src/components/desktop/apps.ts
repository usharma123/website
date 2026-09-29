import PROJECTS from '@/data/projects'
import type { PostMeta } from '@/lib/posts'
import type { IconName } from './icons'

export type AppId =
  | 'home'
  | 'readme'
  | 'projects'
  | 'writing'
  | 'resume'
  | 'terminal'
  | 'blackjack'
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
  home: {
    title: 'Welcome',
    label: 'Welcome',
    icon: 'home',
    path: '/',
    w: 1080,
    h: 820,
    slot: { left: 'max(128px, calc(50% - 540px))', top: '24px' },
  },
  readme: {
    title: 'README.md',
    label: 'README.md',
    icon: 'doc',
    path: '/about',
    w: 560,
    h: 640,
  },
  projects: {
    title: 'Projects',
    label: 'Projects',
    icon: 'folder',
    path: '/work',
    w: 740,
    h: 640,
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
    w: 680,
    h: 440,
  },
  contact: { title: 'Contact', label: 'Contact', icon: 'mail', w: 440, h: 320 },
  blackjack: { title: 'Blackjack', label: 'Blackjack', icon: 'cards', path: '/blackjack', w: 560, h: 690 },
  trash: { title: 'Trash', icon: 'trash', w: 480, h: 360 },
  post: { title: 'Post', icon: 'page', w: 800, h: 1000 },
}

export const PROJECT_SPEC: Omit<AppSpec, 'title'> = {
  icon: 'box',
  w: 620,
  h: 640,
}

export const DESKTOP_APPS: AppId[] = [
  'home',
  'readme',
  'projects',
  'writing',
  'resume',
  'terminal',
  'contact',
  'blackjack',
]

export function appForPath(pathname: string): AppId | null {
  if (pathname.startsWith('/blog/')) return 'post'
  const hit = (Object.keys(APPS) as AppId[]).find(
    (id) => APPS[id].path === pathname,
  )
  return hit ?? null
}

export function specFor(
  id: WinId,
  posts: PostMeta[],
  postSlug: string | null,
): AppSpec {
  if (id.startsWith('project:')) {
    const p = PROJECTS.find((p) => `project:${p.slug}` === id)
    return { ...PROJECT_SPEC, title: p?.name ?? 'Project' }
  }
  const spec = APPS[id as AppId]
  if (id === 'post') {
    const post = posts.find((p) => p.slug === postSlug)
    return { ...spec, title: post?.title ?? spec.title }
  }
  return spec
}
