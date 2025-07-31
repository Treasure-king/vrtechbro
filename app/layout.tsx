// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner' // ✅ import Toaster

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'vrTechBro',
  description: 'Innovative IT solutions for modern businesses.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster /> {/* ✅ Add this line just before </body> */}
      </body>
    </html>
  )
}
