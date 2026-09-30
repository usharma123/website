import { RANKS, shuffle, type Card } from './cards.ts'

export const PAIRS = 6

export type MemoryGame = {
  phase: 'ready' | 'playing' | 'won'
  cards: Card[]
  matched: boolean[]
  /** Face-up cards that aren't matched yet: at most two. */
  open: number[]
  moves: number
  /** Fewest moves for a cleared board this session. */
  best: number | null
  message: string
}

export type MemoryAction =
  | { type: 'deal'; cards: Card[] }
  | { type: 'flip'; index: number }
  | { type: 'hide' }
  | { type: 'reset' }

export function initialMemory(): MemoryGame {
  return {
    phase: 'ready',
    cards: [],
    matched: [],
    open: [],
    moves: 0,
    best: null,
    message: 'Turn over two cards at a time and find the six matching pairs.',
  }
}

/** Six ranks, each dealt as a same-colour pair, then shuffled. */
export function memoryLayout(random: () => number = Math.random): Card[] {
  const pairs: [Card['suit'], Card['suit']][] = [
    ['♠', '♣'],
    ['♥', '♦'],
  ]
  const ranks = shuffle(RANKS, random).slice(0, PAIRS)
  const cards = ranks.flatMap((rank) => {
    const [a, b] = pairs[Math.floor(random() * pairs.length)]
    return [
      { rank, suit: a },
      { rank, suit: b },
    ]
  })
  return shuffle(cards, random)
}

export function memoryReducer(
  state: MemoryGame,
  action: MemoryAction,
): MemoryGame {
  switch (action.type) {
    case 'reset':
      return state.phase === 'playing' ? state : initialMemory()
    case 'deal':
      if (state.phase === 'playing' || action.cards.length !== PAIRS * 2)
        return state
      return {
        ...state,
        phase: 'playing',
        cards: action.cards,
        matched: action.cards.map(() => false),
        open: [],
        moves: 0,
        message: 'Pick a card.',
      }
    case 'hide':
      return state.open.length === 2 ? { ...state, open: [] } : state
    case 'flip': {
      const { index } = action
      if (
        state.phase !== 'playing' ||
        !state.cards[index] ||
        state.matched[index] ||
        state.open.includes(index)
      )
        return state
      // Turning a third card puts the unmatched two face down first.
      const open = state.open.length === 2 ? [] : state.open
      if (!open.length)
        return { ...state, open: [index], message: 'Now find its pair.' }

      const first = open[0]
      const moves = state.moves + 1
      if (state.cards[first].rank !== state.cards[index].rank)
        return { ...state, open: [first, index], moves, message: 'No match.' }

      const matched = state.matched.map(
        (m, i) => m || i === first || i === index,
      )
      if (matched.every(Boolean)) {
        const best = state.best === null ? moves : Math.min(state.best, moves)
        return {
          ...state,
          phase: 'won',
          matched,
          open: [],
          moves,
          best,
          message:
            state.best !== null && moves < state.best
              ? `Cleared in ${moves} moves. A new best.`
              : `Cleared in ${moves} moves.`,
        }
      }
      return { ...state, matched, open: [], moves, message: 'A pair.' }
    }
  }
}
