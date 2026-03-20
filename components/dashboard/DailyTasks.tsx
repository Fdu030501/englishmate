'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { BookIcon, EditIcon, TypeIcon, TargetIcon, ZapIcon, ClipboardIcon, CheckCircleIcon } from '@/components/icons'
import { completeTask, getDailyTasks, saveDailyTasks, recordLearningDay } from '@/lib/storage'

interface DailyTask {
  id: string
  type: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  duration: number
}

export default function DailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>([])
  const [completedCount, setCompletedCount] = useState(0)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    // Load tasks from LocalStorage
    const savedTasks = getDailyTasks(today)
    if (savedTasks) {
      setTasks(savedTasks.tasks as DailyTask[])
      setCompletedCount(savedTasks.tasks.filter((t: any) => t.completed).length)
    } else {
      // Generate default tasks
      const defaultTasks: DailyTask[] = [
        {
          id: '1',
          type: 'review',
          title: '复习昨日所学',
          description: '回顾昨天学习的词缀',
          priority: 'high',
          completed: false,
          duration: 10
        },
        {
          id: '2',
          type: 'affix',
          title: '学习新词缀',
          description: '学习一个新的前缀或后缀',
          priority: 'medium',
          completed: false,
          duration: 15
        },
        {
          id: '3',
          type: 'challenge',
          title: '完成小测试',
          description: '测试你的学习成果',
          priority: 'high',
          completed: false,
          duration: 5
        }
      ]
      setTasks(defaultTasks)
      saveDailyTasks(today, { date: today, tasks: defaultTasks, completed: false })
    }
  }, [])

  const handleTaskComplete = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    setTasks(updatedTasks)
    setCompletedCount(updatedTasks.filter(t => t.completed).length)

    // Save to LocalStorage
    const allCompleted = updatedTasks.every(t => t.completed)
    saveDailyTasks(today, { date: today, tasks: updatedTasks, completed: allCompleted })

    if (allCompleted) {
      recordLearningDay()
    }
  }

  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高优先级'
      case 'medium':
        return '中优先级'
      case 'low':
        return '低优先级'
      default:
        return priority
    }
  }

  const getTypeIcon = (type: string) => {
    const iconClass = "w-5 h-5 text-gray-500"
    switch (type) {
      case 'review':
        return <BookIcon className={iconClass} />
      case 'grammar':
        return <EditIcon className={iconClass} />
      case 'affix':
        return <TypeIcon className={iconClass} />
      case 'challenge':
        return <TargetIcon className={iconClass} />
      case 'encouragement':
        return <ZapIcon className={iconClass} />
      default:
        return <ClipboardIcon className={iconClass} />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClipboardIcon className="w-5 h-5" />
            今日任务
          </CardTitle>
          <span className="text-sm text-gray-500">
            {completedCount}/{tasks.length} 完成
          </span>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border rounded-lg transition-all ${
                task.completed ? 'bg-gray-50 opacity-60' : 'bg-white hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleTaskComplete(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getTypeIcon(task.type)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                    <span className="text-xs text-gray-400">{task.duration}分钟</span>
                  </div>
                  <h4 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {completedCount === tasks.length && tasks.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-700 font-medium flex items-center justify-center gap-1">
              <CheckCircleIcon className="w-5 h-5" />
              恭喜！今日任务全部完成！
            </p>
            <p className="text-sm text-green-600 mt-1">继续保持，明天见！</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
