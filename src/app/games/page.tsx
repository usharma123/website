import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Games',
  description: 'Blackjack, Higher or Lower, and Pairs.',
}

// The desktop renders this window from the pathname; the page only sets metadata.
export default function Page() {
  return null
}
