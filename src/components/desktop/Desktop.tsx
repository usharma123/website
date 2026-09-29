'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import PROJECTS from '@/data/projects'
import type { PostMeta } from '@/lib/posts'
import {
  APPS,
  DESKTOP_APPS,
  Icon,
  PROJECT_SPEC,
  type AppId,
  type AppSpec,
  type WinId,
} from './apps'
import StickyNote from './StickyNote'
import Taskbar from './Taskbar'
import Window from './Window'
import {
  focusedWin,
  initialState,
  reducer,
  type Rect,
  type State,
} from './state'
import Contact from './windows/Contact'
import Post from './windows/Post'
import ProjectDetail from './windows/ProjectDetail'
import Projects from './windows/Projects'
import Readme from './windows/Readme'
import Resume from './windows/Resume'
import Terminal from './windows/Terminal'
import Trash from './windows/Trash'
import Writing from './windows/Writing'

const TASKBAR = 44

type DesktopApi = {
  posts: PostMeta[]
  open: (id: WinId) => void
  close: (id: WinId) => void
  openProject: (slug: string) => void
  openPost: (slug: string) => void
  /** Called by the post route so the reader window tracks what's loaded. */
  mountPost: (slug: string) => () => void
}

const Ctx = createContext<DesktopApi | null>(null)

export function useDesktop() {
  const api = useContext(Ctx)
  if (!api) throw new Error('useDesktop outside <Desktop>')
  return api
}

export function specFor(id: WinId, posts: PostMeta[], postSlug: string | null) {
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

export default function Desktop({
  posts,
  children,
}: {
  posts: PostMeta[]
  children: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, pathname, initialState)
  const stateRef = useRef<State>(state)
  stateRef.current = state

  // The URL follows the focused window, but only once the visitor has
  // done something — the home route shouldn't rewrite itself on load.
  const touched = useRef(false)
  const [loadedPost, setLoadedPost] = useState<string | null>(state.postSlug)

  const place = useCallback((spec: AppSpec): Rect | undefined => {
    const vw = window.innerWidth
    const vh = window.innerHeight - TASKBAR
    if (vw < 768) return undefined
    const n = stateRef.current.wins.filter((w) => !w.minimized).length % 6
    const w = Math.min(spec.w, vw - 48)
    const h = Math.min(spec.h, vh - 48)
    const x = clamp(Math.round((vw - w) / 2) - 60 + n * 28, 16, vw - w - 16)
    const y = clamp(24 + n * 28, 16, vh - h - 16)
    return { x, y, w, h }
  }, [])

  const open = useCallback(
    (id: WinId) => {
      touched.current = true
      const exists = stateRef.current.wins.some((w) => w.id === id)
      const spec = specFor(id, posts, stateRef.current.postSlug)
      dispatch({ type: 'open', id, rect: exists ? undefined : place(spec) })
    },
    [place, posts],
  )

  const api = useMemo<DesktopApi>(
    () => ({
      posts,
      open,
      close: (id) => {
        touched.current = true
        dispatch({ type: 'close', id })
      },
      openProject: (slug) => open(`project:${slug}`),
      openPost: (slug) => {
        dispatch({ type: 'post', slug })
        open('post')
        router.push(`/blog/${slug}`, { scroll: false })
      },
      mountPost: (slug) => {
        setLoadedPost(slug)
        dispatch({ type: 'post', slug })
        return () => setLoadedPost((s) => (s === slug ? null : s))
      },
    }),
    [open, posts, router],
  )

  const focused = focusedWin(state)

  useEffect(() => {
    if (!touched.current) return
    // A post's URL belongs to the router while it's still loading.
    const path =
      focused?.id === 'post'
        ? loadedPost && loadedPost === state.postSlug
          ? `/blog/${loadedPost}`
          : undefined
        : focused
          ? specFor(focused.id, posts, null).path
          : '/'
    if (path && path !== window.location.pathname)
      window.history.replaceState(null, '', path)
  }, [focused, state.postSlug, loadedPost, posts])

  // Going back past the first post leaves the reader window with nothing
  // to show, so close it.
  useEffect(() => {
    if (!pathname.startsWith('/blog/') && !loadedPost)
      dispatch({ type: 'close', id: 'post' })
  }, [pathname, loadedPost])

  useEffect(() => {
    if (!touched.current) return
    const spec = focused ? specFor(focused.id, posts, state.postSlug) : null
    document.title = spec ? `${spec.title} — Utsav Sharma` : 'Utsav Sharma'
  }, [focused, posts, state.postSlug])

  const postWin = state.wins.find((w) => w.id === 'post')

  function frame(id: WinId, body: ReactNode) {
    const w = state.wins.find((w) => w.id === id)
    if (!w) return null
    return (
      <Window
        key={id}
        win={w}
        spec={specFor(id, posts, state.postSlug)}
        focused={focused?.id === id}
        onFocus={() => dispatch({ type: 'focus', id })}
        onClose={() => api.close(id)}
        onMinimize={() => dispatch({ type: 'minimize', id })}
        onToggleMax={() => dispatch({ type: 'toggleMax', id })}
        onRect={(rect) => dispatch({ type: 'rect', id, rect })}
      >
        {body}
      </Window>
    )
  }

  return (
    <Ctx.Provider value={api}>
      <div className="wallpaper fixed inset-0 overflow-hidden">
        <nav
          aria-label="Desktop"
          className="absolute top-4 left-3 grid grid-cols-3 gap-1 md:grid-cols-1 md:gap-2"
        >
          {DESKTOP_APPS.map((id) => (
            <DesktopIcon key={id} id={id} onOpen={() => open(id)} />
          ))}
        </nav>

        <StickyNote latest={posts[0]} />

        <div className="absolute right-4 bottom-[60px]">
          <DesktopIcon id="trash" label="Trash" onOpen={() => open('trash')} />
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{ bottom: TASKBAR }}
        >
          {state.wins.map((w) => {
            if (w.id === 'post') return null
            if (w.id.startsWith('project:')) {
              return frame(
                w.id,
                <ProjectDetail slug={w.id.slice('project:'.length)} />,
              )
            }
            return frame(w.id, <AppBody id={w.id as AppId} />)
          })}

          {/* The reader window always renders the route's children so the
              post route can mount; it's only visible when it's open. */}
          {postWin ? (
            frame(
              'post',
              <Post loading={state.postSlug !== loadedPost}>{children}</Post>,
            )
          ) : (
            <div hidden>{children}</div>
          )}
        </div>

        <Taskbar
          wins={state.wins}
          focusedId={focused?.id}
          titleOf={(id) => specFor(id, posts, state.postSlug).title}
          iconOf={(id) => specFor(id, posts, state.postSlug).icon}
          onTask={(id) => {
            const w = state.wins.find((w) => w.id === id)
            if (w && !w.auto && focused?.id === id)
              dispatch({ type: 'minimize', id })
            else open(id)
          }}
        />
      </div>
    </Ctx.Provider>
  )
}

function AppBody({ id }: { id: AppId }) {
  switch (id) {
    case 'readme':
      return <Readme />
    case 'projects':
      return <Projects />
    case 'writing':
      return <Writing />
    case 'resume':
      return <Resume />
    case 'terminal':
      return <Terminal />
    case 'contact':
      return <Contact />
    case 'trash':
      return <Trash />
    case 'post':
      return null
  }
}

function DesktopIcon({
  id,
  label,
  onOpen,
}: {
  id: AppId
  label?: string
  onOpen: () => void
}) {
  const spec = APPS[id]
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-[88px] flex-col items-center gap-1 rounded-md p-1.5 text-center focus-visible:outline-offset-0"
    >
      <span className="transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0">
        <Icon name={spec.icon} />
      </span>
      <span className="group-hover:bg-ink group-hover:text-paper group-focus-visible:bg-ink group-focus-visible:text-paper rounded-sm px-1 text-[12.5px] leading-tight font-medium">
        {label ?? spec.label}
      </span>
    </button>
  )
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max))
}
