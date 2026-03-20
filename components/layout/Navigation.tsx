'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  HomeIcon,
  BookIcon,
  BrainIcon,
  ChartIcon,
  SettingsIcon,
  CalendarIcon,
  MicIcon,
  HeartIcon,
  TargetIcon,
  TrophyIcon,
  ZapIcon,
  MenuIcon,
  XIcon,
  EditIcon,
  HeadphonesIcon
} from '@/components/icons'

export default function Navigation() {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)

  const mainNavItems = [
    { href: '/', label: '首页', icon: HomeIcon },
    { href: '/affixes', label: '词缀学习', icon: BookIcon },
    { href: '/reading', label: '外刊精读', icon: BookIcon },
    { href: '/listening', label: '听力训练', icon: HeadphonesIcon },
    { href: '/writing', label: '作文批改', icon: EditIcon },
  ]

  const moreNavItems = [
    { href: '/mistakes', label: '错题本', icon: TargetIcon },
    { href: '/grammar', label: '语法诊断', icon: BrainIcon },
    { href: '/tutor', label: 'AI私教', icon: ZapIcon },
    { href: '/daily', label: '每日一句', icon: CalendarIcon },
    { href: '/diary', label: '语音日记', icon: MicIcon },
    { href: '/couple', label: '给TA鼓励', icon: HeartIcon },
    { href: '/milestones', label: '里程碑', icon: TrophyIcon },
    { href: '/profile', label: '学习进度', icon: ChartIcon },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EnglishMate
            </span>
          </Link>

          {/* Main Nav Links */}
          <div className="flex items-center gap-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline text-sm">{item.label}</span>
                </Link>
              )
            })}

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMore(!showMore)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  showMore ? 'bg-pink-100 text-pink-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {showMore ? <XIcon className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
                <span className="hidden lg:inline text-sm">更多</span>
              </button>

              {showMore && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  {moreNavItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowMore(false)}
                        className={`flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
