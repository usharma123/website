'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'

import type { PostMeta } from '@/lib/posts'
import {
  APPS,
  DESKTOP_APPS,
  specFor,
  type AppId,
  type AppSpec,
  type WinId,
} from './apps'
import ContextMenu from './ContextMenu'
import { DesktopContext, type DesktopApi, type Wallpaper } from './context'
import { Icon } from './icons'
import Search from './Search'
import Phone from './mobile/Phone'
import { useWindowLocation } from './useWindowLocation'
import { PHONE_MEDIA, type PhoneView } from './mobile/gestures'
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
import Home from './windows/Home'
import Post from './windows/Post'

// Window bodies load on demand; Home ships with the page because it's what
// most visitors see first.
const Readme = dynamic(() => import('./windows/Readme'))
const Projects = dynamic(() => import('./windows/Projects'))
const ProjectDetail = dynamic(() => import('./windows/ProjectDetail'))
const Writing = dynamic(() => import('./windows/Writing'))
const Resume = dynamic(() => import('./windows/Resume'))
const Terminal = dynamic(() => import('./windows/Terminal'))
const Contact = dynamic(() => import('./windows/Contact'))
const Trash = dynamic(() => import('./windows/Trash'))
const Blackjack = dynamic(() => import('./windows/Blackjack'))

const TASKBAR = 44
const WALLPAPER_KEY = 'desktop:wallpaper'

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
  const [phoneView, setPhoneView] = useState<PhoneView>(() =>
    pathname === '/' ? 'home' : 'app',
  )
  const [loadedPost, setLoadedPost] = useState<string | null>(state.postSlug)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const [wallpaper, setWallpaperState] = useState<Wallpaper>('dots')

  // Handlers read the latest state through a ref so they stay stable.
  const stateRef = useRef<State>(state)
  useLayoutEffect(() => {
    stateRef.current = state
  }, [state])

  // The URL follows the focused window, but only once the visitor has
  // done something — a route shouldn't rewrite itself on load.
  const touched = useRef(false)

  useEffect(() => {
    const saved = localStorage.getItem(WALLPAPER_KEY)
    if (saved === 'dots' || saved === 'grid' || saved === 'plain')
      setWallpaperState(saved)
  }, [])

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
      setPhoneView('app')
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
      openSearch: () => setSearchOpen(true),
      wallpaper,
      setWallpaper: (w) => {
        setWallpaperState(w)
        localStorage.setItem(WALLPAPER_KEY, w)
      },
    }),
    [open, posts, router, wallpaper],
  )

  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const closeMenu = useCallback(() => setMenu(null), [])

  const focused = focusedWin(state)
  const visiblePhoneView = phoneView === 'app' && !focused ? 'home' : phoneView
  const changePhoneView = useCallback((view: PhoneView) => {
    setPhoneView(view)
    if (view === 'home' && window.matchMedia(PHONE_MEDIA).matches) {
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur()
      window.history.replaceState(null, '', '/')
    }
  }, [])

  useWindowLocation({
    focusedId: focused?.id,
    spec: focused ? specFor(focused.id, posts, state.postSlug) : null,
    postSlug: state.postSlug,
    loadedPost,
    phoneView,
    touched,
  })

  // Going back past the first post leaves the reader window with nothing
  // to show, so close it.
  useEffect(() => {
    if (!pathname.startsWith('/blog/') && !loadedPost)
      dispatch({ type: 'close', id: 'post' })
  }, [pathname, loadedPost])

  // ⌘K / Ctrl+K searches; ` toggles the terminal when you're not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((o) => !o)
        return
      }
      const t = e.target as HTMLElement | null
      const typing =
        t?.isContentEditable ||
        t?.tagName === 'INPUT' ||
        t?.tagName === 'TEXTAREA'
      if (e.key === '`' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        const top = focusedWin(stateRef.current)
        if (top?.id === 'terminal')
          dispatch({ type: 'minimize', id: 'terminal' })
        else open('terminal')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function arrange() {
    touched.current = true
    const vw = window.innerWidth
    const vh = window.innerHeight - TASKBAR
    const order = state.wins
      .filter((w) => !w.minimized)
      .sort((a, b) => a.z - b.z)
    const rects = order.map((w, i) => {
      const spec = specFor(w.id, posts, state.postSlug)
      const ww = Math.min(spec.w, vw - 160)
      const hh = Math.min(spec.h, vh - 48 - order.length * 28)
      return { x: 128 + i * 32, y: 24 + i * 28, w: ww, h: Math.max(hh, 280) }
    })
    dispatch({ type: 'arrange', rects })
  }

  function onDesktopMenu(e: MouseEvent) {
    // Only the bare desktop gets the custom menu; windows keep the browser's.
    if ((e.target as HTMLElement).closest('section, footer, dialog')) return
    e.preventDefault()
    // Keep the menu on screen near the right and bottom edges.
    setMenu({
      x: Math.min(e.clientX, window.innerWidth - 232),
      y: Math.min(e.clientY, window.innerHeight - 330),
    })
  }

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
        onMaximize={() => {
          if (!w.maximized) dispatch({ type: 'toggleMax', id })
        }}
        onRect={(rect) => dispatch({ type: 'rect', id, rect })}
      >
        {body}
      </Window>
    )
  }

  return (
    <DesktopContext.Provider value={api}>
      <div
        className={`wallpaper wallpaper-${wallpaper} fixed inset-0 overflow-hidden`}
        data-phone-view={visiblePhoneView}
        onContextMenu={onDesktopMenu}
      >
        <nav
          aria-label="Desktop"
          className="desktop-icons absolute top-4 left-3 grid grid-cols-4 gap-1 md:grid-cols-1 md:gap-1"
        >
          {DESKTOP_APPS.map((id) => (
            <DesktopIcon key={id} id={id} onOpen={() => open(id)} />
          ))}
        </nav>

        <StickyNote latest={posts[0]} />

        <div className="desktop-trash absolute right-4 bottom-[60px]">
          <DesktopIcon id="trash" label="Trash" onOpen={() => open('trash')} />
        </div>

        <div
          className="desktop-workspace pointer-events-none absolute inset-x-0 top-0"
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
            if (focused?.id === id) dispatch({ type: 'minimize', id })
            else open(id)
          }}
        />

        <Phone
          view={visiblePhoneView}
          onView={changePhoneView}
          wins={state.wins}
          focusedId={focused?.id}
          titleOf={(id) => specFor(id, posts, state.postSlug).title}
          iconFor={(id, size) => (
            <Icon name={specFor(id, posts, state.postSlug).icon} size={size} />
          )}
          onOpen={open}
          onClose={api.close}
          onPost={api.openPost}
          posts={posts}
        />

        {menu ? (
          <ContextMenu
            x={menu.x}
            y={menu.y}
            onClose={closeMenu}
            onArrange={arrange}
            onCloseAll={() => {
              touched.current = true
              dispatch({ type: 'closeAll' })
            }}
          />
        ) : null}
      </div>

      {searchOpen ? <Search onClose={closeSearch} /> : null}
    </DesktopContext.Provider>
  )
}

function AppBody({ id }: { id: AppId }) {
  switch (id) {
    case 'home':
      return <Home />
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
    case 'blackjack':
      return <Blackjack />
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
      className="group flex w-[84px] flex-col items-center gap-1 rounded-md p-1.5 text-center focus-visible:outline-offset-0"
    >
      <span className="transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0">
        <Icon name={spec.icon} size={32} />
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
