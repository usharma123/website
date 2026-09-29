import assert from 'node:assert/strict'
import { test } from 'node:test'
import { gameReducer, handValue, initialGame, shuffledDeck } from './game.ts'

// Put specified cards on top of a complete, unique deck.
function deck(...ranks) {
  const rest = shuffledDeck(() => 0.5)
  const top = ranks.map((rank) => {
    const index = rest.findIndex((card) => card.rank === rank)
    assert.notEqual(index, -1)
    return rest.splice(index, 1)[0]
  })
  return [...top, ...rest]
}
function deal(...ranks) {
  return gameReducer(initialGame(), { type: 'deal', deck: deck(...ranks) })
}
function finish(state) {
  for (let i = 0; state.phase === 'dealer' && i < 20; i++) {
    state = gameReducer(state, { type: 'dealer' })
  }
  assert.equal(state.phase, 'settled')
  return state
}
function values(...ranks) {
  return ranks.map((rank) => ({ rank, suit: '♠' }))
}

test('aces downgrade independently and retain a soft total where possible', () => {
  assert.deepEqual(handValue(values('A', '6')), { total: 17, soft: true })
  assert.deepEqual(handValue(values('A', 'A', '9')), { total: 21, soft: true })
  assert.deepEqual(handValue(values('A', 'A', '9', 'K')), {
    total: 21,
    soft: false,
  })
  assert.deepEqual(handValue(values('J', 'Q', '2')), { total: 22, soft: false })
})
test('shuffling keeps all 52 unique cards and is reproducible with an injected RNG', () => {
  const cards = shuffledDeck(() => 0.25)
  assert.equal(cards.length, 52)
  assert.equal(new Set(cards.map((c) => c.rank + c.suit)).size, 52)
  assert.deepEqual(
    cards,
    shuffledDeck(() => 0.25),
  )
})
test('deals alternately and removes four cards without mutating the supplied deck', () => {
  const cards = deck('10', '6', '8', '9')
  const original = structuredClone(cards)
  const state = gameReducer(initialGame(), { type: 'deal', deck: cards })
  assert.deepEqual(
    state.player.map((c) => c.rank),
    ['10', '8'],
  )
  assert.deepEqual(
    state.dealer.map((c) => c.rank),
    ['6', '9'],
  )
  assert.equal(state.deck.length, 48)
  assert.deepEqual(cards, original)
})
test('player blackjack wins immediately and scores once', () => {
  const state = deal('A', '9', 'K', '8')
  assert.equal(state.outcome, 'blackjack')
  assert.equal(state.wins, 1)
  assert.equal(state.rounds, 1)
  assert.strictEqual(gameReducer(state, { type: 'dealer' }), state)
})
test('dealer natural wins and matching naturals draw', () => {
  assert.equal(deal('9', 'A', '8', 'K').outcome, 'lose')
  const tie = deal('A', 'A', 'K', 'Q')
  assert.equal(tie.outcome, 'push')
  assert.equal(tie.wins, 0)
  assert.equal(tie.losses, 0)
})
test('busting ends the hand without allowing another draw', () => {
  let state = deal('10', '8', '7', '9', 'K')
  state = gameReducer(state, { type: 'hit' })
  assert.equal(state.outcome, 'lose')
  assert.equal(state.losses, 1)
  assert.strictEqual(gameReducer(state, { type: 'hit' }), state)
})
test('hitting 21 automatically passes play to the dealer', () => {
  const state = gameReducer(deal('10', '8', '5', '9', '6'), { type: 'hit' })
  assert.equal(state.phase, 'dealer')
  assert.equal(finish(state).outcome, 'win')
})
test('dealer stands on soft 17 without taking the next card', () => {
  const state = finish(
    gameReducer(deal('10', 'A', '8', '6', 'K'), { type: 'stand' }),
  )
  assert.equal(state.dealer.length, 2)
  assert.equal(state.outcome, 'win')
})
test('dealer draws one card at a time below 17 and can bust', () => {
  let state = gameReducer(deal('10', '6', '8', '9', 'K'), { type: 'stand' })
  state = gameReducer(state, { type: 'dealer' })
  assert.equal(state.dealer.length, 3)
  assert.equal(state.phase, 'dealer')
  assert.equal(finish(state).outcome, 'win')
})
test('equal totals push and a higher dealer total loses', () => {
  assert.equal(
    finish(gameReducer(deal('10', '9', '8', '9'), { type: 'stand' })).outcome,
    'push',
  )
  assert.equal(
    finish(gameReducer(deal('10', '10', '7', '9'), { type: 'stand' })).outcome,
    'lose',
  )
})
test('invalid phase actions and incomplete decks leave state unchanged', () => {
  const initial = initialGame()
  assert.strictEqual(gameReducer(initial, { type: 'hit' }), initial)
  assert.strictEqual(gameReducer(initial, { type: 'deal', deck: [] }), initial)
  const playing = deal('10', '6', '8', '9')
  assert.strictEqual(
    gameReducer(playing, { type: 'deal', deck: deck() }),
    playing,
  )
  assert.strictEqual(gameReducer(playing, { type: 'reset' }), playing)
})
test('rounds preserve scores until an explicit reset', () => {
  const won = deal('A', '6', 'K', '9')
  const next = gameReducer(won, {
    type: 'deal',
    deck: deck('10', '10', '7', '9'),
  })
  const lost = finish(gameReducer(next, { type: 'stand' }))
  assert.equal(lost.rounds, 2)
  assert.equal(lost.wins, 1)
  assert.equal(lost.losses, 1)
  assert.deepEqual(gameReducer(lost, { type: 'reset' }), initialGame())
})
