'use client'

import { useEffect, useReducer, type Dispatch } from 'react'

import {
  DEALER_MAX_CARDS,
  gameReducer,
  handValue,
  initialGame,
  shuffledDeck,
  type Action,
  type Card,
  type Game,
} from '../games/blackjack'
import PlayingCard from '../games/PlayingCard'
import { EmptyCards, GameHeader, Hand, Rules, Status } from '../games/Table'
import styles from '../games/table.module.css'

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
      <GameHeader
        title="Twenty-one."
        score={[
          ['Won', game.wins],
          ['Lost', game.losses],
          ['Drawn', game.rounds - game.wins - game.losses],
        ]}
      />

      <div className={styles.hands}>
        <Hand
          label="Dealer"
          score={
            game.dealer.length
              ? reveal
                ? String(dealerValue.total)
                : `${handValue(game.dealer.slice(0, 1)).total} + ?`
              : '—'
          }
        >
          <Cards cards={game.dealer} hideSecond={!reveal} />
        </Hand>
        <div className={styles.divider}>
          <span>Closest to 21 wins</span>
        </div>
        <Hand
          label="You"
          score={
            game.player.length
              ? `${playerValue.total}${playerValue.soft ? ' soft' : ''}`
              : '—'
          }
        >
          <Cards cards={game.player} />
        </Hand>
      </div>

      <GameControls game={game} dispatch={dispatch} />
    </div>
  )
}

function Cards({
  cards,
  hideSecond = false,
}: {
  cards: Card[]
  hideSecond?: boolean
}) {
  if (!cards.length) return <EmptyCards />
  return cards.map((card, i) => (
    <PlayingCard
      key={`${card.rank}${card.suit}`}
      card={card}
      hidden={hideSecond && i === 1}
    />
  ))
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
      <Status good={won}>{game.message}</Status>
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
      <Rules
        onReset={() => dispatch({ type: 'reset' })}
        canReset={betweenHands && game.rounds > 0}
      >
        <p>
          Get closer to 21 than the dealer without going over. Hit takes a card.
          Stand ends your turn. Aces count as 1 or 11; face cards count as 10.
          Two-card blackjack beats any other 21.
        </p>
        <p>
          The dealer reveals the hidden card after your turn and draws to 17,
          standing on soft 17, and never holds more than {DEALER_MAX_CARDS}{' '}
          cards. Each round uses a fresh 52-card deck. No betting, splits, or
          insurance.
        </p>
      </Rules>
    </div>
  )
}
