import type { Metadata } from 'next'
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import './globals.css'
import Nav from '@/components/nav'
import { ViewTransitions } from 'next-view-transitions'
import { ThemeProvider } from '@/components/theme-provider'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800']
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Utsav Sharma',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html suppressHydrationWarning lang="en">
        <body className={`${bricolage.variable} ${dmSans.variable}`} suppressHydrationWarning={true}>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            {/* Animated Grid Background */}
            <div className="animated-grid-bg" />
            {/* Noise Texture Overlay */}
            <div className="noise-overlay" />
            <Nav />
            <div className="text-foreground mx-auto w-[780px] max-w-full px-6 pt-20 pb-12 relative z-10">
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  )
}
