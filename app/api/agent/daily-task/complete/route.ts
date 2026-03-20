import { NextRequest, NextResponse } from 'next/server'
import { completeTask, recordLearningDay } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const { taskId, date } = await request.json()

    if (!taskId || !date) {
      return NextResponse.json(
        { error: 'Missing taskId or date' },
        { status: 400 }
      )
    }

    // 使用 LocalStorage 完成任务
    completeTask(date, taskId)

    // 记录学习天数
    recordLearningDay()

    return NextResponse.json({
      success: true,
      message: 'Task completed successfully'
    })
  } catch (error) {
    console.error('Complete task error:', error)
    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    )
  }
}
