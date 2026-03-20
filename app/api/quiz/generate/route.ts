import { NextRequest, NextResponse } from 'next/server'
import { generateQuiz } from '@/lib/ai/deepseek'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { affixId, affixText, affixMeaning, derivedWords, difficulty } = body

    if (!affixId || !affixText || !affixMeaning) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const questions = await generateQuiz({
      affixId,
      affixText,
      affixMeaning,
      derivedWords: derivedWords || [],
      difficulty: difficulty || 1
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Quiz generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
