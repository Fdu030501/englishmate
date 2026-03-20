import { QuizQuestion } from '@/types'

export interface QuizGenerationParams {
  affixId: string
  affixText: string
  affixMeaning: string
  derivedWords: string[]
  difficulty: number
}

const QUIZ_GENERATION_PROMPT = `你是一位英语测试专家。请根据以下词缀信息生成 5 道小测试题：

词缀：{affixText}
含义：{affixMeaning}
衍生词：{derivedWords}

要求：
- 2 道选择题（考察词缀含义）
- 2 道填空题（考察单词运用）
- 1 道造句题（考察综合运用）
- 难度适中，适合考研英语备考
- 输出 JSON 格式

输出格式：
{
  "questions": [
    {
      "type": "multiple_choice",
      "question": "词缀 '{affixText}' 的含义是？",
      "options": ["再次", "不，相反", "向前", "共同"],
      "answer": "不，相反",
      "explanation": "{affixText} 表示否定，如 unhappy(不快乐的)"
    },
    ...
  ]
}`

export async function generateQuiz(params: QuizGenerationParams): Promise<QuizQuestion[]> {
  const prompt = QUIZ_GENERATION_PROMPT
    .replace('{affixText}', params.affixText)
    .replace('{affixMeaning}', params.affixMeaning)
    .replace('{derivedWords}', params.derivedWords.join(', '))

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位英语测试专家，擅长生成结构化的测试题目。请只输出 JSON 格式，不要输出其他内容。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || '{}'

    // Parse the JSON response
    const quizData = JSON.parse(content)
    return quizData.questions || []
  } catch (error) {
    console.error('Failed to generate quiz:', error)
    // Return fallback quiz
    return generateFallbackQuiz(params)
  }
}

function generateFallbackQuiz(params: QuizGenerationParams): QuizQuestion[] {
  const words = params.derivedWords.slice(0, 4)
  return [
    {
      type: 'multiple_choice',
      question: `词缀 '${params.affixText}' 的含义是？`,
      options: [params.affixMeaning, '相反的', '增强的', '减弱的'],
      answer: params.affixMeaning,
      explanation: `${params.affixText} 表示 ${params.affixMeaning}`
    },
    {
      type: 'multiple_choice',
      question: `以下哪个单词包含词缀 '${params.affixText}'？`,
      options: [words[0] || 'unknown', 'other', 'different', 'unrelated'],
      answer: words[0] || 'unknown',
      explanation: `${words[0]} 包含词缀 ${params.affixText}`
    },
    {
      type: 'fill_blank',
      question: `用适当形式填空：I am ___ (happy) with the result.`,
      answer: 'unhappy',
      explanation: '根据句意，应该用 unhappy 表示不满意'
    },
    {
      type: 'fill_blank',
      question: `用适当形式填空：It is ___ (possible) to finish in one day.`,
      answer: 'impossible',
      explanation: '根据句意，应该用 impossible 表示不可能'
    },
    {
      type: 'translation',
      question: `翻译："不可能的" 英文是？`,
      answer: 'impossible',
      explanation: 'impossible = 不可能的'
    }
  ]
}

export interface GrammarAnalysisResult {
  weakAreas: string[]
  scores: Record<string, number>
  recommendations: string[]
}

export async function analyzeGrammarPerformance(
  answers: Array<{ topic: string; correct: boolean }>
): Promise<GrammarAnalysisResult> {
  const topicScores: Record<string, { correct: number; total: number }> = {}

  answers.forEach(({ topic, correct }) => {
    if (!topicScores[topic]) {
      topicScores[topic] = { correct: 0, total: 0 }
    }
    topicScores[topic].total++
    if (correct) {
      topicScores[topic].correct++
    }
  })

  const scores: Record<string, number> = {}
  const weakAreas: string[] = []

  Object.entries(topicScores).forEach(([topic, data]) => {
    scores[topic] = Math.round((data.correct / data.total) * 100)
    if (scores[topic] < 60) {
      weakAreas.push(topic)
    }
  })

  const recommendations = weakAreas.map(area =>
    `建议重点复习：${area}，多做相关练习`
  )

  return { weakAreas, scores, recommendations }
}
