'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { VolumeIcon, PlayIcon, PauseIcon, RefreshCwIcon, CheckCircleIcon, ClockIcon, TargetIcon, HeadphonesIcon, EditIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@/components/icons'

interface ListeningMaterial {
  id: string
  title: string
  type: 'cet4' | 'cet6' | 'kaoyan' | 'daily'
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  isCompleted?: boolean
  progress?: number
}

interface DictationSentence {
  id: string
  text: string
  startTime: number
  endTime: number
}

const materials: ListeningMaterial[] = [
  { id: '1', title: '2025年12月四级听力 Section A', type: 'cet4', difficulty: 'medium', duration: 15, isCompleted: true, progress: 100 },
  { id: '2', title: '2025年12月四级听力 Section B', type: 'cet4', difficulty: 'medium', duration: 12, progress: 60 },
  { id: '3', title: '2025年12月六级听力 Conversation 1', type: 'cet6', difficulty: 'hard', duration: 8 },
  { id: '4', title: '考研英语复试听力模拟 Test 1', type: 'kaoyan', difficulty: 'hard', duration: 20 },
  { id: '5', title: '每日英语新闻 - Tech Trends', type: 'daily', difficulty: 'medium', duration: 5, isCompleted: true, progress: 100 },
  { id: '6', title: 'BBC Learning English - Business', type: 'daily', difficulty: 'easy', duration: 6 },
]

const dictationSentences: DictationSentence[] = [
  { id: '1', text: 'The rapid development of artificial intelligence has transformed various industries.', startTime: 0, endTime: 5 },
  { id: '2', text: 'Many experts believe that AI will continue to reshape the way we work and live.', startTime: 6, endTime: 12 },
  { id: '3', text: 'However, there are also concerns about the ethical implications of this technology.', startTime: 13, endTime: 19 },
]

export default function ListeningPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<ListeningMaterial | null>(null)
  const [mode, setMode] = useState<'list' | 'practice' | 'dictation'>('list')
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(120)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [currentSentence, setCurrentSentence] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [dictationResults, setDictationResults] = useState<Array<{sentenceId: string, userText: string, correct: boolean}>>([])
  const [loopMode, setLoopMode] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cet4': return '四级'
      case 'cet6': return '六级'
      case 'kaoyan': return '考研'
      case 'daily': return '日常'
      default: return type
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
    const currentIndex = speeds.indexOf(playbackRate)
    const nextIndex = (currentIndex + 1) % speeds.length
    setPlaybackRate(speeds[nextIndex])
  }

  const checkDictation = () => {
    const sentence = dictationSentences[currentSentence]
    const isCorrect = userInput.trim().toLowerCase() === sentence.text.toLowerCase()
    setDictationResults([...dictationResults, { sentenceId: sentence.id, userText: userInput, correct: isCorrect }])
    setUserInput('')
    if (currentSentence < dictationSentences.length - 1) {
      setCurrentSentence(currentSentence + 1)
    }
  }

  // 模拟播放进度
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (mode === 'practice' && selectedMaterial) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          onClick={() => setMode('list')}
          className="mb-4"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          返回列表
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Badge className={getDifficultyColor(selectedMaterial.difficulty)}>
                  {getTypeLabel(selectedMaterial.type)}
                </Badge>
                <h1 className="text-xl font-bold mt-2">{selectedMaterial.title}</h1>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  {selectedMaterial.duration} 分钟
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* 播放器 */}
            <div className="bg-gray-900 rounded-xl p-6 text-white">
              {/* 进度条 */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Progress value={(currentTime / duration) * 100} className="h-1" />
              </div>

              {/* 控制按钮 */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={handleSpeedChange}
                  className="text-sm font-medium bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-700 transition-colors"
                >
                  {playbackRate}x
                </button>

                <button
                  onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <RefreshCwIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                >
                  {isPlaying ? (
                    <PauseIcon className="w-8 h-8" />
                  ) : (
                    <PlayIcon className="w-8 h-8 ml-1" />
                  )}
                </button>

                <button
                  onClick={() => setLoopMode(!loopMode)}
                  className={`p-2 rounded-full transition-colors ${loopMode ? 'bg-blue-500' : 'hover:bg-gray-800'}`}
                >
                  <RefreshCwIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowSubtitle(!showSubtitle)}
                  className={`p-2 rounded-full transition-colors ${showSubtitle ? 'bg-blue-500' : 'hover:bg-gray-800'}`}
                >
                  <VolumeIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 原文/字幕 */}
            {showSubtitle && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <VolumeIcon className="w-4 h-4" />
                  听力原文
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  The rapid development of artificial intelligence has transformed various industries. Many experts believe that AI will continue to reshape the way we work and live. However, there are also concerns about the ethical implications of this technology.
                </p>
              </div>
            )}

            {/* 模式切换 */}
            <div className="flex gap-4 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setMode('dictation')}
              >
                <EditIcon className="w-4 h-4 mr-2" />
                进入听写模式
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (mode === 'dictation') {
    const sentence = dictationSentences[currentSentence]
    const progress = ((currentSentence) / dictationSentences.length) * 100

    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          onClick={() => setMode('practice')}
          className="mb-4"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          返回练习
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <EditIcon className="w-5 h-5 text-blue-500" />
                听写模式
              </CardTitle>
              <span className="text-sm text-gray-500">
                {currentSentence + 1} / {dictationSentences.length}
              </span>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent>
            {/* 播放器 */}
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6 ml-1" />}
                </button>
                <button
                  onClick={() => setLoopMode(!loopMode)}
                  className={`p-3 rounded-full transition-colors ${loopMode ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'}`}
                >
                  <RefreshCwIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-3">
                点击播放听句子，在下方输入听到的内容
              </p>
            </div>

            {/* 输入区 */}
            <div className="space-y-4">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="在此输入听到的句子..."
                className="w-full p-4 border rounded-lg min-h-[120px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-3">
                <Button
                  onClick={checkDictation}
                  className="flex-1"
                  disabled={!userInput.trim()}
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  提交检查
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setUserInput('')}
                >
                  清空
                </Button>
              </div>
            </div>

            {/* 结果展示 */}
            {dictationResults.length > 0 && (
              <div className="mt-6 border-t pt-6">
                <h3 className="font-medium mb-3">听写结果</h3>
                <div className="space-y-2">
                  {dictationResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${result.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
                    >
                      <div className="flex items-center gap-2">
                        {result.correct ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <RefreshCwIcon className="w-5 h-5 text-red-500" />
                        )}
                        <span className={result.correct ? 'text-green-700' : 'text-red-700'}>
                          句子 {index + 1}: {result.correct ? '正确' : '需要改进'}
                        </span>
                      </div>
                      {!result.correct && (
                        <div className="mt-2 text-sm">
                          <p className="text-red-600">你的答案: {result.userText}</p>
                          <p className="text-green-600">正确答案: {dictationSentences.find(s => s.id === result.sentenceId)?.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">听力训练</h1>
        <p className="text-gray-600">精听四六级、考研真题，支持变速播放和听写模式</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-gray-500">已练听力(篇)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">180</div>
            <div className="text-sm text-gray-500">累计时长(分)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <div className="text-sm text-gray-500">听写正确率</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">0.8x</div>
            <div className="text-sm text-gray-500">平均语速</div>
          </CardContent>
        </Card>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 mb-6">
        {['全部', '四级', '六级', '考研', '日常'].map((filter, index) => (
          <Button
            key={filter}
            variant={index === 0 ? 'default' : 'outline'}
            size="sm"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* 材料列表 */}
      <div className="grid md:grid-cols-2 gap-4">
        {materials.map((material) => (
          <Card
            key={material.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedMaterial(material)
              setMode('practice')
            }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(material.difficulty)}>
                    {getTypeLabel(material.type)}
                  </Badge>
                  {material.isCompleted && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <ClockIcon className="w-4 h-4" />
                  {material.duration}分钟
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2">{material.title}</h3>

              {material.progress && material.progress > 0 && material.progress < 100 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>进度</span>
                    <span>{material.progress}%</span>
                  </div>
                  <Progress value={material.progress} className="h-1" />
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <HeadphonesIcon className="w-4 h-4 mr-1" />
                  精听
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <EditIcon className="w-4 h-4 mr-1" />
                  听写
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
