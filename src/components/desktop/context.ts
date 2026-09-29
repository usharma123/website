'use client'

import { createContext, useContext } from 'react'

import type { PostMeta } from '@/lib/posts'
import type { WinId } from './apps'

export type Wallpaper = 'dots' | 'grid' | 'plain'

export type DesktopApi = {
  posts: PostMeta[]
  open: (id: WinId) => void
  close: (id: WinId) => void
  openProject: (slug: string) => void
  openPost: (slug: string) => void
  /** Called by the post route so the reader window tracks what's loaded. */
  mountPost: (slug: string) => () => void
  openSearch: () => void
  wallpaper: Wallpaper
  setWallpaper: (w: Wallpaper) => void
}

export const DesktopContext = createContext<DesktopApi | null>(null)

export function useDesktop() {
  const api = useContext(DesktopContext)
  if (!api) throw new Error('useDesktop outside <Desktop>')
  return api
}
