'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AbilityRadar from '@/components/dashboard/AbilityRadar'
import DailyTasks from '@/components/dashboard/DailyTasks'
import LearningHeatmap from '@/components/dashboard/LearningHeatmap'
import LearningPet from '@/components/dashboard/LearningPet'
import { getLearningStreak, getAffixProgress, getQuizRecords } from '@/lib/storage'
import {
  FireIcon,
  CheckCircleIcon,
  BookIcon,
  TrophyIcon,
  RocketIcon,
  CalendarIcon
} from '@/components/icons'

interface AbilityData {
  vocabulary: number
  grammar: number
  reading: number
  listening: number
  speaking: number
}

export default function Dashboard() {
  const [abilityData, setAbilityData] = useState<AbilityData>({
    vocabulary: 65,
    grammar: 45,
    reading: 55,
    listening: 40,
    speaking: 35
  })
  const [streak, setStreak] = useState(7)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    affixLearned: 0,
    affixMastered: 0,
    quizCount: 0,
    averageScore: 0
  })

  const heatmapData = [
    { date: '2026-02-17', count: 20 },
    { date: '2026-02-18', count: 35 },
    { date: '2026-02-19', count: 25 },
    { date: '2026-02-20', count: 45 },
    { date: '2026-02-21', count: 30 },
    { date: '2026-02-22', count: 40 },
    { date: '2026-02-23', count: 50 },
    { date: '2026-02-24', count: 35 },
    { date: '2026-02-25', count: 45 },
    { date: '2026-02-26', count: 30 },
    { date: '2026-02-27', count: 40 },
    { date: '2026-02-28', count: 25 },
    { date: '2026-03-01', count: 35 },
    { date: '2026-03-02', count: 45 },
    { date: '2026-03-03', count: 50 },
    { date: '2026-03-04', count: 30 },
    { date: '2026-03-05', count: 40 },
    { date: '2026-03-06', count: 35 },
    { date: '2026-03-07', count: 45 },
    { date: '2026-03-08', count: 20 },
    { date: '2026-03-09', count: 40 },
    { date: '2026-03-10', count: 50 },
    { date: '2026-03-11', count: 30 },
    { date: '2026-03-12', count: 40 },
    { date: '2026-03-13', count: 50 },
    { date: '2026-03-14', count: 30 },
    { date: '2026-03-15', count: 25 },
    { date: '2026-03-16', count: 45 },
    { date: '2026-03-17', count: 35 },
    { date: '2026-03-18', count: 40 },
    { date: '2026-03-19', count: 30 },
  ]

  useEffect(() => {
    // Load data from LocalStorage
    const streakData = getLearningStreak()
    const affixProgress = getAffixProgress()
    const quizRecords = getQuizRecords()

    setStreak(streakData.currentStreak || 7)

    const affixProgressValues = Object.values(affixProgress)
    const masteredAffixes = affixProgressValues.filter(a => a.status === 'mastered').length
    const learningAffixes = affixProgressValues.filter(a => a.status === 'learning').length

    const averageScore = quizRecords.length > 0
      ? quizRecords.reduce((sum, r) => sum + r.score, 0) / quizRecords.length
      : 78

    setStats({
      affixLearned: learningAffixes + masteredAffixes,
      affixMastered: masteredAffixes,
      quizCount: quizRecords.length || 12,
      averageScore: Math.round(averageScore)
    })

    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  const weakAreas = Object.entries(abilityData)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2)
    .map(([key]) => key)

  const ChineseMap: Record<string, string> = {
    vocabulary: '词汇',
    grammar: '语法',
    reading: '阅读',
    listening: '听力',
    speaking: '口语'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 欢迎区 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          欢迎回来！
        </h1>
        <p className="text-gray-600">
          今天也是充满希望的一天，继续加油 💪
        </p>
      </div>

      {/* 快捷操作区 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link href="/affixes">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 text-center">
              <BookIcon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="font-medium">词缀学习</div>
              <div className="text-xs text-gray-500 mt-1">已学 {stats.affixLearned} 个</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reading">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 text-center">
              <RocketIcon className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="font-medium">外刊精读</div>
              <div className="text-xs text-gray-500 mt-1">提升阅读能力</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/listening">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 text-center">
              <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="font-medium">听力训练</div>
              <div className="text-xs text-gray-500 mt-1">精听+听写</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/writing">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 text-center">
              <TrophyIcon className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="font-medium">作文批改</div>
              <div className="text-xs text-gray-500 mt-1">AI 智能评分</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <FireIcon className="w-6 h-6 mx-auto mb-1 text-orange-500" />
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-xs text-gray-500">连续学习(天)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookIcon className="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <div className="text-2xl font-bold">{stats.affixMastered}</div>
            <div className="text-xs text-gray-500">掌握词缀</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircleIcon className="w-6 h-6 mx-auto mb-1 text-green-500" />
            <div className="text-2xl font-bold">{stats.quizCount}</div>
            <div className="text-xs text-gray-500">完成测试</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrophyIcon className="w-6 h-6 mx-auto mb-1 text-purple-500" />
            <div className="text-2xl font-bold">{stats.averageScore}</div>
            <div className="text-xs text-gray-500">平均分数</div>
          </CardContent>
        </Card>
      </div>

      {/* 主内容区 */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* 左侧：每日任务 + 热力图 */}
        <div className="lg:col-span-1 space-y-6">
          <DailyTasks />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                学习记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LearningHeatmap data={heatmapData} />
            </CardContent>
          </Card>
        </div>

        {/* 中间：能力雷达图 */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RocketIcon className="w-5 h-5 text-purple-500" />
                能力评估
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AbilityRadar data={abilityData} />

              <div className="mt-6">
                <h4 className="font-medium mb-2">需要加强：</h4>
                <div className="flex gap-2 flex-wrap">
                  {weakAreas.map((area) => (
                    <span
                      key={area}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                    >
                      {ChineseMap[area]}
                    </span>
                  ))}
                </div>
              </div>

              <Link href="/grammar">
                <Button className="w-full mt-4" variant="outline">
                  去练习弱项
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：学习宠物 */}
        <div className="lg:col-span-1">
          <LearningPet />
        </div>
      </div>
    </div>
  )
}
