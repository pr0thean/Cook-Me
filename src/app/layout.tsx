import type { Metadata } from 'next'
import { Rubik, Permanent_Marker, MedievalSharp } from 'next/font/google'
import './globals.css'
import { Header } from '@components/layout/header'
import clsx from 'clsx'

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rubik',
})
const permanentMarker = Permanent_Marker({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-permanent-marker',
})
const medievalSharp = MedievalSharp({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-medival-sharp',
})

export const metadata: Metadata = {
  title: 'Cook Me',
  description: 'A personal web project to store and browse my favorite recipes',
  icons: {
    icon: [
      { url: '/assets/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favicon/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/assets/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'android-chrome-192x192', url: '/assets/favicon/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/assets/favicon/android-chrome-512x512.png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={clsx(
        rubik.className,
        permanentMarker.variable,
        medievalSharp.variable,
        'bg-black'
      )}
    >
      <body>
        <Header />

        <main className="mx-auto mt-16 max-w-4xl pb-8">{children}</main>
      </body>
    </html>
  )
}
