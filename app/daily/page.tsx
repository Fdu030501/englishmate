'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MicIcon, PlayIcon, VolumeIcon } from '@/components/icons'

interface DailySentence {
  sentence: string
  author: string
  translation: string
  grammarPoints: Array<{
    point: string
    explanation: string
  }>
  vocabulary: Array<{
    word: string
    meaning: string
  }>
}

export default function DailySentencePage() {
  const [sentence, setSentence] = useState<DailySentence | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // 模拟获取每日一句
    const mockSentence: DailySentence = {
      sentence: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      translation: "成就伟业的唯一途径是热爱你所做的事。",
      grammarPoints: [
        {
          point: "不定式作表语",
          explanation: "to do great work 是不定式短语，在句中作表语"
        },
        {
          point: "宾语从句",
          explanation: "what you do 是宾语从句，作 love 的宾语"
        }
      ],
      vocabulary: [
        { word: "great", meaning: "伟大的、出色的" },
        { word: "achievement", meaning: "成就" }
      ]
    }

    setTimeout(() => {
      setSentence(mockSentence)
      setLoading(false)
    }, 500)
  }, [])

  const playAudio = () => {
    setIsPlaying(true)
    // 模拟播放音频
    setTimeout(() => {
      setIsPlaying(false)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  if (!sentence) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">每日一句</h1>
      <p className="text-gray-600 mb-8">每天进步一点点，积少成多</p>

      {/* 主卡片 */}
      <Card className="mb-6">
        <CardContent className="p-8">
          {/* 日期 */}
          <div className="text-sm text-gray-400 mb-4">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </div>

          {/* 英文句子 */}
          <div className="mb-6">
            <p className="text-2xl font-medium text-gray-900 leading-relaxed mb-4">
              "{sentence.sentence}"
            </p>
            <p className="text-gray-500">— {sentence.author}</p>
          </div>

          {/* 播放按钮 */}
          <Button
            variant="outline"
            onClick={playAudio}
            disabled={isPlaying}
            className="mb-6"
          >
            {isPlaying ? (
              <>
                <span className="mr-2 flex items-center gap-1">
                  <VolumeIcon className="w-4 h-4" />
                  播放中...
                </span>
              </>
            ) : (
              <>
                <PlayIcon className="w-4 h-4 mr-2" /> 播放音频
              </>
            )}
          </Button>

          {/* 中文翻译 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{sentence.translation}</p>
          </div>
        </CardContent>
      </Card>

      {/* 语法解析 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">语法要点</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sentence.grammarPoints.map((point, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-blue-700">{point.point}</h4>
                <p className="text-sm text-gray-600">{point.explanation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 词汇学习 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">重点词汇</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {sentence.vocabulary.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-blue-600">{item.word}</span>
                <span className="text-gray-600">{item.meaning}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
