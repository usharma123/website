export const PHONE_MEDIA =
  '(max-width: 767px), (pointer: coarse) and (max-width: 1023px)'

export type PhoneView = 'home' | 'app' | 'recents' | 'search'

export function navigationGesture(
  dx: number,
  dy: number,
  duration: number,
): PhoneView | null {
  if (dy > -45 || Math.abs(dy) < Math.abs(dx) * 1.25) return null
  return duration >= 400 ? 'recents' : 'home'
}

export function dismissGesture(dx: number, dy: number) {
  return dy < -70 && Math.abs(dy) > Math.abs(dx) * 1.25
}
