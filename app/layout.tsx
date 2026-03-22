import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import AuthProvider from '@/components/auth/AuthProvider'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'He thong Quan ly KLTN',
  description: 'He thong quan ly khoa luan tot nghiep HCMUTE',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={beVietnamPro.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
