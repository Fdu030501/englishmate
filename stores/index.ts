import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

interface UserState {
  user: any | null
  profile: any | null
  isLoading: boolean
  setUser: (user: any) => void
  setProfile: (profile: any) => void
  fetchProfile: () => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  fetchProfile: async () => {
    const { user } = get()
    if (!user) return

    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!error && data) {
      set({ profile: data })
    }
  },
}))

interface PetState {
  name: string
  level: number
  experience: number
  maxExperience: number
  hunger: number
  happiness: number
  energy: number
  state: 'idle' | 'eating' | 'playing' | 'sleeping' | 'evolving'
  message: string
  feed: () => void
  play: () => void
  addExperience: (amount: number) => void
  setMessage: (message: string) => void
}

export const usePetStore = create<PetState>((set, get) => ({
  name: '词词',
  level: 1,
  experience: 0,
  maxExperience: 100,
  hunger: 30,
  happiness: 70,
  energy: 80,
  state: 'idle',
  message: '主人好！今天也要加油学习哦！',
  feed: () => {
    const { hunger } = get()
    if (hunger <= 0) {
      set({ message: '我不饿啦，主人～' })
      return
    }
    set({
      hunger: Math.max(0, hunger - 30),
      happiness: Math.min(100, get().happiness + 5),
      state: 'eating',
      message: '好好吃！谢谢主人！'
    })
    setTimeout(() => set({ state: 'idle' }), 2000)
  },
  play: () => {
    const { energy, hunger } = get()
    if (energy < 20) {
      set({ message: '我太累了，想休息一下...' })
      return
    }
    set({
      happiness: Math.min(100, get().happiness + 20),
      energy: Math.max(0, energy - 15),
      hunger: Math.min(100, hunger + 10),
      state: 'playing',
      message: '好开心！主人陪我玩！'
    })
    setTimeout(() => set({ state: 'idle' }), 2000)
  },
  addExperience: (amount: number) => {
    const { experience, maxExperience, level } = get()
    const newExp = experience + amount
    if (newExp >= maxExperience) {
      set({
        level: level + 1,
        experience: newExp - maxExperience,
        maxExperience: Math.floor(maxExperience * 1.5),
        hunger: Math.max(0, get().hunger - 10),
        happiness: 100,
        state: 'evolving',
        message: `恭喜！我升到 ${level + 1} 级了！`
      })
      setTimeout(() => set({ state: 'idle' }), 3000)
    } else {
      set({ experience: newExp })
    }
  },
  setMessage: (message: string) => set({ message }),
}))

interface TaskState {
  tasks: any[]
  completedCount: number
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  completeTask: (taskId: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  completedCount: 0,
  loading: false,
  error: null,
  fetchTasks: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/agent/daily-task')
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data = await response.json()
      set({
        tasks: data.tasks,
        completedCount: data.tasks.filter((t: any) => t.completed).length
      })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      set({ loading: false })
    }
  },
  completeTask: async (taskId: string) => {
    try {
      const response = await fetch('/api/agent/daily-task/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, date: new Date().toISOString().split('T')[0] })
      })
      if (!response.ok) throw new Error('Failed to complete task')

      const { tasks } = get()
      const updatedTasks = tasks.map((task: any) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
      set({
        tasks: updatedTasks,
        completedCount: updatedTasks.filter((t: any) => t.completed).length
      })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error' })
    }
  },
}))
