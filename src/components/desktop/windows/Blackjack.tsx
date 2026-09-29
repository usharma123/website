'use client'

import { useEffect, useReducer, type Dispatch } from 'react'

import {
  gameReducer,
  handValue,
  initialGame,
  shuffledDeck,
  type Card,
  type Game,
  type Action,
} from '../blackjack/game'
import styles from '../blackjack/blackjack.module.css'

const SUITS = { '♠': 'spades', '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs' }

export default function Blackjack() {
  const [game, dispatch] = useReducer(gameReducer, undefined, initialGame)
  const dealing = game.phase === 'dealer'
  const reveal = dealing || game.phase === 'settled'

  // One dealer card per beat. Closing the window cancels the next draw.
  useEffect(() => {
    if (!dealing) return
    const timer = setTimeout(() => dispatch({ type: 'dealer' }), 500)
    return () => clearTimeout(timer)
  }, [dealing, game.dealer.length])

  const playerValue = handValue(game.player)
  const dealerValue = handValue(game.dealer)

  return (
    <div className={styles.game}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>A small diversion</p>
          <h1 className={styles.title}>Twenty-one.</h1>
        </div>
        <dl className={styles.score} aria-label="Session score">
          <div>
            <dt>Won</dt>
            <dd>{game.wins}</dd>
          </div>
          <div>
            <dt>Lost</dt>
            <dd>{game.losses}</dd>
          </div>
          <div>
            <dt>Drawn</dt>
            <dd>{game.rounds - game.wins - game.losses}</dd>
          </div>
        </dl>
      </header>

      <div className={styles.hands}>
        <Hand
          label="Dealer"
          cards={game.dealer}
          hidden={!reveal}
          score={
            game.dealer.length
              ? reveal
                ? String(dealerValue.total)
                : `${handValue(game.dealer.slice(0, 1)).total} + ?`
              : '—'
          }
        />
        <div className={styles.divider}>
          <span>Closest to 21 wins</span>
        </div>
        <Hand
          label="You"
          cards={game.player}
          score={
            game.player.length
              ? `${playerValue.total}${playerValue.soft ? ' soft' : ''}`
              : '—'
          }
        />
      </div>

      <GameControls game={game} dispatch={dispatch} />
    </div>
  )
}

function GameControls({
  game,
  dispatch,
}: {
  game: Game
  dispatch: Dispatch<Action>
}) {
  const playing = game.phase === 'player'
  const betweenHands = game.phase === 'ready' || game.phase === 'settled'
  const won = game.outcome === 'win' || game.outcome === 'blackjack'
  return (
    <div className={styles.controls}>
      <div
        className={`${styles.status} ${won ? styles.winning : ''}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className={styles.statusDot} aria-hidden="true" />
        {game.message}
      </div>
      <div className={styles.actions}>
        {betweenHands ? (
          <button
            type="button"
            className={styles.primary}
            onClick={() => dispatch({ type: 'deal', deck: shuffledDeck() })}
          >
            {game.phase === 'ready' ? 'Deal a hand' : 'Play again'}{' '}
            <span aria-hidden="true">↗</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              className={styles.primary}
              disabled={!playing}
              onClick={() => dispatch({ type: 'hit' })}
            >
              Hit <span aria-hidden="true">＋</span>
            </button>
            <button
              type="button"
              className={styles.secondary}
              disabled={!playing}
              onClick={() => dispatch({ type: 'stand' })}
            >
              Stand
            </button>
          </>
        )}
        <span className={styles.handNumber}>
          {game.rounds === 0 && game.phase === 'ready'
            ? 'No stakes. Just a game.'
            : `Hand ${String(game.rounds + (betweenHands ? 0 : 1)).padStart(2, '0')}`}
        </span>
      </div>
      <footer className={styles.footer}>
        <details className={styles.rules}>
          <summary>How to play</summary>
          <p>
            Get closer to 21 than the dealer without going over. Hit takes a
            card. Stand ends your turn. Aces count as 1 or 11; face cards count
            as 10. Two-card blackjack beats any other 21.
          </p>
          <p>
            The dealer reveals the hidden card after your turn and draws to 17,
            standing on soft 17. Each round uses a fresh 52-card deck. No
            betting, splits, or insurance.
          </p>
        </details>
        <button
          type="button"
          className={styles.reset}
          onClick={() => dispatch({ type: 'reset' })}
          disabled={!betweenHands || game.rounds === 0}
        >
          Reset score
        </button>
      </footer>
    </div>
  )
}

function Hand({
  label,
  cards,
  score,
  hidden = false,
}: {
  label: string
  cards: Card[]
  score: string
  hidden?: boolean
}) {
  return (
    <section className={styles.hand} aria-label={`${label} hand`}>
      <div className={styles.handLabel}>
        {label}
        <span aria-label={`${label} total: ${score}`}>{score}</span>
      </div>
      <div className={styles.cards}>
        {cards.length ? (
          cards.map((card, i) => (
            <PlayingCard
              key={`${card.rank}${card.suit}`}
              card={card}
              hidden={hidden && i === 1}
            />
          ))
        ) : (
          <>
            <div className={styles.emptyCard} aria-hidden="true" />
            <div className={styles.emptyCard} aria-hidden="true" />
          </>
        )}
      </div>
    </section>
  )
}

function PlayingCard({ card, hidden }: { card: Card; hidden: boolean }) {
  if (hidden)
    return (
      <div
        className={`${styles.card} ${styles.cardBack}`}
        role="img"
        aria-label="Face-down card"
      >
        <span aria-hidden="true">✳</span>
      </div>
    )
  const red = card.suit === '♥' || card.suit === '♦'
  return (
    <div
      className={`${styles.card} ${red ? styles.red : ''}`}
      role="img"
      aria-label={`${card.rank} of ${SUITS[card.suit]}`}
    >
      <span className={styles.corner} aria-hidden="true">
        {card.rank}
        <small>{card.suit}</small>
      </span>
      <span className={styles.pip} aria-hidden="true">
        {card.suit}
      </span>
      <span
        className={`${styles.corner} ${styles.bottomCorner}`}
        aria-hidden="true"
      >
        {card.rank}
        <small>{card.suit}</small>
      </span>
    </div>
  )
}
