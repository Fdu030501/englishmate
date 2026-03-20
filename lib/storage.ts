// LocalStorage 数据持久化工具
// 用于存储学习进度、词缀学习记录、错题本等

const STORAGE_KEYS = {
  USER_PROFILE: 'englishmate_user_profile',
  AFFIX_PROGRESS: 'englishmate_affix_progress',
  QUIZ_RECORDS: 'englishmate_quiz_records',
  MISTAKES: 'englishmate_mistakes',
  LEARNING_STREAK: 'englishmate_learning_streak',
  DAILY_TASKS: 'englishmate_daily_tasks',
  LAST_LEARNED_DATE: 'englishmate_last_learned_date',
  PET_STATUS: 'englishmate_pet_status',
  VOCABULARY_NOTEBOOK: 'englishmate_vocabulary_notebook',
  READING_PROGRESS: 'englishmate_reading_progress',
  LISTENING_PROGRESS: 'englishmate_listening_progress',
  WRITING_HISTORY: 'englishmate_writing_history',
}

// 通用存储函数
export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('LocalStorage set error:', error)
  }
}

export function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('LocalStorage get error:', error)
    return defaultValue
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(key)
}

// 用户资料
export interface UserProfileData {
  vocabularyScore: number
  grammarScores: Record<string, number>
  listeningScore: number
  speakingScore: number
  readingScore: number
  lastAssessment: string | null
  createdAt: string
  updatedAt: string
}

export function saveUserProfile(profile: UserProfileData): void {
  setItem(STORAGE_KEYS.USER_PROFILE, profile)
}

export function getUserProfile(): UserProfileData {
  return getItem(STORAGE_KEYS.USER_PROFILE, {
    vocabularyScore: 0,
    grammarScores: {},
    listeningScore: 0,
    speakingScore: 0,
    readingScore: 0,
    lastAssessment: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

// 词缀学习进度
export interface AffixProgressData {
  affixId: string
  status: 'locked' | 'learning' | 'mastered'
  masteredWords: number
  totalWords: number
  lastPracticed: string | null
}

export function saveAffixProgress(progress: Record<string, AffixProgressData>): void {
  setItem(STORAGE_KEYS.AFFIX_PROGRESS, progress)
}

export function getAffixProgress(): Record<string, AffixProgressData> {
  return getItem(STORAGE_KEYS.AFFIX_PROGRESS, {})
}

export function updateAffixProgress(affixId: string, data: Partial<AffixProgressData>): void {
  const progress = getAffixProgress()
  progress[affixId] = {
    ...progress[affixId],
    ...data,
    affixId,
  }
  saveAffixProgress(progress)
}

// 测试记录
export interface QuizRecordData {
  id: string
  quizType: string
  quizTopic: string | null
  score: number
  totalQuestions: number
  correctQuestions: number
  timeSpent: number
  createdAt: string
}

export function saveQuizRecord(record: QuizRecordData): void {
  const records = getQuizRecords()
  records.unshift(record)
  // 只保留最近50条记录
  if (records.length > 50) {
    records.pop()
  }
  setItem(STORAGE_KEYS.QUIZ_RECORDS, records)
}

export function getQuizRecords(): QuizRecordData[] {
  return getItem(STORAGE_KEYS.QUIZ_RECORDS, [])
}

// 错题本
export interface MistakeData {
  id: string
  question: string
  userAnswer: string
  correctAnswer: string
  explanation: string
  topic: string
  masteryLevel: number // 0-100
  reviewCount: number
  lastReviewed: string
  createdAt: string
}

export function addMistake(mistake: MistakeData): void {
  const mistakes = getMistakes()
  mistakes.unshift(mistake)
  setItem(STORAGE_KEYS.MISTAKES, mistakes)
}

export function getMistakes(): MistakeData[] {
  return getItem(STORAGE_KEYS.MISTAKES, [])
}

export function updateMistakeMastery(mistakeId: string, masteryLevel: number): void {
  const mistakes = getMistakes()
  const index = mistakes.findIndex(m => m.id === mistakeId)
  if (index !== -1) {
    mistakes[index].masteryLevel = masteryLevel
    mistakes[index].reviewCount++
    mistakes[index].lastReviewed = new Date().toISOString()
    setItem(STORAGE_KEYS.MISTAKES, mistakes)
  }
}

export function deleteMistake(mistakeId: string): void {
  const mistakes = getMistakes()
  const filtered = mistakes.filter(m => m.id !== mistakeId)
  setItem(STORAGE_KEYS.MISTAKES, filtered)
}

// 连续学习天数
export interface LearningStreakData {
  currentStreak: number
  longestStreak: number
  lastLearnedDate: string | null
  totalLearnDays: number
}

export function getLearningStreak(): LearningStreakData {
  return getItem(STORAGE_KEYS.LEARNING_STREAK, {
    currentStreak: 0,
    longestStreak: 0,
    lastLearnedDate: null,
    totalLearnDays: 0,
  })
}

export function recordLearningDay(): LearningStreakData {
  const streak = getLearningStreak()
  const today = new Date().toISOString().split('T')[0]
  const lastDate = streak.lastLearnedDate

  if (lastDate === today) {
    return streak
  }

  if (lastDate) {
    const lastDateObj = new Date(lastDate)
    const todayObj = new Date(today)
    const diffDays = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      streak.currentStreak++
    } else {
      streak.currentStreak = 1
    }
  } else {
    streak.currentStreak = 1
  }

  streak.lastLearnedDate = today
  streak.totalLearnDays++

  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak
  }

  setItem(STORAGE_KEYS.LEARNING_STREAK, streak)
  return streak
}

// 每日任务
export interface DailyTaskData {
  date: string
  tasks: Array<{
    id: string
    type: string
    title: string
    completed: boolean
  }>
  completed: boolean
}

export function getDailyTasks(date: string): DailyTaskData | null {
  const tasks = getItem<Record<string, DailyTaskData>>(STORAGE_KEYS.DAILY_TASKS, {})
  return tasks[date] || null
}

export function saveDailyTasks(date: string, data: DailyTaskData): void {
  const tasks = getItem<Record<string, DailyTaskData>>(STORAGE_KEYS.DAILY_TASKS, {})
  tasks[date] = data
  setItem(STORAGE_KEYS.DAILY_TASKS, tasks)
}

export function completeTask(date: string, taskId: string): void {
  const tasks = getDailyTasks(date)
  if (tasks) {
    const task = tasks.tasks.find(t => t.id === taskId)
    if (task) {
      task.completed = true
      const allCompleted = tasks.tasks.every(t => t.completed)
      tasks.completed = allCompleted
      saveDailyTasks(date, tasks)

      if (allCompleted) {
        recordLearningDay()
      }
    }
  }
}

// 宠物状态
export interface PetStatusData {
  name: string
  level: number
  experience: number
  hunger: number
  happiness: number
  energy: number
  lastFed: string | null
  lastPlayed: string | null
}

export function getPetStatus(): PetStatusData {
  return getItem(STORAGE_KEYS.PET_STATUS, {
    name: '词词',
    level: 1,
    experience: 0,
    hunger: 30,
    happiness: 70,
    energy: 80,
    lastFed: null,
    lastPlayed: null,
  })
}

export function savePetStatus(pet: PetStatusData): void {
  setItem(STORAGE_KEYS.PET_STATUS, pet)
}

// 词汇本
export interface VocabularyItem {
  id: string
  word: string
  meaning: string
  affixId?: string
  source: 'affix' | 'reading' | 'listening' | 'mistake'
  addedAt: string
  reviewCount: number
  mastered: boolean
}

export function addToVocabulary(item: Omit<VocabularyItem, 'id' | 'addedAt' | 'reviewCount' | 'mastered'>): void {
  const vocab = getVocabulary()
  const newItem: VocabularyItem = {
    ...item,
    id: Date.now().toString(),
    addedAt: new Date().toISOString(),
    reviewCount: 0,
    mastered: false,
  }
  vocab.unshift(newItem)
  setItem(STORAGE_KEYS.VOCABULARY_NOTEBOOK, vocab)
}

export function getVocabulary(): VocabularyItem[] {
  return getItem(STORAGE_KEYS.VOCABULARY_NOTEBOOK, [])
}

export function markVocabularyMastered(wordId: string, mastered: boolean): void {
  const vocab = getVocabulary()
  const item = vocab.find(v => v.id === wordId)
  if (item) {
    item.mastered = mastered
    item.reviewCount++
    setItem(STORAGE_KEYS.VOCABULARY_NOTEBOOK, vocab)
  }
}

// 阅读进度
export interface ReadingProgressData {
  articleId: string
  progress: number
  completed: boolean
  completedAt: string | null
  bookmarks: string[]
}

export function getReadingProgress(): Record<string, ReadingProgressData> {
  return getItem(STORAGE_KEYS.READING_PROGRESS, {})
}

export function updateReadingProgress(articleId: string, data: Partial<ReadingProgressData>): void {
  const progress = getReadingProgress()
  progress[articleId] = {
    ...progress[articleId],
    ...data,
    articleId,
  }
  setItem(STORAGE_KEYS.READING_PROGRESS, progress)
}

// 听力进度
export interface ListeningProgressData {
  materialId: string
  progress: number
  completed: boolean
  dictationResults: Array<{
    sentenceId: string
    correct: boolean
  }>
  completedAt: string | null
}

export function getListeningProgress(): Record<string, ListeningProgressData> {
  return getItem(STORAGE_KEYS.LISTENING_PROGRESS, {})
}

export function updateListeningProgress(materialId: string, data: Partial<ListeningProgressData>): void {
  const progress = getListeningProgress()
  progress[materialId] = {
    ...progress[materialId],
    ...data,
    materialId,
  }
  setItem(STORAGE_KEYS.LISTENING_PROGRESS, progress)
}

// 作文批改历史
export interface WritingHistoryItem {
  id: string
  title: string
  essayType: string
  content: string
  score: number
  corrections: object
  createdAt: string
}

export function addWritingHistory(item: Omit<WritingHistoryItem, 'id' | 'createdAt'>): void {
  const history = getWritingHistory()
  const newItem: WritingHistoryItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  history.unshift(newItem)
  // 只保留最近20篇
  if (history.length > 20) {
    history.pop()
  }
  setItem(STORAGE_KEYS.WRITING_HISTORY, history)
}

export function getWritingHistory(): WritingHistoryItem[] {
  return getItem(STORAGE_KEYS.WRITING_HISTORY, [])
}

// 导出所有数据（用于备份）
export function exportAllData(): object {
  return {
    userProfile: getUserProfile(),
    affixProgress: getAffixProgress(),
    quizRecords: getQuizRecords(),
    mistakes: getMistakes(),
    learningStreak: getLearningStreak(),
    petStatus: getPetStatus(),
    vocabulary: getVocabulary(),
    readingProgress: getReadingProgress(),
    listeningProgress: getListeningProgress(),
    writingHistory: getWritingHistory(),
    exportedAt: new Date().toISOString(),
  }
}

// 导入数据
export function importAllData(data: object): void {
  const d = data as any
  if (d.userProfile) saveUserProfile(d.userProfile)
  if (d.affixProgress) saveAffixProgress(d.affixProgress)
  if (d.quizRecords) setItem(STORAGE_KEYS.QUIZ_RECORDS, d.quizRecords)
  if (d.mistakes) setItem(STORAGE_KEYS.MISTAKES, d.mistakes)
  if (d.learningStreak) setItem(STORAGE_KEYS.LEARNING_STREAK, d.learningStreak)
  if (d.petStatus) savePetStatus(d.petStatus)
  if (d.vocabulary) setItem(STORAGE_KEYS.VOCABULARY_NOTEBOOK, d.vocabulary)
  if (d.readingProgress) setItem(STORAGE_KEYS.READING_PROGRESS, d.readingProgress)
  if (d.listeningProgress) setItem(STORAGE_KEYS.LISTENING_PROGRESS, d.listeningProgress)
  if (d.writingHistory) setItem(STORAGE_KEYS.WRITING_HISTORY, d.writingHistory)
}

// 清空所有数据
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => removeItem(key))
}
