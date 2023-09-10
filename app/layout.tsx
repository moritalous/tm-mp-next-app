import './globals.css'

import "@iot-app-kit/components/styles.css"

import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

const font = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AWS IoT TwinMaker x Matterport Integration App',
  description: 'Powered by IoT Application Kit',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${font.className} flex flex-col min-h-screen justify-between`}>
        <main className='flex items-center flex-grow flex-col w-full'>
          {children}
        </main>
      </body>
    </html>
  )
}
