import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const anonymicePro = localFont({
  src: './fonts/ANONYMICEPRONERDFONTPROPO-REGULAR.ttf',
  variable: '--font-anonymice',
})

export const metadata: Metadata = {
  title: '.log(_) — Documente seu processo',
  description: 'Rede social para desenvolvedores documentarem seus processos, erros e aprendizados. Porque todo bug tem uma historia.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a2e2a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark"> 
      <body className={`${anonymicePro.className} font-mono antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}
