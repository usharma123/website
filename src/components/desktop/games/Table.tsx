import type { ReactNode } from 'react'

import styles from './table.module.css'

/* ---- Pieces every game window shares -------------------------------------- */

export function GameHeader({
  title,
  score,
}: {
  title: string
  score: [label: string, value: ReactNode][]
}) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>A small diversion</p>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <dl className={styles.score} aria-label="Session score">
        {score.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  )
}

export function Status({
  good,
  children,
}: {
  good: boolean
  children: ReactNode
}) {
  return (
    <div
      className={`${styles.status} ${good ? styles.winning : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className={styles.statusDot} aria-hidden="true" />
      {children}
    </div>
  )
}

export function Rules({
  children,
  onReset,
  canReset,
}: {
  children: ReactNode
  onReset: () => void
  canReset: boolean
}) {
  return (
    <footer className={styles.footer}>
      <details className={styles.rules}>
        <summary>How to play</summary>
        {children}
      </details>
      <button
        type="button"
        className={styles.reset}
        onClick={onReset}
        disabled={!canReset}
      >
        Reset score
      </button>
    </footer>
  )
}

export function Hand({
  label,
  score,
  children,
}: {
  label: string
  score: string
  children: ReactNode
}) {
  return (
    <section className={styles.hand} aria-label={`${label} hand`}>
      <div className={styles.handLabel}>
        {label}
        <span aria-label={`${label}: ${score}`}>{score}</span>
      </div>
      <div className={styles.cards}>{children}</div>
    </section>
  )
}

export function EmptyCards({ count = 2 }: { count?: number }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className={styles.emptyCard} aria-hidden="true" />
  ))
}
