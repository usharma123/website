import { useEffect, type RefObject } from 'react'
import { PHONE_MEDIA, type PhoneView } from './mobile/gestures'

type Options = {
  focusedId?: string
  spec: { title: string; path?: string } | null
  postSlug: string | null
  loadedPost: string | null
  phoneView: PhoneView
  touched: RefObject<boolean>
}

/** Keep the address and page title in sync with the active app. */
export function useWindowLocation({
  focusedId,
  spec,
  postSlug,
  loadedPost,
  phoneView,
  touched,
}: Options) {
  const appPath = spec?.path
  const title = spec?.title
  useEffect(() => {
    if (!touched.current) return
    const onPhoneHome =
      window.matchMedia(PHONE_MEDIA).matches && phoneView !== 'app'
    // The router owns the post URL while its content is loading.
    const path =
      focusedId === 'post'
        ? loadedPost && loadedPost === postSlug
          ? `/blog/${loadedPost}`
          : undefined
        : (appPath ?? '/')
    if (!onPhoneHome && path && path !== window.location.pathname)
      window.history.replaceState(null, '', path)
    document.title =
      !onPhoneHome && title && focusedId !== 'home'
        ? `${title} — Utsav Sharma`
        : 'Utsav Sharma'
  }, [focusedId, appPath, title, postSlug, loadedPost, phoneView, touched])
}
