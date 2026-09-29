export type Card = {
  suit: '♠' | '♥' | '♦' | '♣'
  rank: string
}

export type Game = {
  phase: 'ready' | 'player' | 'dealer' | 'settled'
  deck: Card[]
  player: Card[]
  dealer: Card[]
  rounds: number
  wins: number
  losses: number
  outcome: 'blackjack' | 'win' | 'lose' | 'push' | null
  message: string
}

export type Action =
  | { type: 'deal'; deck: Card[] }
  | { type: 'hit' }
  | { type: 'stand' }
  | { type: 'dealer' }
  | { type: 'reset' }

export function initialGame(): Game {
  return {
    phase: 'ready',
    deck: [],
    player: [],
    dealer: [],
    rounds: 0,
    wins: 0,
    losses: 0,
    outcome: null,
    message: 'Get closer to 21 than the dealer. Going over ends the hand.',
  }
}

export function handValue(cards: Card[]) {
  let total = 0
  let aces = 0
  for (const card of cards) {
    if (card.rank === 'A') {
      total += 11
      aces++
    } else total += ['J', 'Q', 'K'].includes(card.rank) ? 10 : Number(card.rank)
  }
  while (total > 21 && aces > 0) {
    total -= 10
    aces--
  }
  return { total, soft: aces > 0 }
}

// Shuffle outside the reducer so replaying an action never changes its result.
export function shuffledDeck(random: () => number = Math.random): Card[] {
  const suits: Card['suit'][] = ['♠', '♥', '♦', '♣']
  const ranks = [
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
  const deck = suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank })))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function settle(
  state: Game,
  outcome: NonNullable<Game['outcome']>,
  message: string,
): Game {
  const won = outcome === 'win' || outcome === 'blackjack'
  return {
    ...state,
    phase: 'settled',
    outcome,
    message,
    rounds: state.rounds + 1,
    wins: state.wins + (won ? 1 : 0),
    losses: state.losses + (outcome === 'lose' ? 1 : 0),
  }
}

export function gameReducer(state: Game, action: Action): Game {
  const betweenHands = state.phase === 'ready' || state.phase === 'settled'
  switch (action.type) {
    case 'reset':
      return betweenHands ? initialGame() : state
    case 'deal': {
      if (!betweenHands || action.deck.length !== 52) return state
      const [p1, d1, p2, d2, ...deck] = action.deck
      const next: Game = {
        ...state,
        phase: 'player',
        deck,
        player: [p1, p2],
        dealer: [d1, d2],
        outcome: null,
        message: 'Hit for another card, or stand to keep your hand.',
      }
      const playerNatural = handValue(next.player).total === 21
      const dealerNatural = handValue(next.dealer).total === 21
      if (playerNatural && dealerNatural)
        return settle(next, 'push', 'Both have blackjack. A draw.')
      if (dealerNatural) return settle(next, 'lose', 'Dealer has blackjack.')
      if (playerNatural) return settle(next, 'blackjack', 'Blackjack. You win.')
      return next
    }
    case 'stand':
      return state.phase === 'player'
        ? { ...state, phase: 'dealer', message: "Dealer's turn." }
        : state
    case 'hit': {
      if (state.phase !== 'player') return state
      const [card, ...deck] = state.deck
      if (!card) return state
      const next: Game = { ...state, deck, player: [...state.player, card] }
      const total = handValue(next.player).total
      if (total > 21) return settle(next, 'lose', 'Over 21. Dealer wins.')
      if (total === 21)
        return {
          ...next,
          phase: 'dealer',
          message: "21. Let's see the dealer's hand.",
        }
      return { ...next, message: 'Another card, or keep this hand?' }
    }
    case 'dealer': {
      if (state.phase !== 'dealer') return state
      const dealerTotal = handValue(state.dealer).total
      if (dealerTotal < 17) {
        const [card, ...deck] = state.deck
        if (!card) return state
        return { ...state, deck, dealer: [...state.dealer, card] }
      }
      const playerTotal = handValue(state.player).total
      if (dealerTotal > 21)
        return settle(state, 'win', 'Dealer goes over 21. You win.')
      if (playerTotal > dealerTotal)
        return settle(state, 'win', 'Your hand wins.')
      if (playerTotal === dealerTotal)
        return settle(state, 'push', 'Same total. A draw.')
      return settle(state, 'lose', 'Dealer wins this hand.')
    }
  }
}
