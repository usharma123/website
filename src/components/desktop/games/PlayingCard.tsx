import { SUIT_NAMES, type Card } from './cards'
import styles from './table.module.css'

export default function PlayingCard({
  card,
  hidden = false,
}: {
  card: Card
  hidden?: boolean
}) {
  if (hidden) return <CardBack />
  const red = card.suit === '♥' || card.suit === '♦'
  return (
    <div
      className={`${styles.card} ${red ? styles.red : ''}`}
      role="img"
      aria-label={`${card.rank} of ${SUIT_NAMES[card.suit]}`}
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

export function CardBack() {
  return (
    <div
      className={`${styles.card} ${styles.cardBack}`}
      role="img"
      aria-label="Face-down card"
    >
      <span aria-hidden="true">✳</span>
    </div>
  )
}
