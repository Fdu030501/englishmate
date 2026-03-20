'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { diagnosticQuestions, grammarTopics } from '@/lib/grammar/topics'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function GrammarPage() {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<Record<string, number>>({})

  const startTest = () => {
    setStarted(true)
  }

  const selectAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < diagnosticQuestions.length - 1) {
      setCurrentQuestion(q => q + 1)
    } else {
      submitTest()
    }
  }

  const submitTest = () => {
    // Calculate scores by topic
    const topicScores: Record<string, { correct: number; total: number }> = {}

    answers.forEach((answer, i) => {
      const question = diagnosticQuestions[i]
      if (!topicScores[question.topic]) {
        topicScores[question.topic] = { correct: 0, total: 0 }
      }
      topicScores[question.topic].total++
      if (answer === question.answer) {
        topicScores[question.topic].correct++
      }
    })

    const scores: Record<string, number> = {}
    Object.entries(topicScores).forEach(([topic, data]) => {
      scores[topic] = Math.round((data.correct / data.total) * 100)
    })

    setResult(scores)
    setShowResult(true)

    // Save to API
    fetch('/api/grammar/diagnostic/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, scores })
    }).catch(console.error)
  }

  if (!started) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">语法诊断</h1>
        <p className="text-gray-600 mb-8">
          通过入门测试定位语法弱项，生成针对性学习计划
        </p>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>语法知识点体系</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {grammarTopics.slice(0, 6).map((topic) => (
                <div key={topic.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{topic.name}</h4>
                  <p className="text-sm text-gray-500">{topic.description}</p>
                </div>
              ))}
            </div>
            <Button onClick={startTest} className="mt-6 w-full">
              开始测试 ({diagnosticQuestions.length} 题)
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResult) {
    const weakAreas = Object.entries(result)
      .filter(([_, score]) => score < 60)
      .map(([topic]) => topic)

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">测试结果</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>能力概览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(result).map(([topic, score]) => {
                const topicInfo = grammarTopics.find(t => t.id === topic)
                return (
                  <div key={topic}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{topicInfo?.name || topic}</span>
                      <span className={score < 60 ? 'text-red-600' : 'text-green-600'}>
                        {score}分
                      </span>
                    </div>
                    <Progress value={score} className={score < 60 ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'} />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {weakAreas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>需要加强的知识点</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {weakAreas.map((area) => {
                  const topicInfo = grammarTopics.find(t => t.id === area)
                  return (
                    <li key={area} className="flex items-center justify-between">
                      <span>{topicInfo?.name || area}</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/grammar/topics/${area}`}>开始学习</a>
                      </Button>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const question = diagnosticQuestions[currentQuestion]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>进度</span>
            <span>{currentQuestion + 1}/{diagnosticQuestions.length}</span>
          </div>
          <Progress value={((currentQuestion + 1) / diagnosticQuestions.length) * 100} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>第 {currentQuestion + 1} 题</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">{question.question}</p>
            <div className="space-y-2">
              {question.options.map((option, i) => (
                <Button
                  key={i}
                  variant={answers[currentQuestion] === option ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => selectAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <Button
              onClick={nextQuestion}
              disabled={!answers[currentQuestion]}
              className="mt-6"
            >
              {currentQuestion < diagnosticQuestions.length - 1 ? '下一题' : '提交'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
