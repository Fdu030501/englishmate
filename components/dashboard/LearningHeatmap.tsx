'use client'

import { useMemo } from 'react'

interface HeatmapData {
  date: string
  count: number // 学习时长（分钟）
}

interface LearningHeatmapProps {
  data: HeatmapData[]
}

export default function LearningHeatmap({ data }: LearningHeatmapProps) {
  // 生成最近 12 周的数据
  const weeks = useMemo(() => {
    const result = []
    const today = new Date()
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - i * 7)
      result.push(weekStart)
    }
    return result
  }, [])

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-gray-100'
    if (count < 15) return 'bg-green-200'
    if (count < 30) return 'bg-green-300'
    if (count < 45) return 'bg-green-400'
    return 'bg-green-500'
  }

  const getDayData = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return data.find(d => d.date === dateStr)?.count || 0
  }

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="w-full">
      <div className="flex items-center gap-1 mb-2">
        {weekDays.map((day, i) => (
          <div key={i} className="w-8 text-center text-xs text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        {weeks.map((weekStart, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const date = new Date(weekStart)
              date.setDate(weekStart.getDate() + dayIndex)
              const count = getDayData(date)
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <div
                  key={dayIndex}
                  className={`w-8 h-8 rounded-sm ${getIntensityClass(count)} ${
                    isToday ? 'ring-2 ring-blue-500' : ''
                  } transition-all hover:scale-110 cursor-pointer`}
                  title={`${date.toLocaleDateString('zh-CN')}: ${count}分钟`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>少</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-gray-100 rounded-sm" />
          <div className="w-4 h-4 bg-green-200 rounded-sm" />
          <div className="w-4 h-4 bg-green-300 rounded-sm" />
          <div className="w-4 h-4 bg-green-400 rounded-sm" />
          <div className="w-4 h-4 bg-green-500 rounded-sm" />
        </div>
        <span>多</span>
      </div>
    </div>
  )
}
