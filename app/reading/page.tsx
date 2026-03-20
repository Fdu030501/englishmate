'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookIcon, ClockIcon, TargetIcon, ChevronLeftIcon, ChevronRightIcon, BookmarkIcon, HighlighterIcon, MessageCircleIcon, CheckCircleIcon, BrainIcon } from '@/components/icons'

interface Article {
  id: string
  title: string
  source: string
  date: string
  difficulty: 'easy' | 'medium' | 'hard'
  wordCount: number
  excerpt: string
  tags: string[]
  readTime: number
  isCompleted?: boolean
}

interface DifficultSentence {
  id: string
  text: string
  translation: string
  grammarAnalysis: string
  keyPoints: string[]
}

const articles: Article[] = [
  {
    id: '1',
    title: 'The Future of Remote Work',
    source: 'The Economist',
    date: '2026-03-18',
    difficulty: 'medium',
    wordCount: 450,
    excerpt: 'As companies grapple with the post-pandemic workplace, a new consensus is emerging about the future of remote work...',
    tags: ['职场', '科技', '社会'],
    readTime: 8,
    isCompleted: true
  },
  {
    id: '2',
    title: 'Climate Change: A Global Challenge',
    source: 'The Guardian',
    date: '2026-03-17',
    difficulty: 'hard',
    wordCount: 620,
    excerpt: 'Scientists warn that global temperatures are rising faster than previously predicted, with consequences...',
    tags: ['环境', '科学', '政治'],
    readTime: 12
  },
  {
    id: '3',
    title: 'The Rise of Artificial Intelligence',
    source: 'The New York Times',
    date: '2026-03-16',
    difficulty: 'medium',
    wordCount: 380,
    excerpt: 'From healthcare to education, AI is transforming every aspect of our lives, raising both hopes and concerns...',
    tags: ['科技', 'AI', '未来'],
    readTime: 6
  },
  {
    id: '4',
    title: 'Education Reform in the Digital Age',
    source: 'The Atlantic',
    date: '2026-03-15',
    difficulty: 'easy',
    wordCount: 320,
    excerpt: 'Schools around the world are rethinking their approach to education, incorporating new technologies...',
    tags: ['教育', '科技', '改革'],
    readTime: 5
  }
]

const difficultSentences: DifficultSentence[] = [
  {
    id: '1',
    text: 'As companies grapple with the post-pandemic workplace, a new consensus is emerging about the future of remote work that challenges traditional assumptions about productivity and collaboration.',
    translation: '随着企业努力应对疫情后的工作场所，关于远程工作未来的新共识正在形成，这对有关生产力和协作的传统假设提出了挑战。',
    grammarAnalysis: '主句：a new consensus is emerging\n从句：As companies grapple with...（时间状语从句）\n定语从句：that challenges...（修饰consensus）',
    keyPoints: ['grapple with: 努力应对', 'consensus: 共识', 'challenge assumptions: 挑战假设']
  },
  {
    id: '2',
    text: 'While some executives remain skeptical about the long-term viability of fully remote arrangements, the data suggests that hybrid models may offer the best of both worlds.',
    translation: '虽然一些高管对完全远程安排的长期可行性持怀疑态度，但数据表明混合模式可能提供两全其美的方案。',
    grammarAnalysis: '让步状语从句：While some executives remain skeptical...\n主句：the data suggests...\n宾语从句：that hybrid models may offer...',
    keyPoints: ['skeptical: 怀疑的', 'viability: 可行性', 'hybrid: 混合的', 'the best of both worlds: 两全其美']
  }
]

export default function ReadingPage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [activeTab, setActiveTab] = useState<'article' | 'sentences' | 'vocabulary'>('article')
  const [selectedSentence, setSelectedSentence] = useState<DifficultSentence | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [bookmarkedSentences, setBookmarkedSentences] = useState<string[]>([])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单'
      case 'medium': return '中等'
      case 'hard': return '困难'
      default: return difficulty
    }
  }

  const toggleBookmark = (sentenceId: string) => {
    setBookmarkedSentences(prev =>
      prev.includes(sentenceId)
        ? prev.filter(id => id !== sentenceId)
        : [...prev, sentenceId]
    )
  }

  if (selectedArticle) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          onClick={() => setSelectedArticle(null)}
          className="mb-4"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          返回文章列表
        </Button>

        {/* 文章头部 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getDifficultyColor(selectedArticle.difficulty)}>
                    {getDifficultyLabel(selectedArticle.difficulty)}
                  </Badge>
                  <span className="text-sm text-gray-500">{selectedArticle.source}</span>
                  <span className="text-sm text-gray-400">{selectedArticle.date}</span>
                </div>
                <h1 className="text-2xl font-bold">{selectedArticle.title}</h1>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  {selectedArticle.readTime} 分钟
                </div>
                <div>{selectedArticle.wordCount} 词</div>
              </div>
            </div>

            {/* 阅读进度 */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>阅读进度</span>
                <span>{readingProgress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 标签页 */}
        <div className="flex border-b mb-6">
          {[
            { id: 'article', label: '文章阅读', icon: BookIcon },
            { id: 'sentences', label: '长难句', icon: HighlighterIcon },
            { id: 'vocabulary', label: '重点词汇', icon: TargetIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        {activeTab === 'article' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-lg leading-relaxed text-gray-700 mb-4">
                      As companies grapple with the post-pandemic workplace, a new consensus is emerging about the future of remote work that challenges traditional assumptions about productivity and collaboration.
                    </p>
                    <p className="leading-relaxed text-gray-700 mb-4">
                      The pandemic forced a massive experiment in remote work, and the results have been surprising. While some executives remain skeptical about the long-term viability of fully remote arrangements, the data suggests that hybrid models may offer the best of both worlds.
                    </p>
                    <p className="leading-relaxed text-gray-700 mb-4">
                      A growing body of research indicates that remote work can actually increase productivity for many types of tasks, particularly those requiring deep focus and concentration. However, the benefits are not universal, and certain activities—such as brainstorming sessions and team-building exercises—may still benefit from in-person interaction.
                    </p>
                    <p className="leading-relaxed text-gray-700">
                      The challenge for organizations is to find the right balance between flexibility and structure, ensuring that employees have the autonomy they crave while maintaining the cohesion and culture that drive long-term success.
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <Button
                      onClick={() => setReadingProgress(100)}
                      className="w-full"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      标记为已读
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BrainIcon className="w-4 h-4 text-purple-500" />
                    阅读技巧
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 先读标题和首尾段把握主旨</li>
                    <li>• 长难句先找主谓宾</li>
                    <li>• 不认识的词先猜意思</li>
                    <li>• 注意转折词（but, however）</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">文章信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">来源</span>
                      <span>{selectedArticle.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">难度</span>
                      <span>{getDifficultyLabel(selectedArticle.difficulty)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">字数</span>
                      <span>{selectedArticle.wordCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">阅读时间</span>
                      <span>{selectedArticle.readTime}分钟</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'sentences' && (
          <div className="space-y-4">
            {difficultSentences.map((sentence) => (
              <Card key={sentence.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-gray-800 leading-relaxed flex-1">{sentence.text}</p>
                      <button
                        onClick={() => toggleBookmark(sentence.id)}
                        className={`p-2 rounded-full transition-colors ${
                          bookmarkedSentences.includes(sentence.id)
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'hover:bg-gray-200 text-gray-400'
                        }`}
                      >
                        <BookmarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">翻译</h4>
                      <p className="text-gray-700">{sentence.translation}</p>
                    </div>
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">语法分析</h4>
                      <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">{sentence.grammarAnalysis}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">重点词汇</h4>
                      <div className="flex flex-wrap gap-2">
                        {sentence.keyPoints.map((point, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'vocabulary' && (
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { word: 'grapple', meaning: '努力解决', example: 'grapple with a problem' },
                  { word: 'consensus', meaning: '共识', example: 'reach a consensus' },
                  { word: 'viability', meaning: '可行性', example: 'economic viability' },
                  { word: 'hybrid', meaning: '混合的', example: 'hybrid model' },
                  { word: 'skeptical', meaning: '怀疑的', example: 'be skeptical about' },
                  { word: 'cohesion', meaning: '凝聚力', example: 'social cohesion' },
                ].map((item, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-blue-600 mb-1">{item.word}</div>
                    <div className="text-sm text-gray-600 mb-1">{item.meaning}</div>
                    <div className="text-xs text-gray-400">{item.example}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">外刊精读</h1>
        <p className="text-gray-600">精选经济学人、卫报、纽约时报等外刊，提升阅读能力</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-500">已读文章</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-500">本周完成</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-sm text-gray-500">累计词汇</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">48</div>
            <div className="text-sm text-gray-500">阅读时长(分)</div>
          </CardContent>
        </Card>
      </div>

      {/* 文章列表 */}
      <div className="grid md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedArticle(article)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <Badge className={getDifficultyColor(article.difficulty)}>
                  {getDifficultyLabel(article.difficulty)}
                </Badge>
                {article.isCompleted && (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                )}
              </div>

              <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span>{article.source}</span>
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  {article.readTime}分钟
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
