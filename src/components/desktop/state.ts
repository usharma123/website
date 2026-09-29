import { appForPath, type WinId } from './apps'

export type Rect = { x: number; y: number; w: number; h: number }

export type Win = {
  id: WinId
  z: number
  x?: number
  y?: number
  w?: number
  h?: number
  minimized: boolean
  maximized: boolean
}

export type State = { wins: Win[]; top: number; postSlug: string | null }

export type Action =
  | { type: 'open'; id: WinId; rect?: Rect }
  | { type: 'close'; id: WinId }
  | { type: 'focus'; id: WinId }
  | { type: 'minimize'; id: WinId }
  | { type: 'toggleMax'; id: WinId }
  | { type: 'rect'; id: WinId; rect: Rect }
  | { type: 'post'; slug: string }
  | { type: 'arrange'; rects: Rect[] }
  | { type: 'closeAll' }

function win(id: WinId, z: number): Win {
  return { id, z, minimized: false, maximized: false }
}

export function initialState(pathname: string): State {
  const app = appForPath(pathname) ?? 'home'
  const postSlug =
    app === 'post' ? decodeURIComponent(pathname.slice('/blog/'.length)) : null
  return { wins: [win(app, 1)], top: 1, postSlug }
}

function update(
  state: State,
  id: WinId,
  patch: (w: Win) => Partial<Win>,
): State {
  return {
    ...state,
    wins: state.wins.map((w) => (w.id === id ? { ...w, ...patch(w) } : w)),
  }
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open': {
      const top = state.top + 1
      if (state.wins.some((w) => w.id === action.id)) {
        return {
          ...update(state, action.id, () => ({
            z: top,
            minimized: false,
          })),
          top,
        }
      }
      return {
        ...state,
        top,
        wins: [...state.wins, { ...win(action.id, top), ...action.rect }],
      }
    }
    case 'close':
      return { ...state, wins: state.wins.filter((w) => w.id !== action.id) }
    case 'focus': {
      const current = state.wins.find((w) => w.id === action.id)
      if (!current || current.z === state.top) return state
      const top = state.top + 1
      return { ...update(state, action.id, () => ({ z: top })), top }
    }
    case 'minimize':
      return update(state, action.id, () => ({ minimized: true }))
    case 'toggleMax':
      return update(state, action.id, (w) => ({ maximized: !w.maximized }))
    case 'rect':
      return update(state, action.id, () => action.rect)
    case 'post':
      return { ...state, postSlug: action.slug }
    case 'arrange': {
      // Cascade open windows in their current stacking order.
      const order = state.wins
        .filter((w) => !w.minimized)
        .sort((a, b) => a.z - b.z)
      return {
        ...state,
        wins: state.wins.map((w) => {
          const i = order.indexOf(w)
          return i < 0 || !action.rects[i]
            ? w
            : { ...w, ...action.rects[i], maximized: false }
        }),
      }
    }
    case 'closeAll':
      return { ...state, wins: [] }
  }
}

/** The window the visitor is looking at: highest, and not minimized. */
export function focusedWin(state: State): Win | undefined {
  return state.wins
    .filter((w) => !w.minimized)
    .reduce<Win | undefined>((a, b) => (!a || b.z > a.z ? b : a), undefined)
}
