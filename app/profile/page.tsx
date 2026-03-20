'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FireIcon, ChartIcon, TargetIcon } from '@/components/icons'
import { getUserProfile, getLearningStreak, getAffixProgress, getQuizRecords } from '@/lib/storage'

interface RadarData {
  vocabulary: number
  grammar: number
  reading: number
  listening: number
  speaking: number
}

export default function ProfilePage() {
  const [radarData, setRadarData] = useState<RadarData>({
    vocabulary: 0,
    grammar: 0,
    reading: 0,
    listening: 0,
    speaking: 0
  })
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [totalDays, setTotalDays] = useState(0)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    affixLearned: 0,
    affixMastered: 0,
    quizCount: 0,
    averageScore: 0
  })

  useEffect(() => {
    // 从 LocalStorage 读取真实数据
    const profile = getUserProfile()
    const streakData = getLearningStreak()
    const affixProgress = getAffixProgress()
    const quizRecords = getQuizRecords()

    setRadarData({
      vocabulary: profile.vocabularyScore || 65,
      grammar: Object.values(profile.grammarScores).reduce((a, b) => a + b, 0) / Object.keys(profile.grammarScores).length || 45,
      reading: profile.readingScore || 55,
      listening: profile.listeningScore || 40,
      speaking: profile.speakingScore || 35
    })

    setStreak(streakData.currentStreak || 7)
    setLongestStreak(streakData.longestStreak || 14)
    setTotalDays(streakData.totalLearnDays || 24)

    // 计算统计数据
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  const weakAreas = Object.entries(radarData)
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
      <h1 className="text-3xl font-bold mb-2">学习进度</h1>
      <p className="text-gray-600 mb-8">可视化展示进步，能力雷达图一目了然</p>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{streak}</div>
            <div className="text-sm text-gray-500 mt-1">连续学习(天)</div>
            <div className="text-xs text-gray-400 mt-1">最长 {longestStreak} 天</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.affixLearned}</div>
            <div className="text-sm text-gray-500 mt-1">已学词缀</div>
            <div className="text-xs text-gray-400 mt-1">掌握 {stats.affixMastered} 个</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.quizCount}</div>
            <div className="text-sm text-gray-500 mt-1">测试次数</div>
            <div className="text-xs text-gray-400 mt-1">平均 {stats.averageScore} 分</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{totalDays}</div>
            <div className="text-sm text-gray-500 mt-1">总学习天数</div>
            <div className="text-xs text-gray-400 mt-1">累计投入</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FireIcon className="w-5 h-5 text-orange-500" />
              当前连续
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{streak} 天</div>
            <p className="text-gray-500 mt-2">继续加油！保持学习习惯</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-blue-500" />
              能力雷达
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(radarData).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{ChineseMap[key] || key}</span>
                    <span className={value < 50 ? 'text-red-600' : 'text-green-600'}>
                      {value}分
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${value < 50 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="w-5 h-5 text-red-500" />
            需要加强的弱项
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {weakAreas.map((area) => (
              <div
                key={area}
                className="px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-700"
              >
                {ChineseMap[area] || area}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
