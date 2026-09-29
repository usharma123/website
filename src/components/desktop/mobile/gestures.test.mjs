import assert from 'node:assert/strict'
import test from 'node:test'
import { dismissGesture, navigationGesture } from './gestures.ts'

test('quick upward navigation returns home', () => {
  assert.equal(navigationGesture(8, -100, 180), 'home')
})
test('upward navigation held for 400ms opens recent apps', () => {
  assert.equal(navigationGesture(-12, -90, 400), 'recents')
})
test('taps, downward and mostly horizontal gestures do not navigate', () => {
  for (const [dx, dy] of [
    [0, 0],
    [0, -44],
    [0, 100],
    [100, -65],
  ]) {
    assert.equal(navigationGesture(dx, dy, 600), null)
  }
})
test('recent apps dismiss only after a deliberate upward swipe', () => {
  assert.equal(dismissGesture(10, -110), true)
  for (const [dx, dy] of [
    [0, -60],
    [0, 100],
    [100, -80],
    [0, 0],
  ]) {
    assert.equal(dismissGesture(dx, dy), false)
  }
})
