'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { allAffixes } from '@/lib/affixes/data'
import { Affix } from '@/types'
import { ArrowRightIcon, TargetIcon, ZapIcon, BrainIcon } from '@/components/icons'
import { getAffixProgress } from '@/lib/storage'

export default function AffixesPage() {
  const [affixes] = useState<Affix[]>(allAffixes)
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})

  useEffect(() => {
    // 从 LocalStorage 读取学习进度
    const affixProgress = getAffixProgress()
    const progress: Record<string, number> = {}

    affixes.forEach(affix => {
      const affixProg = affixProgress[affix.id]
      if (affixProg) {
        progress[affix.id] = affixProg.totalWords > 0
          ? Math.round((affixProg.masteredWords / affixProg.totalWords) * 100)
          : 0
      } else {
        progress[affix.id] = 0
      }
    })

    setProgressMap(progress)
  }, [])

  const prefixes = affixes.filter(a => a.type === 'prefix')
  const suffixes = affixes.filter(a => a.type === 'suffix')
  const roots = affixes.filter(a => a.type === 'root')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">词缀学习</h1>
        <p className="text-gray-600">
          从词根词缀角度串联词汇，让单词不再"背了不会用"
        </p>
      </div>

      <div className="space-y-10">
        <AffixSection
          title="前缀"
          subtitle="Prefixes"
          description="改变词义的前置成分"
          icon={<TargetIcon className="w-5 h-5 text-blue-500" />}
          affixes={prefixes}
          progressMap={progressMap}
        />

        <AffixSection
          title="后缀"
          subtitle="Suffixes"
          description="改变词性的后置成分"
          icon={<ZapIcon className="w-5 h-5 text-purple-500" />}
          affixes={suffixes}
          progressMap={progressMap}
        />

        <AffixSection
          title="词根"
          subtitle="Roots"
          description="承载核心含义的部分"
          icon={<BrainIcon className="w-5 h-5 text-green-500" />}
          affixes={roots}
          progressMap={progressMap}
        />
      </div>
    </div>
  )
}

interface AffixSectionProps {
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  affixes: Affix[]
  progressMap: Record<string, number>
}

function AffixSection({ title, subtitle, description, icon, affixes, progressMap }: AffixSectionProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {icon}
          {title}
          <span className="text-sm font-normal text-gray-400">({subtitle})</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {affixes.map((affix) => (
          <AffixCard key={affix.id} affix={affix} progress={progressMap[affix.id] || 0} />
        ))}
      </div>
    </section>
  )
}

function AffixCard({ affix, progress }: { affix: Affix; progress: number }) {
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-700 border-green-200'
      case 2: return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 3: return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-red-100 text-red-700 border-red-200'
    }
  }

  return (
    <Link href={`/affixes/${affix.id}`}>
      <Card className="hover:shadow-lg transition-all cursor-pointer h-full group border-2 border-transparent hover:border-blue-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-mono text-gray-900">{affix.text}</CardTitle>
            <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(affix.difficulty)}`}>
              难度 {affix.difficulty}
            </span>
          </div>
          <CardDescription className="text-gray-600">{affix.meaning}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{affix.description}</p>

          {affix.examples && affix.examples.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1">示例：</p>
              <p className="text-sm text-gray-600 font-mono">
                {Array.isArray(affix.examples) ? affix.examples[0] : affix.examples}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>学习进度</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mt-4 flex items-center text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
            开始学习 <ArrowRightIcon className="w-4 h-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
