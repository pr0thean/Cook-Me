import type { Metadata } from 'next'
import { Rubik, Permanent_Marker, MedievalSharp } from 'next/font/google'
import './globals.css'
import { Header } from '@app/components/layout/header'
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
  title: 'Recipes Website',
  description: 'A personal web project to store and browse my favorite recipes',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          rubik.className,
          permanentMarker.variable,
          medievalSharp.variable,
          'bg-black'
        )}
      >
        <Header />
        <main className="mx-auto mb-4 mt-12 max-w-5xl">{children}</main>
      </body>
    </html>
  )
}
