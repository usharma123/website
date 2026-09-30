'use client'

import { APPS, GAMES } from '../apps'
import { useDesktop } from '../context'
import type { Card } from '../games/cards'
import PlayingCard, { CardBack } from '../games/PlayingCard'
import styles from '../games/table.module.css'
import { Toolbar } from '../Window'

type Face = Card | 'back'

const ABOUT: Record<(typeof GAMES)[number], { blurb: string; hand: Face[] }> = {
  blackjack: {
    blurb: 'Closest to 21 without going over. The dealer draws to 17.',
    hand: [
      { rank: 'A', suit: '♠' },
      { rank: 'K', suit: '♥' },
    ],
  },
  higherLower: {
    blurb: 'Call the next card off the deck. See how long a streak lasts.',
    hand: [{ rank: '7', suit: '♦' }, 'back'],
  },
  memory: {
    blurb: 'Six pairs face down. Clear the board in as few moves as you can.',
    hand: ['back', { rank: 'Q', suit: '♣' }, 'back'],
  },
}

export default function Games() {
  const { open } = useDesktop()
  return (
    <div>
      <Toolbar>
        <span className="text-muted mr-auto font-mono text-[12px]">
          ~/games
        </span>
        <span className="text-muted font-mono text-[12px]">
          {GAMES.length} items
        </span>
      </Toolbar>
      <div className="grid gap-3 p-4 sm:grid-cols-3">
        {GAMES.map((id) => (
          <GameTile key={id} id={id} onOpen={() => open(id)} />
        ))}
      </div>
    </div>
  )
}

function GameTile({
  id,
  onOpen,
}: {
  id: (typeof GAMES)[number]
  onOpen: () => void
}) {
  const { blurb, hand } = ABOUT[id]
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group border-ink bg-paper flex flex-col overflow-hidden rounded-md border-[1.5px] text-left"
    >
      <div className={styles.preview} aria-hidden="true">
        {hand.map((face, i) =>
          face === 'back' ? (
            <CardBack key={i} />
          ) : (
            <PlayingCard key={i} card={face} />
          ),
        )}
      </div>
      <div className="border-ink border-t-[1.5px] p-3">
        <span className="font-semibold group-hover:underline">
          {APPS[id].title}
        </span>
        <p className="text-muted mt-1 text-[13.5px] leading-snug">{blurb}</p>
      </div>
    </button>
  )
}
