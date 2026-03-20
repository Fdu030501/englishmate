'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PawIcon, HeartIcon, ZapIcon, SmileIcon, MehIcon, SadIcon, SleepIcon, SparklesIcon } from '@/components/icons'
import { getPetStatus, savePetStatus, recordLearningDay } from '@/lib/storage'

interface Pet {
  name: string
  level: number
  experience: number
  maxExperience: number
  hunger: number
  happiness: number
  energy: number
  state: 'idle' | 'eating' | 'playing' | 'sleeping' | 'evolving'
}

export default function LearningPet() {
  const [pet, setPet] = useState<Pet>(() => {
    // 从 LocalStorage 读取状态
    const saved = getPetStatus()
    return {
      name: saved.name || '词词',
      level: saved.level || 1,
      experience: saved.experience || 0,
      maxExperience: 100 * (saved.level || 1),
      hunger: saved.hunger || 30,
      happiness: saved.happiness || 70,
      energy: saved.energy || 80,
      state: 'idle'
    }
  })

  const [message, setMessage] = useState('主人好！今天也要加油学习哦！')

  useEffect(() => {
    // 模拟宠物状态衰减
    const interval = setInterval(() => {
      setPet(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 2),
        happiness: Math.max(0, prev.happiness - 1),
        energy: Math.max(0, prev.energy - 0.5)
      }))
    }, 30000) // 每 30 秒衰减一次

    return () => clearInterval(interval)
  }, [])

  // 保存宠物状态到 LocalStorage
  useEffect(() => {
    savePetStatus({
      name: pet.name,
      level: pet.level,
      experience: pet.experience,
      hunger: pet.hunger,
      happiness: pet.happiness,
      energy: pet.energy,
      lastFed: new Date().toISOString(),
      lastPlayed: new Date().toISOString(),
    })
  }, [pet])

  const feed = () => {
    if (pet.hunger <= 0) {
      setMessage('我不饿啦，主人～')
      return
    }

    setPet(prev => ({
      ...prev,
      hunger: Math.max(0, prev.hunger - 30),
      happiness: Math.min(100, prev.happiness + 5),
      state: 'eating'
    }))
    setMessage('好好吃！谢谢主人！')

    setTimeout(() => {
      setPet(prev => ({ ...prev, state: 'idle' }))
    }, 2000)
  }

  const play = () => {
    if (pet.energy < 20) {
      setMessage('我太累了，想休息一下...')
      return
    }

    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 20),
      energy: Math.max(0, prev.energy - 15),
      hunger: Math.min(100, prev.hunger + 10),
      state: 'playing'
    }))
    setMessage('好开心！主人陪我玩！')

    setTimeout(() => {
      setPet(prev => ({ ...prev, state: 'idle' }))
    }, 2000)
  }

  const addExperience = (amount: number) => {
    // 记录学习天数
    recordLearningDay()

    setPet(prev => {
      const newExp = prev.experience + amount
      if (newExp >= prev.maxExperience) {
        // 升级
        return {
          ...prev,
          level: prev.level + 1,
          experience: newExp - prev.maxExperience,
          maxExperience: Math.floor(prev.maxExperience * 1.5),
          hunger: Math.max(0, prev.hunger - 10),
          happiness: 100,
          state: 'evolving'
        }
      }
      return { ...prev, experience: newExp }
    })

    if (pet.experience + amount >= pet.maxExperience) {
      setMessage(`恭喜！我升到 ${pet.level + 1} 级了！`)
      setTimeout(() => {
        setPet(prev => ({ ...prev, state: 'idle' }))
      }, 3000)
    }
  }

  const getPetIcon = () => {
    const iconClass = "w-16 h-16"
    switch (pet.state) {
      case 'eating':
        return <SmileIcon className={`${iconClass} text-green-500`} />
      case 'playing':
        return <SmileIcon className={`${iconClass} text-blue-500`} />
      case 'sleeping':
        return <SleepIcon className={`${iconClass} text-gray-400`} />
      case 'evolving':
        return <SparklesIcon className={`${iconClass} text-yellow-500`} />
      default:
        if (pet.happiness > 70) return <SmileIcon className={`${iconClass} text-yellow-500`} />
        if (pet.happiness > 40) return <MehIcon className={`${iconClass} text-gray-500`} />
        if (pet.hunger > 80) return <SadIcon className={`${iconClass} text-orange-500`} />
        return <SadIcon className={`${iconClass} text-red-500`} />
    }
  }

  const getStatusColor = (value: number) => {
    if (value > 70) return 'bg-green-500'
    if (value > 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PawIcon className="w-5 h-5 text-pink-500" />
            学习伙伴
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600">Lv.{pet.level}</span>
            <span className="text-xs text-gray-400">{pet.name}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 宠物形象 */}
        <div className="flex flex-col items-center py-6 bg-gradient-to-b from-pink-50 to-purple-50 rounded-lg">
          <div className="text-6xl mb-4 animate-bounce">
            {getPetIcon()}
          </div>
          <p className="text-sm text-gray-600 text-center px-4">
            "{message}"
          </p>
        </div>

        {/* 状态条 */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <ZapIcon className="w-3 h-3" /> 饱食度
              </span>
              <span>{Math.round(100 - pet.hunger)}%</span>
            </div>
            <Progress
              value={100 - pet.hunger}
              className={`h-2 ${getStatusColor(100 - pet.hunger)}`}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <HeartIcon className="w-3 h-3" /> 心情
              </span>
              <span>{Math.round(pet.happiness)}%</span>
            </div>
            <Progress
              value={pet.happiness}
              className={`h-2 ${getStatusColor(pet.happiness)}`}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <SmileIcon className="w-3 h-3" /> 精力
              </span>
              <span>{Math.round(pet.energy)}%</span>
            </div>
            <Progress
              value={pet.energy}
              className={`h-2 ${getStatusColor(pet.energy)}`}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>经验值</span>
              <span>{pet.experience}/{pet.maxExperience}</span>
            </div>
            <Progress
              value={(pet.experience / pet.maxExperience) * 100}
              className="h-2 bg-purple-500"
            />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={feed}
            disabled={pet.hunger <= 0}
            className="flex items-center gap-2"
          >
            <HeartIcon className="w-4 h-4 text-red-500" /> 喂食
          </Button>
          <Button
            variant="outline"
            onClick={play}
            disabled={pet.energy < 20}
            className="flex items-center gap-2"
          >
            <ZapIcon className="w-4 h-4 text-yellow-500" /> 玩耍
          </Button>
        </div>

        {/* 提示 */}
        <p className="text-xs text-gray-500 text-center">
          学习 10 分钟 = 喂食一次 | 完成任务 = 陪玩一次
        </p>
      </CardContent>
    </Card>
  )
}
