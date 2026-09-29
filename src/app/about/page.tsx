import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: "Who I am and what I'm working on.",
}

// The desktop renders this window from the pathname; the page only sets metadata.
export default function Page() {
  return null
}
