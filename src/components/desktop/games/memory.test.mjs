import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PAIRS, initialMemory, memoryLayout, memoryReducer } from './memory.ts'

function dealt() {
  return memoryReducer(initialMemory(), {
    type: 'deal',
    cards: memoryLayout(() => 0.3),
  })
}
function flip(state, ...indices) {
  for (const index of indices)
    state = memoryReducer(state, { type: 'flip', index })
  return state
}
function pairOf(state, index) {
  return state.cards.findIndex(
    (c, i) => i !== index && c.rank === state.cards[index].rank,
  )
}
function mismatchOf(state, index) {
  return state.cards.findIndex((c) => c.rank !== state.cards[index].rank)
}

test('the layout holds six same-colour pairs of distinct ranks', () => {
  const cards = memoryLayout()
  assert.equal(cards.length, PAIRS * 2)
  assert.equal(new Set(cards.map((c) => c.rank + c.suit)).size, PAIRS * 2)
  const red = (c) => c.suit === '♥' || c.suit === '♦'
  for (const rank of new Set(cards.map((c) => c.rank))) {
    const pair = cards.filter((c) => c.rank === rank)
    assert.equal(pair.length, 2)
    assert.equal(red(pair[0]), red(pair[1]))
  }
})
test('matching two cards keeps them face up and counts one move', () => {
  const start = dealt()
  const state = flip(start, 0, pairOf(start, 0))
  assert.deepEqual(state.open, [])
  assert.equal(state.matched.filter(Boolean).length, 2)
  assert.equal(state.moves, 1)
  assert.strictEqual(flip(state, 0), state)
})
test('a mismatch stays open until hidden or a third card is turned', () => {
  const start = dealt()
  const miss = mismatchOf(start, 0)
  const state = flip(start, 0, miss)
  assert.deepEqual(state.open, [0, miss])
  assert.deepEqual(memoryReducer(state, { type: 'hide' }).open, [])
  const third = [...state.cards.keys()].find((i) => i !== 0 && i !== miss)
  assert.deepEqual(flip(state, third).open, [third])
})
test('turning the same card twice does nothing', () => {
  const state = flip(dealt(), 3)
  assert.strictEqual(flip(state, 3), state)
})
test('clearing the board wins and records the best', () => {
  let state = dealt()
  const seen = new Set()
  for (let i = 0; i < state.cards.length; i++) {
    if (seen.has(i)) continue
    const j = pairOf(state, i)
    seen.add(i).add(j)
    state = flip(state, i, j)
  }
  assert.equal(state.phase, 'won')
  assert.equal(state.moves, PAIRS)
  assert.equal(state.best, PAIRS)
  const again = memoryReducer(state, { type: 'deal', cards: memoryLayout() })
  assert.equal(again.moves, 0)
  assert.equal(again.best, PAIRS)
})
