'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BrainIcon, TargetIcon, ZapIcon, MessageIcon } from '@/components/icons'
import { useToast } from '@/components/toast'

interface StudyAdvice {
  id: string
  category: 'grammar' | 'vocabulary' | 'strategy' | 'encouragement'
  title: string
  content: string
  action?: string
  priority: 'high' | 'medium' | 'low'
}

interface WeakArea {
  area: string
  score: number
  suggestions: string[]
}

export default function SmartTutorPage() {
  const [advice, setAdvice] = useState<StudyAdvice[]>([])
  const [loading, setLoading] = useState(true)
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([])
  const { success } = useToast()

  useEffect(() => {
    // 模拟AI分析她的学习数据
    generatePersonalizedAdvice()
  }, [])

  const generatePersonalizedAdvice = async () => {
    setLoading(true)

    // 模拟AI分析延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 基于常见薄弱点生成建议
    const personalizedAdvice: StudyAdvice[] = [
      {
        id: '1',
        category: 'grammar',
        title: '情态动词使用技巧',
        content: '根据你的练习记录，情态动词是目前的薄弱点。记住这个口诀：can/could表能力，must/have to表必须，should表建议。试试今天重点练习这3个！',
        action: '开始练习',
        priority: 'high'
      },
      {
        id: '2',
        category: 'vocabulary',
        title: 'un-前缀单词记忆法',
        content: '你最近学了un-前缀，试试这个方法：想象"un-"是一把"翻转钥匙"，happy变成unhappy就是"翻转"了心情。',
        action: '查看词缀',
        priority: 'medium'
      },
      {
        id: '3',
        category: 'strategy',
        title: '碎片化学习建议',
        content: '你每天只有30分钟，建议这样分配：10分钟复习+10分钟新内容+10分钟测试。短时高频比一次学很久更有效！',
        priority: 'medium'
      },
      {
        id: '4',
        category: 'encouragement',
        title: '专属鼓励',
        content: '连续学习7天了！你知道吗？坚持21天就能养成习惯，你已经完成1/3啦！男朋友肯定为你骄傲',
        priority: 'low'
      }
    ]

    const areas: WeakArea[] = [
      { area: '情态动词', score: 45, suggestions: ['每天练习10道', '制作记忆卡片', '看微课视频'] },
      { area: '时态', score: 60, suggestions: ['时间轴记忆法', '造句练习', '对比学习'] },
      { area: '词汇', score: 65, suggestions: ['词根词缀法', '场景记忆', '每日复习'] }
    ]

    setAdvice(personalizedAdvice)
    setWeakAreas(areas)
    setLoading(false)
  }

  const getCategoryIcon = (category: StudyAdvice['category']) => {
    switch (category) {
      case 'grammar': return <BrainIcon className="w-5 h-5 text-blue-500" />
      case 'vocabulary': return <ZapIcon className="w-5 h-5 text-yellow-500" />
      case 'strategy': return <TargetIcon className="w-5 h-5 text-green-500" />
      case 'encouragement': return <MessageIcon className="w-5 h-5 text-pink-500" />
    }
  }

  const getCategoryColor = (category: StudyAdvice['category']) => {
    switch (category) {
      case 'grammar': return 'bg-blue-50 border-blue-200'
      case 'vocabulary': return 'bg-yellow-50 border-yellow-200'
      case 'strategy': return 'bg-green-50 border-green-200'
      case 'encouragement': return 'bg-pink-50 border-pink-200'
    }
  }

  const getPriorityBadge = (priority: StudyAdvice['priority']) => {
    switch (priority) {
      case 'high': return <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">优先</span>
      case 'medium': return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">建议</span>
      case 'low': return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">提示</span>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">AI导师正在分析你的学习数据...</p>
          <p className="text-sm text-gray-400 mt-2">请稍候，专属建议即将生成</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">AI私教</h1>
        <p className="text-gray-600">
          专属学习建议，让每一分努力都有回报
        </p>
      </div>

      {/* 弱项分析 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="w-5 h-5 text-red-500" />
            需要加强的知识点
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weakAreas.map((area, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{area.area}</span>
                    <span className="text-red-600 font-bold">{area.score}分</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                      style={{ width: `${area.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 个性化建议 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">今日专属建议</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={generatePersonalizedAdvice}
          >
            刷新建议
          </Button>
        </div>

        {advice.map((item) => (
          <Card
            key={item.id}
            className={`${getCategoryColor(item.category)} border-2 hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    {getPriorityBadge(item.priority)}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {item.content}
                  </p>
                  {item.action && (
                    <Button
                      size="sm"
                      className="bg-white hover:bg-gray-50"
                      onClick={() => success('已记录你的学习意向！')}
                    >
                      {item.action}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 学习统计 */}
      <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">本周学习统计</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-sm text-gray-600">连续天数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">210</div>
              <div className="text-sm text-gray-600">学习分钟</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">15</div>
              <div className="text-sm text-gray-600">掌握词缀</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
