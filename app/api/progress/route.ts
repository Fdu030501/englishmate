import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from Supabase
    // This is mock data for demonstration

    return NextResponse.json({
      streak: {
        current: 7,
        longest: 14
      },
      affixes: {
        learned: 5,
        learning: 3,
        locked: 18
      },
      quiz: {
        total: 12,
        averageScore: 78
      },
      radar: {
        vocabulary: 65,
        grammar: 45,
        reading: 55,
        listening: 40,
        speaking: 35
      }
    })
  } catch (error) {
    console.error('Progress fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
