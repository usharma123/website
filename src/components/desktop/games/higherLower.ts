import { RANKS, type Card } from './cards.ts'

export { shuffledDeck } from './cards.ts'

export type Guess = 'higher' | 'lower'

export type HiLoGame = {
  phase: 'ready' | 'playing' | 'over'
  deck: Card[]
  /** Face-up cards in the order they were turned; the last is current. */
  drawn: Card[]
  streak: number
  best: number
  games: number
  message: string
}

export type HiLoAction =
  | { type: 'deal'; deck: Card[] }
  | { type: 'guess'; guess: Guess }
  | { type: 'reset' }

export function initialHiLo(): HiLoGame {
  return {
    phase: 'ready',
    deck: [],
    drawn: [],
    streak: 0,
    best: 0,
    games: 0,
    message: 'Call whether the next card is higher or lower. Aces are high.',
  }
}

/** Two through ace, with aces high. */
export function rankValue(card: Card) {
  return card.rank === 'A' ? 14 : RANKS.indexOf(card.rank) + 1
}

export function hiLoReducer(state: HiLoGame, action: HiLoAction): HiLoGame {
  const betweenGames = state.phase !== 'playing'
  switch (action.type) {
    case 'reset':
      return betweenGames ? initialHiLo() : state
    case 'deal': {
      if (!betweenGames || action.deck.length !== 52) return state
      const [first, ...deck] = action.deck
      return {
        ...state,
        phase: 'playing',
        deck,
        drawn: [first],
        streak: 0,
        message: 'Higher or lower than this one?',
      }
    }
    case 'guess': {
      if (state.phase !== 'playing') return state
      const [next, ...deck] = state.deck
      if (!next) return state
      const current = state.drawn[state.drawn.length - 1]
      const drawn = [...state.drawn, next]
      const diff = rankValue(next) - rankValue(current)
      if (diff === 0) {
        if (!deck.length)
          return {
            ...state,
            deck,
            drawn,
            phase: 'over',
            games: state.games + 1,
            message: 'Same rank on the last card. You called the whole deck.',
          }
        return {
          ...state,
          deck,
          drawn,
          message: 'Same rank. That one doesn’t count either way.',
        }
      }
      const right = diff > 0 === (action.guess === 'higher')
      if (!right) {
        return {
          ...state,
          deck,
          drawn,
          phase: 'over',
          games: state.games + 1,
          message: `Wrong call. Your run ends at ${state.streak}.`,
        }
      }
      const streak = state.streak + 1
      const best = Math.max(state.best, streak)
      if (!deck.length) {
        return {
          ...state,
          deck,
          drawn,
          streak,
          best,
          phase: 'over',
          games: state.games + 1,
          message: 'You called the whole deck. Remarkable.',
        }
      }
      return {
        ...state,
        deck,
        drawn,
        streak,
        best,
        message:
          streak > state.best && state.games > 0
            ? 'Right, and a new best.'
            : 'Right. Higher or lower?',
      }
    }
  }
}
