import { NextRequest, NextResponse } from 'next/server'
import { getDailyTasks, saveDailyTasks } from '@/lib/storage'

interface DailyTask {
  id: string
  type: 'review' | 'grammar' | 'affix' | 'challenge' | 'encouragement'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  duration: number
}

export async function GET(request: NextRequest) {
  try {
    // 获取今天的日期
    const today = new Date().toISOString().split('T')[0]

    // 从 LocalStorage 获取任务
    const existingTask = getDailyTasks(today)

    if (existingTask) {
      return NextResponse.json({ tasks: existingTask.tasks, date: today })
    }

    // 生成新任务
    const tasks = await generateDailyTasks()

    // 保存到 LocalStorage
    saveDailyTasks(today, {
      date: today,
      tasks: tasks as any,
      completed: false
    })

    return NextResponse.json({ tasks, date: today })
  } catch (error) {
    console.error('Daily task generation error:', error)
    // 返回默认任务
    return NextResponse.json({
      tasks: getDefaultTasks(),
      date: new Date().toISOString().split('T')[0]
    })
  }
}

async function generateDailyTasks(): Promise<DailyTask[]> {
  const tasks: DailyTask[] = []

  // 1. 复习任务（艾宾浩斯曲线）
  tasks.push({
    id: `review-${Date.now()}`,
    type: 'review',
    title: '复习昨日所学',
    description: '回顾昨天学习的词缀，强化记忆',
    priority: 'high',
    completed: false,
    duration: 10
  })

  // 2. 新词缀学习
  tasks.push({
    id: `affix-${Date.now()}`,
    type: 'affix',
    title: '学习新词缀',
    description: '学习一个新的前缀或后缀，掌握其含义和用法',
    priority: 'medium',
    completed: false,
    duration: 15
  })

  // 3. 语法练习
  tasks.push({
    id: `grammar-${Date.now()}`,
    type: 'grammar',
    title: '语法微课',
    description: '针对弱项进行语法强化练习',
    priority: 'medium',
    completed: false,
    duration: 10
  })

  // 4. 小测试
  tasks.push({
    id: `quiz-${Date.now()}`,
    type: 'challenge',
    title: '完成小测试',
    description: 'AI 生成的 5 道练习题，检验学习效果',
    priority: 'high',
    completed: false,
    duration: 5
  })

  // 5. 鼓励任务
  tasks.push({
    id: `encouragement-${Date.now()}`,
    type: 'encouragement',
    title: '今日鼓励',
    description: '你已经很棒了！保持这个节奏继续加油',
    priority: 'low',
    completed: false,
    duration: 1
  })

  return tasks
}

function getDefaultTasks(): DailyTask[] {
  return [
    {
      id: 'default-1',
      type: 'review',
      title: '复习昨日所学',
      description: '回顾昨天学习的词缀',
      priority: 'high',
      completed: false,
      duration: 10
    },
    {
      id: 'default-2',
      type: 'affix',
      title: '学习新词缀',
      description: '选择一个新的词缀开始学习',
      priority: 'medium',
      completed: false,
      duration: 15
    },
    {
      id: 'default-3',
      type: 'challenge',
      title: '完成小测试',
      description: '测试你的学习成果',
      priority: 'high',
      completed: false,
      duration: 5
    }
  ]
}
