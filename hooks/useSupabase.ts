import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useSupabase() {
  return createClient()
}

export function useAffixes() {
  const [affixes, setAffixes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAffixes() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('affixes')
          .select('*')
          .order('difficulty', { ascending: true })

        if (error) throw error
        setAffixes(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch affixes')
      } finally {
        setLoading(false)
      }
    }

    fetchAffixes()
  }, [])

  return { affixes, loading, error }
}

export function useAffixDetail(id: string) {
  const [affix, setAffix] = useState<any>(null)
  const [words, setWords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAffixDetail() {
      try {
        const supabase = createClient()

        // Fetch affix
        const { data: affixData, error: affixError } = await supabase
          .from('affixes')
          .select('*')
          .eq('id', id)
          .single()

        if (affixError) throw affixError
        setAffix(affixData)

        // Fetch derived words
        const { data: wordsData, error: wordsError } = await supabase
          .from('affix_words')
          .select('*')
          .eq('affix_id', id)
          .order('difficulty', { ascending: true })

        if (wordsError) throw wordsError
        setWords(wordsData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch affix detail')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchAffixDetail()
  }, [id])

  return { affix, words, loading, error }
}

export function useUserProgress(userId?: string) {
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProgress() {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('user_profile')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (error) throw error
        setProgress(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch progress')
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [userId])

  return { progress, loading, error }
}

export function useQuizHistory(userId?: string) {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHistory() {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('quiz_record')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) throw error
        setHistory(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quiz history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [userId])

  return { history, loading, error }
}
