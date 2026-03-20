import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { taskId, date } = await request.json()

    // 获取今日任务
    const { data: dailyTask } = await supabase
      .from('daily_task')
      .select('*')
      .eq('date', date)
      .single()

    if (!dailyTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // 更新任务完成状态
    const updatedTasks = dailyTask.tasks.map((task: any) => {
      if (task.id === taskId) {
        return { ...task, completed: true }
      }
      return task
    })

    // 检查是否全部完成
    const allCompleted = updatedTasks.every((task: any) => task.completed)

    const { error } = await supabase
      .from('daily_task')
      .update({
        tasks: updatedTasks,
        completed: allCompleted,
        completed_at: allCompleted ? new Date().toISOString() : null
      })
      .eq('date', date)

    if (error) throw error

    // 更新学习连续天数
    if (allCompleted) {
      await updateLearningStreak()
    }

    return NextResponse.json({
      success: true,
      allCompleted,
      tasks: updatedTasks
    })
  } catch (error) {
    console.error('Complete task error:', error)
    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    )
  }
}

async function updateLearningStreak() {
  try {
    const today = new Date().toISOString().split('T')[0]

    // 获取当前连续天数
    const { data: streak } = await supabase
      .from('learning_streak')
      .select('*')
      .single()

    if (!streak) {
      // 首次学习
      await supabase.from('learning_streak').insert({
        current_streak: 1,
        longest_streak: 1,
        last_learned: today
      })
    } else {
      const lastDate = new Date(streak.last_learned)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // 连续学习
        const newStreak = streak.current_streak + 1
        await supabase
          .from('learning_streak')
          .update({
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, streak.longest_streak),
            last_learned: today
          })
      } else if (diffDays > 1) {
        // 断签，重新计算
        await supabase
          .from('learning_streak')
          .update({
            current_streak: 1,
            missed_days: [...streak.missed_days, streak.last_learned],
            last_learned: today
          })
      }
    }
  } catch (error) {
    console.error('Update streak error:', error)
  }
}
