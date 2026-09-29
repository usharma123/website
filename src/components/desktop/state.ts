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
  /** Opened by the home route rather than the visitor; hidden on phones. */
  auto: boolean
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

function win(id: WinId, z: number, auto = false): Win {
  return { id, z, minimized: false, maximized: false, auto }
}

export function initialState(pathname: string): State {
  const app = appForPath(pathname)
  const postSlug =
    app === 'post' ? decodeURIComponent(pathname.slice('/blog/'.length)) : null
  const wins = app
    ? [win(app, 1)]
    : [win('readme', 1, true), win('projects', 2, true)]
  return { wins, top: wins.length, postSlug }
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
            auto: false,
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
  }
}

/** The window the visitor is looking at: highest, and not minimized. */
export function focusedWin(state: State): Win | undefined {
  return state.wins
    .filter((w) => !w.minimized)
    .reduce<Win | undefined>((a, b) => (!a || b.z > a.z ? b : a), undefined)
}
