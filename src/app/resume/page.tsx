import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Résumé',
  description: 'Work, research, and education.',
}

// The desktop renders this window from the pathname; the page only sets metadata.
export default function Page() {
  return null
}
