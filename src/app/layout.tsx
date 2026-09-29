import type { Metadata } from 'next'
import { IBM_Plex_Mono, Instrument_Sans } from 'next/font/google'

import Desktop from '@/components/desktop/Desktop'
import { PROFILE } from '@/data/resume'
import { getPosts } from '@/lib/posts'
import './globals.css'

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
})
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  title: { default: PROFILE.name, template: `%s — ${PROFILE.name}` },
  description: PROFILE.headline,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Desktop posts={getPosts()}>{children}</Desktop>
      </body>
    </html>
  )
}
