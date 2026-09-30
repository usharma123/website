'use client'

import { useEffect, useReducer } from 'react'

import { SUIT_NAMES } from '../games/cards'
import {
  PAIRS,
  initialMemory,
  memoryLayout,
  memoryReducer,
} from '../games/memory'
import PlayingCard, { CardBack } from '../games/PlayingCard'
import { GameHeader, Rules, Status } from '../games/Table'
import styles from '../games/table.module.css'

export default function Memory() {
  const [game, dispatch] = useReducer(memoryReducer, undefined, initialMemory)
  const playing = game.phase === 'playing'
  const pairs = game.matched.filter(Boolean).length / 2
  const missed = game.open.length === 2

  // Leave a miss on the table long enough to remember it.
  useEffect(() => {
    if (!missed) return
    const timer = setTimeout(() => dispatch({ type: 'hide' }), 900)
    return () => clearTimeout(timer)
  }, [missed, game.open])

  return (
    <div className={styles.game}>
      <GameHeader
        title="Pairs."
        score={[
          ['Moves', game.moves],
          ['Found', `${pairs}/${PAIRS}`],
          ['Best', game.best ?? '—'],
        ]}
      />

      <div className={styles.hands}>
        <div className={styles.board} role="group" aria-label="Board">
          {game.cards.length
            ? game.cards.map((card, i) => {
                const up = game.matched[i] || game.open.includes(i)
                return (
                  <button
                    key={`${card.rank}${card.suit}`}
                    type="button"
                    className={`${styles.tile} ${game.matched[i] && playing ? styles.faded : ''}`}
                    aria-disabled={!playing || up}
                    onClick={() => dispatch({ type: 'flip', index: i })}
                    aria-label={
                      up
                        ? `${card.rank} of ${SUIT_NAMES[card.suit]}${game.matched[i] ? ', matched' : ''}`
                        : `Card ${i + 1}, face down`
                    }
                  >
                    <span aria-hidden="true">
                      {up ? <PlayingCard card={card} /> : <CardBack />}
                    </span>
                  </button>
                )
              })
            : Array.from({ length: PAIRS * 2 }, (_, i) => (
                <div key={i} className={styles.emptyCard} aria-hidden="true" />
              ))}
        </div>
      </div>

      <div className={styles.controls}>
        <Status good={game.phase === 'won'}>{game.message}</Status>
        <div className={styles.actions}>
          {playing ? null : (
            <button
              type="button"
              className={styles.primary}
              onClick={() => dispatch({ type: 'deal', cards: memoryLayout() })}
            >
              {game.phase === 'ready' ? 'Lay out the cards' : 'Play again'}{' '}
              <span aria-hidden="true">↗</span>
            </button>
          )}
          <span className={styles.handNumber}>
            {playing ? `Perfect is ${PAIRS} moves` : 'No stakes. Just a game.'}
          </span>
        </div>
        <Rules
          onReset={() => dispatch({ type: 'reset' })}
          canReset={!playing && game.best !== null}
        >
          <p>
            Twelve cards lie face down: six ranks, each twice in the same
            colour. Turn two at a time. A matching pair stays up; anything else
            turns back over.
          </p>
          <p>
            Every two cards turned is one move. Clear the board in as few moves
            as you can.
          </p>
        </Rules>
      </div>
    </div>
  )
}
