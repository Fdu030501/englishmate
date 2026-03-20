import { NextRequest, NextResponse } from 'next/server'
import { analyzeGrammarPerformance } from '@/lib/ai/deepseek'
import { diagnosticQuestions } from '@/lib/grammar/topics'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, scores } = body

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid answers format' },
        { status: 400 }
      )
    }

    // Analyze performance
    const analysis = await analyzeGrammarPerformance(
      answers.map((answer, i) => {
        const question = diagnosticQuestions[i]
        return {
          topic: question?.topic || 'unknown',
          correct: answer === question?.answer
        }
      })
    )

    // In production, save to database
    // await saveQuizRecord({ ... })

    return NextResponse.json({
      success: true,
      scores,
      weakAreas: analysis.weakAreas,
      recommendations: analysis.recommendations
    })
  } catch (error) {
    console.error('Grammar diagnostic error:', error)
    return NextResponse.json(
      { error: 'Failed to process diagnostic' },
      { status: 500 }
    )
  }
}
