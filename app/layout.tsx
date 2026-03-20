import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import NotificationSystem from '@/components/dashboard/NotificationSystem'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EnglishMate - AI 驱动的个性化英语私教',
  description: '2000 公里外的温暖陪伴 - 个性化英语学习助手',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ServiceWorkerRegistration />
        <Navigation />
        <NotificationSystem />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
