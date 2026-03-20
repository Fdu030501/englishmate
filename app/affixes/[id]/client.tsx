'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { allAffixes } from '@/lib/affixes/data'
import { Affix, QuizQuestion } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckIcon, XIcon } from '@/components/icons'
import { updateAffixProgress, recordLearningDay } from '@/lib/storage'

export default function AffixDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const [affix, setAffix] = useState<Affix | null>(null)
  const [loading, setLoading] = useState(true)
  const [quizLoading, setQuizLoading] = useState(false)
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const found = allAffixes.find(a => a.id === id)
    if (found) {
      setAffix(found)
    }
    setLoading(false)
  }, [id])

  const generateQuiz = async () => {
    if (!affix) return
    setQuizLoading(true)
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affixId: affix.id,
          affixText: affix.text,
          affixMeaning: affix.meaning,
          derivedWords: affix.examples,
          difficulty: affix.difficulty
        })
      })
      const data = await res.json()
      setQuiz(data.questions || [])
    } catch (error) {
      console.error('Failed to generate quiz:', error)
    } finally {
      setQuizLoading(false)
    }
  }

  const submitAnswer = () => {
    if (!quiz || !affix) return
    const question = quiz[currentQuestion]
    const isCorrect = selectedAnswer === question.answer
    if (isCorrect) {
      setScore(s => s + 1)
    }
    setShowResult(true)
  }

  const nextQuestion = () => {
    if (!quiz) return
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(q => q + 1)
      setSelectedAnswer('')
      setShowResult(false)
    } else {
      // Quiz completed - save progress
      const isMastered = score >= quiz.length * 0.7 // 70% 正确率算掌握

      if (affix) {
        updateAffixProgress(affix.id, {
          status: isMastered ? 'mastered' : 'learning',
          masteredWords: score,
          totalWords: quiz.length,
          lastPracticed: new Date().toISOString(),
        })
      }

      // Record learning day
      recordLearningDay()

      router.push(`/quiz/result?score=${score}&total=${quiz.length}`)
    }
  }

  if (loading || !affix) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        ← 返回
      </Button>

      <div className="max-w-3xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-mono font-bold">{affix.text}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              affix.difficulty === 1 ? 'bg-green-100 text-green-700' :
              affix.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              难度 {affix.difficulty}
            </span>
          </div>
          <p className="text-xl text-gray-700">{affix.meaning}</p>
          <p className="text-gray-500 mt-2">{affix.description}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>示例词</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {affix.examples.map((example, i) => (
                <li key={i} className="text-gray-700">• {example}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>小测试</CardTitle>
            <CardDescription>
              学完即测，即时反馈
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!quiz ? (
              <Button onClick={generateQuiz} disabled={quizLoading}>
                {quizLoading ? '生成中...' : '开始测试'}
              </Button>
            ) : quiz.length === 0 ? (
              <p>测试生成失败，请重试</p>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>进度</span>
                  <span>{currentQuestion + 1}/{quiz.length}</span>
                </div>
                <Progress value={((currentQuestion + 1) / quiz.length) * 100} />

                <div className="mt-4">
                  <p className="font-medium mb-4">
                    {quiz[currentQuestion].question}
                  </p>

                  {quiz[currentQuestion].type === 'multiple_choice' && (
                    <div className="space-y-2">
                      {quiz[currentQuestion].options?.map((option, i) => (
                        <Button
                          key={i}
                          variant={selectedAnswer === option ? 'default' : 'outline'}
                          className="w-full justify-start"
                          onClick={() => setSelectedAnswer(option)}
                          disabled={showResult}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}

                  {quiz[currentQuestion].type !== 'multiple_choice' && (
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      placeholder="输入答案..."
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      disabled={showResult}
                    />
                  )}

                  {showResult && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      selectedAnswer === quiz[currentQuestion].answer
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className="font-medium flex items-center gap-1">
                        {selectedAnswer === quiz[currentQuestion].answer
                          ? <><CheckIcon className="w-4 h-4 text-green-600" /> 正确！</>
                          : <><XIcon className="w-4 h-4 text-red-600" /> 正确答案：{quiz[currentQuestion].answer}</>}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {quiz[currentQuestion].explanation}
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    {!showResult ? (
                      <Button
                        onClick={submitAnswer}
                        disabled={!selectedAnswer}
                      >
                        提交答案
                      </Button>
                    ) : (
                      <Button onClick={nextQuestion}>
                        {currentQuestion < quiz.length - 1 ? '下一题' : '查看结果'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
