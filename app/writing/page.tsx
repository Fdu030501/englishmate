'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CameraIcon, UploadIcon, CheckCircleIcon, AlertCircleIcon, BookIcon, EditIcon, TargetIcon, StarIcon, RefreshCwIcon, ChevronRightIcon } from '@/components/icons'

interface EssayCorrection {
  score: number
  grammar: {
    score: number
    issues: Array<{
      line: number
      original: string
      correction: string
      explanation: string
    }>
  }
  vocabulary: {
    score: number
    comments: string
    suggestions: string[]
  }
  structure: {
    score: number
    comments: string
    suggestions: string[]
  }
  logic: {
    score: number
    comments: string
  }
  overall: string
  improvedVersion: string
}

const essayTypes = [
  { id: 'kaoyan-1', name: '考研英语一', description: '图画作文，200词左右' },
  { id: 'kaoyan-2', name: '考研英语二', description: '图表作文，150词左右' },
  { id: 'cet-4', name: '四级作文', description: '120-180词' },
  { id: 'cet-6', name: '六级作文', description: '150-200词' },
]

export default function WritingPage() {
  const [selectedType, setSelectedType] = useState(essayTypes[0].id)
  const [essayText, setEssayText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [correction, setCorrection] = useState<EssayCorrection | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'grammar' | 'vocabulary' | 'structure'>('overview')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 模拟图片识别（实际应调用 OCR API）
      setEssayText('图片已上传，正在识别文字...')
      setTimeout(() => {
        setEssayText('In recent years, the phenomenon of online learning has become increasingly prevalent. As is vividly shown in the picture, more and more students choose to study online. There are several reasons for this trend.')
      }, 1500)
    }
  }

  const analyzeEssay = async () => {
    if (!essayText.trim() || essayText.length < 50) {
      alert('请至少输入50词的作文内容')
      return
    }

    setIsAnalyzing(true)

    // 模拟 AI 批改（实际应调用 API）
    setTimeout(() => {
      setCorrection({
        score: 78,
        grammar: {
          score: 75,
          issues: [
            {
              line: 1,
              original: 'As is vividly shown in the picture',
              correction: 'As is vividly depicted in the picture',
              explanation: '"depicted" 比 "shown" 更正式，适合学术写作'
            },
            {
              line: 2,
              original: 'more and more students',
              correction: 'an increasing number of students',
              explanation: '避免使用口语化的 "more and more"，改用更正式的表达'
            }
          ]
        },
        vocabulary: {
          score: 80,
          comments: '词汇使用基本准确，但可以更丰富多样',
          suggestions: ['prevalent → widespread', 'choose → opt for', 'reasons → contributing factors']
        },
        structure: {
          score: 82,
          comments: '结构清晰，有明确的开头、主体和结尾',
          suggestions: ['第二段可以增加一个过渡句', '结尾可以更有力地总结观点']
        },
        logic: {
          score: 75,
          comments: '逻辑基本连贯，但论证可以更充分'
        },
        overall: '这是一篇中等偏上的作文，语言表达基本准确，结构清晰。建议在词汇多样性和论证深度上继续提升。',
        improvedVersion: 'In recent years, the phenomenon of online learning has become increasingly widespread. As is vividly depicted in the picture, an increasing number of students opt to study online. Several contributing factors account for this trend. Firstly, the flexibility of online learning allows students to study at their own pace...'
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return '优秀'
    if (score >= 70) return '良好'
    if (score >= 60) return '及格'
    return '需改进'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI 作文批改</h1>
        <p className="text-gray-600">拍照上传或输入作文，AI 从语法、词汇、逻辑、结构多维度批改</p>
      </div>

      {/* 作文类型选择 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TargetIcon className="w-5 h-5 text-blue-500" />
            选择作文类型
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {essayTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium mb-1">{type.name}</div>
                <div className="text-xs text-gray-500">{type.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 左侧：输入区 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <EditIcon className="w-5 h-5 text-purple-500" />
                  输入作文
                </CardTitle>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CameraIcon className="w-4 h-4 mr-1" />
                    拍照
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="在此输入或粘贴你的作文..."
                className="min-h-[400px] resize-none"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {essayText.length} 字符
                </span>
                <Button
                  onClick={analyzeEssay}
                  disabled={isAnalyzing || essayText.length < 50}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
                      AI 批改中...
                    </>
                  ) : (
                    <>
                      <StarIcon className="w-4 h-4 mr-2" />
                      开始批改
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：批改结果 */}
        <div>
          {correction ? (
            <Card className="h-full">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    批改结果
                  </CardTitle>
                  <div className={`px-4 py-2 rounded-full border font-bold text-xl ${getScoreColor(correction.score)}`}>
                    {correction.score}分
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{getScoreLabel(correction.score)}</p>
              </CardHeader>
              <CardContent className="p-0">
                {/* 标签页 */}
                <div className="flex border-b">
                  {[
                    { id: 'overview', label: '总评', icon: BookIcon },
                    { id: 'grammar', label: '语法', icon: AlertCircleIcon },
                    { id: 'vocabulary', label: '词汇', icon: StarIcon },
                    { id: 'structure', label: '结构', icon: TargetIcon },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-1 transition-colors ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                      {tab.id !== 'overview' && (
                        <span className={`ml-1 text-xs px-1.5 py-0.5 rounded ${getScoreColor(correction[tab.id as keyof EssayCorrection] as any)}`}>
                          {(correction[tab.id as keyof EssayCorrection] as any)?.score || 0}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* 内容区 */}
                <div className="p-4">
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">{correction.overall}</p>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">语法</div>
                          <div className="text-2xl font-bold text-blue-600">{correction.grammar.score}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">词汇</div>
                          <div className="text-2xl font-bold text-purple-600">{correction.vocabulary.score}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">结构</div>
                          <div className="text-2xl font-bold text-green-600">{correction.structure.score}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">逻辑</div>
                          <div className="text-2xl font-bold text-orange-600">{correction.logic.score}</div>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                          <EditIcon className="w-4 h-4" />
                          改进版本
                        </h4>
                        <p className="text-sm text-green-700 leading-relaxed">{correction.improvedVersion}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'grammar' && (
                    <div className="space-y-3">
                      {correction.grammar.issues.map((issue, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm line-through text-red-600">{issue.original}</p>
                              <p className="text-sm font-medium text-green-600">{issue.correction}</p>
                              <p className="text-xs text-gray-600 mt-1">{issue.explanation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'vocabulary' && (
                    <div className="space-y-4">
                      <p className="text-gray-700">{correction.vocabulary.comments}</p>
                      <div>
                        <h4 className="font-medium mb-2">词汇替换建议：</h4>
                        <div className="space-y-2">
                          {correction.vocabulary.suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                              <ChevronRightIcon className="w-4 h-4 text-purple-500" />
                              <span className="text-sm">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'structure' && (
                    <div className="space-y-4">
                      <p className="text-gray-700">{correction.structure.comments}</p>
                      <div>
                        <h4 className="font-medium mb-2">结构优化建议：</h4>
                        <ul className="space-y-2">
                          {correction.structure.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[500px]">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <EditIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">暂无批改结果</h3>
                <p className="text-sm text-gray-500">输入作文并点击"开始批改"查看结果</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
