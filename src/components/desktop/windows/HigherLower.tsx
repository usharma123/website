'use client'

import { useReducer } from 'react'

import { hiLoReducer, initialHiLo, shuffledDeck } from '../games/higherLower'
import PlayingCard, { CardBack } from '../games/PlayingCard'
import { EmptyCards, GameHeader, Hand, Rules, Status } from '../games/Table'
import styles from '../games/table.module.css'

/** How much of the run stays on the table. */
const TRAIL = 5

export default function HigherLower() {
  const [game, dispatch] = useReducer(hiLoReducer, undefined, initialHiLo)
  const playing = game.phase === 'playing'
  const trail = game.drawn.slice(-TRAIL)

  return (
    <div className={styles.game}>
      <GameHeader
        title="Higher or lower."
        score={[
          ['Streak', game.streak],
          ['Best', game.best],
          ['Played', game.games],
        ]}
      />

      <div className={styles.hands}>
        <Hand
          label="Deck"
          score={game.drawn.length ? `${game.deck.length} left` : '—'}
        >
          {game.deck.length ? <CardBack /> : <EmptyCards count={1} />}
        </Hand>
        <div className={styles.divider}>
          <span>Aces high</span>
        </div>
        <Hand
          label="Run"
          score={game.drawn.length ? `${game.drawn.length} turned` : '—'}
        >
          {trail.length ? (
            trail.map((card, i) => (
              <div
                key={`${card.rank}${card.suit}`}
                className={i < trail.length - 1 ? styles.faded : undefined}
              >
                <PlayingCard card={card} />
              </div>
            ))
          ) : (
            <EmptyCards count={1} />
          )}
        </Hand>
      </div>

      <div className={styles.controls}>
        <Status good={playing && game.streak > 0}>{game.message}</Status>
        <div className={styles.actions}>
          {playing ? (
            <>
              <button
                type="button"
                className={styles.primary}
                onClick={() => dispatch({ type: 'guess', guess: 'higher' })}
              >
                Higher <span aria-hidden="true">↑</span>
              </button>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => dispatch({ type: 'guess', guess: 'lower' })}
              >
                Lower <span aria-hidden="true">↓</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.primary}
              onClick={() => dispatch({ type: 'deal', deck: shuffledDeck() })}
            >
              {game.phase === 'ready' ? 'Turn a card' : 'Play again'}{' '}
              <span aria-hidden="true">↗</span>
            </button>
          )}
          <span className={styles.handNumber}>
            {game.games === 0 && !playing
              ? 'No stakes. Just a game.'
              : `Game ${String(game.games + (playing ? 1 : 0)).padStart(2, '0')}`}
          </span>
        </div>
        <Rules
          onReset={() => dispatch({ type: 'reset' })}
          canReset={!playing && game.games > 0}
        >
          <p>
            One card is face up. Call whether the next card off the deck will
            rank higher or lower. Each right call adds to your streak; one wrong
            call ends the run.
          </p>
          <p>
            Aces are high and suits don’t matter. A card of the same rank is a
            free pass: it neither scores nor ends the run. Each game uses a
            fresh 52-card deck.
          </p>
        </Rules>
      </div>
    </div>
  )
}
