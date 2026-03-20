'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookIcon, TargetIcon, TrendingUpIcon, AlertCircleIcon, StarFilledIcon, CheckIcon, XIcon } from '@/components/icons'

interface Mistake {
  id: string
  question: string
  yourAnswer: string
  correctAnswer: string
  explanation: string
  category: string
  mistakeCount: number
  lastWrong: Date
  mastered: boolean
}

export default function MistakeNotebookPage() {
  const [mistakes, setMistakes] = useState<Mistake[]>([
    {
      id: '1',
      question: 'I ___ (go) to the cinema yesterday.',
      yourAnswer: 'go',
      correctAnswer: 'went',
      explanation: 'yesterday表示过去时间，要用一般过去时，go的过去式是went',
      category: '时态',
      mistakeCount: 3,
      lastWrong: new Date(Date.now() - 86400000),
      mastered: false
    },
    {
      id: '2',
      question: 'She ___ swim when she was 5.',
      yourAnswer: 'can',
      correctAnswer: 'could',
      explanation: 'when she was 5表示过去，情态动词要用过去式could',
      category: '情态动词',
      mistakeCount: 2,
      lastWrong: new Date(Date.now() - 172800000),
      mastered: false
    },
    {
      id: '3',
      question: 'The man ___ is standing there is my teacher.',
      yourAnswer: 'which',
      correctAnswer: 'who',
      explanation: '先行词是man（人），关系代词要用who，不用which',
      category: '定语从句',
      mistakeCount: 1,
      lastWrong: new Date(Date.now() - 259200000),
      mastered: true
    }
  ])

  const [currentQuiz, setCurrentQuiz] = useState<Mistake | null>(null)
  const [answer, setAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)

  const unmasteredMistakes = mistakes.filter(m => !m.mastered)
  const masteredCount = mistakes.filter(m => m.mastered).length
  const totalMistakes = mistakes.length

  const startQuiz = () => {
    if (unmasteredMistakes.length === 0) {
      return
    }
    // 优先选择错误次数多的
    const sorted = [...unmasteredMistakes].sort((a, b) => b.mistakeCount - a.mistakeCount)
    setCurrentQuiz(sorted[0])
    setAnswer('')
    setShowResult(false)
  }

  const checkAnswer = () => {
    if (!currentQuiz) return
    setShowResult(true)

    if (answer.trim().toLowerCase() === currentQuiz.correctAnswer.toLowerCase()) {
      // 答对了
      setMistakes(prev => prev.map(m => {
        if (m.id === currentQuiz.id) {
          return { ...m, mastered: true }
        }
        return m
      }))
    } else {
      // 又错了
      setMistakes(prev => prev.map(m => {
        if (m.id === currentQuiz.id) {
          return { ...m, mistakeCount: m.mistakeCount + 1 }
        }
        return m
      }))
    }
  }

  const getCategoryStats = () => {
    const stats: Record<string, { count: number; mastered: number }> = {}
    mistakes.forEach(m => {
      if (!stats[m.category]) {
        stats[m.category] = { count: 0, mastered: 0 }
      }
      stats[m.category].count++
      if (m.mastered) stats[m.category].mastered++
    })
    return stats
  }

  const categoryStats = getCategoryStats()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">错题本</h1>
        <p className="text-gray-600">
          针对性练习，让错题变成得分点
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{unmasteredMistakes.length}</div>
                <div className="text-sm text-gray-500">待巩固</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUpIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{masteredCount}</div>
                <div className="text-sm text-gray-500">已掌握</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TargetIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round((masteredCount / totalMistakes) * 100)}%
                </div>
                <div className="text-sm text-gray-500">掌握率</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 分类统计 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookIcon className="w-5 h-5" />
            薄弱知识点分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{category}</span>
                  <span className="text-sm text-gray-500">
                    {stats.mastered}/{stats.count} 掌握
                  </span>
                </div>
                <Progress
                  value={(stats.mastered / stats.count) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 练习区域 */}
      <Card className="mb-8 border-2 border-blue-100">
        <CardHeader>
          <CardTitle>针对性练习</CardTitle>
        </CardHeader>
        <CardContent>
          {!currentQuiz ? (
            <div className="text-center py-8">
              {unmasteredMistakes.length > 0 ? (
                <>
                  <p className="text-gray-600 mb-4">
                    还有 {unmasteredMistakes.length} 道错题需要巩固
                  </p>
                  <Button onClick={startQuiz} size="lg">
                    <TargetIcon className="w-4 h-4 mr-2" />
                    开始针对性练习
                  </Button>
                </>
              ) : (
                <>
                  <StarFilledIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">太棒了！所有错题都已掌握</p>
                  <p className="text-sm text-gray-400">
                    继续保持，去挑战新的知识吧！
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  错题次数: {currentQuiz.mistakeCount}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                  {currentQuiz.category}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-lg font-medium">{currentQuiz.question}</p>
              </div>

              {!showResult ? (
                <>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="输入你的答案..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                  <Button onClick={checkAnswer} className="w-full">
                    检查答案
                  </Button>
                </>
              ) : (
                <div className={`p-4 rounded-lg ${
                  answer.trim().toLowerCase() === currentQuiz.correctAnswer.toLowerCase()
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {answer.trim().toLowerCase() === currentQuiz.correctAnswer.toLowerCase() ? (
                    <>
                      <p className="text-green-700 font-medium mb-2 flex items-center gap-1">
                        <CheckIcon className="w-4 h-4" />
                        答对了！
                      </p>
                      <p className="text-gray-700">{currentQuiz.explanation}</p>
                      <Button onClick={startQuiz} className="mt-4 w-full">
                        下一题
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-red-700 font-medium mb-2 flex items-center gap-1">
                        <XIcon className="w-4 h-4" />
                        还需要练习
                      </p>
                      <p className="text-gray-700 mb-2">
                        正确答案: <span className="font-bold">{currentQuiz.correctAnswer}</span>
                      </p>
                      <p className="text-gray-600 text-sm">{currentQuiz.explanation}</p>
                      <Button onClick={startQuiz} variant="outline" className="mt-4 w-full">
                        再试一道
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 错题列表 */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">错题记录</h2>
        {mistakes.map((mistake) => (
          <Card
            key={mistake.id}
            className={`${mistake.mastered ? 'opacity-60' : ''} border-l-4 ${
              mistake.mastered ? 'border-l-green-400' : 'border-l-red-400'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{mistake.question}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-red-500">
                      你的答案: {mistake.yourAnswer}
                    </span>
                    <span className="text-green-500">
                      正确答案: {mistake.correctAnswer}
                    </span>
                  </div>
                  {mistake.mastered && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                      已掌握
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  错{mistake.mistakeCount}次
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
