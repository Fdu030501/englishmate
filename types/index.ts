export interface Affix {
  id: string
  type: 'prefix' | 'suffix' | 'root'
  text: string
  meaning: string
  description?: string
  difficulty: number
  examples: string[]
}

export interface AffixWord {
  id: string
  affix_id: string
  word: string
  part_of_speech?: string
  meaning: string
  sentences: string[]
  collocations: string[]
  difficulty: number
}

export interface AffixWithWords extends Affix {
  derivedWords: AffixWord[]
}

export interface UserProfile {
  id: string
  user_id: string
  vocabulary_score: number
  grammar_scores: Record<string, number>
  listening_score: number
  speaking_score: number
  reading_score: number
  last_assessment: string | null
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'sentence'
  question: string
  options?: string[]
  answer: string
  explanation: string
}

export interface Quiz {
  id: string
  affix_id: string
  questions: QuizQuestion[]
  created_at: string
}

export interface QuizRecord {
  id: string
  user_id: string
  quiz_type: string
  quiz_topic: string | null
  score: number
  total_questions: number
  correct_questions: number
  wrong_questions: Array<{
    question: string
    answer: string
    explanation: string
  }>
  time_spent: number | null
  created_at: string
}

export interface AffixProgress {
  id: string
  user_id: string
  affix_id: string
  affix_type: string
  status: 'locked' | 'learning' | 'mastered'
  mastered_words: number
  total_words: number
  last_practiced: string | null
  created_at: string
  updated_at: string
}
