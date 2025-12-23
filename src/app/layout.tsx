import type { Metadata } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
import './globals.css'
import Nav from '@/components/nav'
import { ViewTransitions } from 'next-view-transitions'
import { ThemeProvider } from '@/components/theme-provider'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '700']
})

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600']
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
        <body className={`${spaceGrotesk.variable} ${dmSans.variable}`} suppressHydrationWarning={true}>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            {/* Animated Grid Background */}
            <div className="animated-grid-bg" />
            <Nav />
            <div className="text-foreground mx-auto w-[750px] max-w-full px-5 pt-16 pb-10 relative z-10">
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  )
}
