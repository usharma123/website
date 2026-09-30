export type Card = {
  suit: '♠' | '♥' | '♦' | '♣'
  rank: string
}

export const SUIT_NAMES = {
  '♠': 'spades',
  '♥': 'hearts',
  '♦': 'diamonds',
  '♣': 'clubs',
} as const

export const SUITS: Card['suit'][] = ['♠', '♥', '♦', '♣']
export const RANKS = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
]

export function shuffle<T>(items: T[], random: () => number = Math.random) {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Shuffle outside the reducers so replaying an action never changes its result.
export function shuffledDeck(random: () => number = Math.random): Card[] {
  return shuffle(
    SUITS.flatMap((suit) => RANKS.map((rank) => ({ suit, rank }))),
    random,
  )
}
