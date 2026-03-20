'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { HeartIcon, GiftIcon, MessageIcon, ZapIcon } from '@/components/icons'
import { useToast } from '@/components/toast'

interface SupportCard {
  id: string
  type: 'encouragement' | 'hint' | 'double_points' | 'custom'
  title: string
  message: string
  from: string
  createdAt: Date
  used: boolean
}

export default function CoupleSupportPage() {
  const [cards, setCards] = useState<SupportCard[]>([
    {
      id: '1',
      type: 'encouragement',
      title: '加油卡',
      message: '亲爱的，今天也要加油哦！我相信你一定能行的！',
      from: '男朋友',
      createdAt: new Date(),
      used: false
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [selectedType, setSelectedType] = useState<SupportCard['type']>('encouragement')
  const { success } = useToast()

  const sendCard = () => {
    if (!newMessage.trim()) return

    const card: SupportCard = {
      id: Date.now().toString(),
      type: selectedType,
      title: getTypeLabel(selectedType),
      message: newMessage,
      from: '男朋友',
      createdAt: new Date(),
      used: false
    }

    setCards([card, ...cards])
    setNewMessage('')
    success('加油卡已发送！她会收到的')
  }

  const getTypeLabel = (type: SupportCard['type']) => {
    switch (type) {
      case 'encouragement': return '鼓励卡'
      case 'hint': return '提示卡'
      case 'double_points': return '双倍积分卡'
      case 'custom': return '专属卡片'
    }
  }

  const getTypeIcon = (type: SupportCard['type']) => {
    switch (type) {
      case 'encouragement': return <HeartIcon className="w-5 h-5 text-pink-500" />
      case 'hint': return <ZapIcon className="w-5 h-5 text-yellow-500" />
      case 'double_points': return <GiftIcon className="w-5 h-5 text-purple-500" />
      case 'custom': return <MessageIcon className="w-5 h-5 text-blue-500" />
    }
  }

  const getTypeColor = (type: SupportCard['type']) => {
    switch (type) {
      case 'encouragement': return 'bg-pink-50 border-pink-200'
      case 'hint': return 'bg-yellow-50 border-yellow-200'
      case 'double_points': return 'bg-purple-50 border-purple-200'
      case 'custom': return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">给TA的鼓励</h1>
        <p className="text-gray-600">
          距离虽远，但爱一直在身边
        </p>
      </div>

      {/* 发送区域 */}
      <Card className="mb-8 border-2 border-pink-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartIcon className="w-5 h-5 text-pink-500" />
            发送加油卡
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {(['encouragement', 'hint', 'double_points', 'custom'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                  selectedType === type
                    ? 'border-pink-400 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-pink-200'
                }`}
              >
                {getTypeIcon(type)}
                <span className="text-sm">{getTypeLabel(type)}</span>
              </button>
            ))}
          </div>

          <Textarea
            placeholder="写下你想对她说的话..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[100px]"
          />

          <Button
            onClick={sendCard}
            disabled={!newMessage.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            <HeartIcon className="w-4 h-4 mr-2" />
            发送给她
          </Button>
        </CardContent>
      </Card>

      {/* 已发送的卡片 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">已发送的鼓励</h2>
        {cards.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            还没有发送过加油卡，快去给她一个惊喜吧！
          </div>
        ) : (
          cards.map((card) => (
            <Card
              key={card.id}
              className={`${getTypeColor(card.type)} border-2 ${
                card.used ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    {getTypeIcon(card.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{card.title}</span>
                      {card.used && (
                        <span className="text-xs text-gray-400">已使用</span>
                      )}
                    </div>
                    <p className="text-gray-700 italic">"{card.message}"</p>
                    <p className="text-xs text-gray-400 mt-2">
                      发送于 {card.createdAt.toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 温馨提示 */}
      <Card className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-100">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">
            每张加油卡都会成为她学习时的动力<br/>
            小小的鼓励，能让 2000 公里的距离瞬间缩短
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
