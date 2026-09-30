import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  hiLoReducer,
  initialHiLo,
  rankValue,
  shuffledDeck,
} from './higherLower.ts'

// Put specified ranks on top of a complete, unique deck.
function deck(...ranks) {
  const rest = shuffledDeck(() => 0.5)
  const top = ranks.map(
    (rank) =>
      rest.splice(
        rest.findIndex((c) => c.rank === rank),
        1,
      )[0],
  )
  return [...top, ...rest]
}
function play(ranks, ...guesses) {
  let state = hiLoReducer(initialHiLo(), { type: 'deal', deck: deck(...ranks) })
  for (const guess of guesses)
    state = hiLoReducer(state, { type: 'guess', guess })
  return state
}

test('aces rank above kings and twos rank lowest', () => {
  assert.equal(rankValue({ rank: 'A', suit: '♠' }), 14)
  assert.equal(rankValue({ rank: 'K', suit: '♠' }), 13)
  assert.equal(rankValue({ rank: '2', suit: '♠' }), 2)
})
test('dealing turns one card up and leaves 51 in the deck', () => {
  const state = play(['7'])
  assert.equal(state.phase, 'playing')
  assert.equal(state.drawn.length, 1)
  assert.equal(state.deck.length, 51)
})
test('correct calls build the streak and the best', () => {
  const state = play(['5', '9', '3', 'K'], 'higher', 'lower', 'higher')
  assert.equal(state.phase, 'playing')
  assert.equal(state.streak, 3)
  assert.equal(state.best, 3)
})
test('a wrong call ends the game and keeps the best', () => {
  const state = play(['5', '9', '3'], 'higher', 'higher')
  assert.equal(state.phase, 'over')
  assert.equal(state.streak, 1)
  assert.equal(state.best, 1)
  assert.equal(state.games, 1)
  assert.strictEqual(
    hiLoReducer(state, { type: 'guess', guess: 'lower' }),
    state,
  )
})
test('a matching rank neither scores nor ends the run', () => {
  const state = play(['8', '8'], 'lower')
  assert.equal(state.phase, 'playing')
  assert.equal(state.streak, 0)
  assert.equal(state.drawn.length, 2)
})
test('a new deal resets the streak but not the best', () => {
  const over = play(['5', '9', 'Q', '2'], 'higher', 'higher', 'higher')
  const next = hiLoReducer(over, { type: 'deal', deck: deck('4') })
  assert.equal(next.streak, 0)
  assert.equal(next.best, 2)
  assert.strictEqual(hiLoReducer(next, { type: 'reset' }), next)
})
