export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profile: {
        Row: {
          id: string
          user_id: string
          vocabulary_score: number
          grammar_scores: Json
          listening_score: number
          speaking_score: number
          reading_score: number
          last_assessment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vocabulary_score?: number
          grammar_scores?: Json
          listening_score?: number
          speaking_score?: number
          reading_score?: number
          last_assessment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vocabulary_score?: number
          grammar_scores?: Json
          listening_score?: number
          speaking_score?: number
          reading_score?: number
          last_assessment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      affixes: {
        Row: {
          id: string
          type: 'prefix' | 'suffix' | 'root'
          text: string
          meaning: string
          description: string | null
          difficulty: number
          examples: Json
          created_at: string
        }
        Insert: {
          id: string
          type: 'prefix' | 'suffix' | 'root'
          text: string
          meaning: string
          description?: string | null
          difficulty?: number
          examples?: Json
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'prefix' | 'suffix' | 'root'
          text?: string
          meaning?: string
          description?: string | null
          difficulty?: number
          examples?: Json
          created_at?: string
        }
      }
      affix_words: {
        Row: {
          id: string
          affix_id: string
          word: string
          part_of_speech: string | null
          meaning: string
          sentences: Json
          collocations: Json
          difficulty: number
        }
        Insert: {
          id?: string
          affix_id: string
          word: string
          part_of_speech?: string | null
          meaning: string
          sentences?: Json
          collocations?: Json
          difficulty?: number
        }
        Update: {
          id?: string
          affix_id?: string
          word?: string
          part_of_speech?: string | null
          meaning?: string
          sentences?: Json
          collocations?: Json
          difficulty?: number
        }
      }
      affix_progress: {
        Row: {
          id: string
          user_id: string
          affix_id: string
          affix_type: string
          status: string
          mastered_words: number
          total_words: number
          last_practiced: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          affix_id: string
          affix_type: string
          status?: string
          mastered_words?: number
          total_words?: number
          last_practiced?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          affix_id?: string
          affix_type?: string
          status?: string
          mastered_words?: number
          total_words?: number
          last_practiced?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quiz_record: {
        Row: {
          id: string
          user_id: string
          quiz_type: string
          quiz_topic: string | null
          score: number
          total_questions: number
          correct_questions: number
          wrong_questions: Json
          time_spent: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_type: string
          quiz_topic?: string | null
          score: number
          total_questions: number
          correct_questions: number
          wrong_questions?: Json
          time_spent?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quiz_type?: string
          quiz_topic?: string | null
          score?: number
          total_questions?: number
          correct_questions?: number
          wrong_questions?: Json
          time_spent?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
