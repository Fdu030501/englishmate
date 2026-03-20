'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { TrophyIcon, TargetIcon, ZapIcon, HeartIcon, SproutIcon, FireIcon, SearchIcon, DocumentIcon, MessageIcon, BookIcon, CrownIcon, GraduationIcon, PresentIcon } from '@/components/icons'

interface Milestone {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  completed: boolean
  completedAt?: Date
  reward: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const iconMap: Record<string, React.ComponentType<{className?: string}>> = {
  'sprout': SproutIcon,
  'fire': FireIcon,
  'search': SearchIcon,
  'document': DocumentIcon,
  'message': MessageIcon,
  'book': BookIcon,
  'crown': CrownIcon,
  'graduation': GraduationIcon,
}

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: '初出茅庐',
      description: '连续学习3天',
      target: 3,
      current: 3,
      unit: '天',
      completed: true,
      completedAt: new Date(Date.now() - 86400000 * 4),
      reward: '解锁：初级徽章'
    },
    {
      id: '2',
      title: '持之以恒',
      description: '连续学习7天',
      target: 7,
      current: 7,
      unit: '天',
      completed: true,
      completedAt: new Date(),
      reward: '解锁：学习宠物升级'
    },
    {
      id: '3',
      title: '词汇达人',
      description: '掌握50个词缀',
      target: 50,
      current: 26,
      unit: '个',
      completed: false,
      reward: '解锁：高级词缀库'
    },
    {
      id: '4',
      title: '语法突破',
      description: '语法测试平均达到80分',
      target: 80,
      current: 65,
      unit: '分',
      completed: false,
      reward: '解锁：AI私教深度辅导'
    },
    {
      id: '5',
      title: '千里之行',
      description: '连续学习30天',
      target: 30,
      current: 7,
      unit: '天',
      completed: false,
      reward: '解锁：专属学习报告'
    },
    {
      id: '6',
      title: '考研战士',
      description: '累计学习100小时',
      target: 100,
      current: 35,
      unit: '小时',
      completed: false,
      reward: '解锁：考前冲刺模式'
    }
  ])

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: '初识英语',
      description: '完成首次测试',
      icon: 'sprout',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 86400000 * 7),
      rarity: 'common'
    },
    {
      id: '2',
      title: '坚持不懈',
      description: '连续学习7天',
      icon: 'fire',
      unlocked: true,
      unlockedAt: new Date(),
      rarity: 'common'
    },
    {
      id: '3',
      title: '词缀探索者',
      description: '掌握10个词缀',
      icon: 'search',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 86400000 * 2),
      rarity: 'common'
    },
    {
      id: '4',
      title: '语法学徒',
      description: '语法测试首次达到60分',
      icon: 'document',
      unlocked: true,
      rarity: 'rare'
    },
    {
      id: '5',
      title: '爱的鼓励',
      description: '收到第一张加油卡',
      icon: 'message',
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: '6',
      title: '词汇大师',
      description: '掌握50个词缀',
      icon: 'book',
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: '7',
      title: '完美连续',
      description: '连续学习30天',
      icon: 'crown',
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: '8',
      title: '考研达人',
      description: '累计学习100小时并通过模拟考',
      icon: 'graduation',
      unlocked: false,
      rarity: 'legendary'
    }
  ])

  const completedMilestones = milestones.filter(m => m.completed)
  const completedAchievements = achievements.filter(a => a.unlocked)

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    }
  }

  const getRarityLabel = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return '普通'
      case 'rare': return '稀有'
      case 'epic': return '史诗'
      case 'legendary': return '传说'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">学习里程碑</h1>
        <p className="text-gray-600">
          每一步进步，都值得被记录
        </p>
      </div>

      {/* 总进度 */}
      <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">考研征程</h2>
              <p className="text-blue-100">
                已完成 {completedMilestones.length}/{milestones.length} 个里程碑
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {Math.round((completedMilestones.length / milestones.length) * 100)}%
              </div>
              <div className="text-sm text-blue-100">总进度</div>
            </div>
          </div>
          <Progress
            value={(completedMilestones.length / milestones.length) * 100}
            className="mt-4 h-3 bg-white/20 [&>div]:bg-white"
          />
        </CardContent>
      </Card>

      {/* 里程碑列表 */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TargetIcon className="w-5 h-5" />
          当前目标
        </h2>
        {milestones.map((milestone) => (
          <Card
            key={milestone.id}
            className={`border-2 ${
              milestone.completed
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200'
            }`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{milestone.title}</h3>
                    {milestone.completed && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        已完成
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {milestone.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">
                          {milestone.current}/{milestone.target} {milestone.unit}
                        </span>
                        <span className="text-gray-500">
                          {Math.round((milestone.current / milestone.target) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(milestone.current / milestone.target) * 100}
                        className={`h-2 ${
                          milestone.completed ? '[&>div]:bg-green-500' : ''
                        }`}
                      />
                    </div>
                  </div>
                  {milestone.completed && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <PresentIcon className="w-4 h-4" />
                      {milestone.reward}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  {milestone.completed ? (
                    <TrophyIcon className="w-8 h-8 text-yellow-500" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <ZapIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 成就展示 */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <TrophyIcon className="w-5 h-5" />
          成就徽章
          <span className="text-sm text-gray-400">
            ({completedAchievements.length}/{achievements.length})
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`${
                achievement.unlocked
                  ? getRarityColor(achievement.rarity)
                  : 'bg-gray-100 opacity-50'
              } border-2 cursor-pointer hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-4 text-center">
                <div className="mb-2 flex justify-center">
                  {(() => {
                    const IconComponent = iconMap[achievement.icon]
                    return IconComponent ? <IconComponent className="w-10 h-10" /> : null
                  })()}
                </div>
                <h4 className="font-medium text-sm mb-1">{achievement.title}</h4>
                <p className="text-xs opacity-75 line-clamp-2">
                  {achievement.description}
                </p>
                {achievement.unlocked ? (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-white/50 rounded text-xs">
                    {getRarityLabel(achievement.rarity)}
                  </span>
                ) : (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-gray-200 rounded text-xs text-gray-500">
                    未解锁
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 温馨鼓励 */}
      <Card className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-100">
        <CardContent className="p-6 text-center">
          <HeartIcon className="w-8 h-8 text-pink-500 mx-auto mb-3" />
          <p className="text-gray-700">
            每一步都是进步，坚持下去，你一定能考上理想的学校！<br/>
            <span className="text-sm text-gray-500">
              男朋友在 2000 公里外为你加油
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
