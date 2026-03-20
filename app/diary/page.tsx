'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MicIcon, RefreshCwIcon, StopIcon } from '@/components/icons'

interface DiaryEntry {
  id: string
  text: string
  correctedText: string
  corrections: Array<{
    original: string
    corrected: string
    explanation: string
  }>
  timestamp: Date
}

export default function VoiceDiaryPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [corrections, setCorrections] = useState<DiaryEntry['corrections']>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [history, setHistory] = useState<DiaryEntry[]>([])

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
        await processAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Recording error:', error)
      alert('无法访问麦克风，请检查权限设置')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)

    // 模拟 AI 处理
    setTimeout(() => {
      const mockResult = {
        transcript: "I go to library yesterday.",
        correctedText: "I went to the library yesterday.",
        corrections: [
          {
            original: "I go",
            corrected: "I went",
            explanation: "yesterday 表示过去时间，动词要用过去式 went"
          },
          {
            original: "to library",
            corrected: "to the library",
            explanation: "library 是可数名词单数，前面需要加冠词 the"
          }
        ]
      }

      setTranscript(mockResult.transcript)
      setCorrectedText(mockResult.correctedText)
      setCorrections(mockResult.corrections)
      setIsProcessing(false)

      // 添加到历史
      setHistory(prev => [{
        id: Date.now().toString(),
        text: mockResult.transcript,
        correctedText: mockResult.correctedText,
        corrections: mockResult.corrections,
        timestamp: new Date()
      }, ...prev])
    }, 2000)
  }

  const reset = () => {
    setTranscript('')
    setCorrectedText('')
    setCorrections([])
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">语音日记</h1>
      <p className="text-gray-600 mb-8">每天用英语说几句话，AI 帮你纠正语法</p>

      {/* 录音区域 */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="flex flex-col items-center">
            {/* 录音按钮 */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-blue-500 hover:bg-blue-600'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRecording ? (
                <StopIcon className="w-10 h-10 text-white" />
              ) : (
                <MicIcon className="w-10 h-10 text-white" />
              )}
            </button>

            <p className="mt-4 text-gray-600">
              {isRecording
                ? '正在录音... 点击停止'
                : isProcessing
                ? '正在处理...'
                : '点击开始录音'}
            </p>

            {isRecording && (
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-500">录音中</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 识别结果 */}
      {transcript && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">识别结果</CardTitle>
            <Button variant="ghost" size="sm" onClick={reset}>
              <RefreshCwIcon className="w-4 h-4 mr-1" /> 重新录制
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 原文 */}
            <div>
              <p className="text-sm text-gray-500 mb-1">你的表达：</p>
              <p className="text-lg text-gray-900 p-3 bg-gray-50 rounded-lg line-through">
                {transcript}
              </p>
            </div>

            {/* 纠正后 */}
            <div>
              <p className="text-sm text-gray-500 mb-1">正确表达：</p>
              <p className="text-lg text-green-700 p-3 bg-green-50 rounded-lg border border-green-200">
                {correctedText}
              </p>
            </div>

            {/* 详细纠正 */}
            {corrections.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">详细解析：</p>
                <div className="space-y-2">
                  {corrections.map((correction, index) => (
                    <div
                      key={index}
                      className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-red-600">{correction.original}</span>
                        <span>→</span>
                        <span className="text-green-600">{correction.corrected}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {correction.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 历史记录 */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">历史记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <p className="text-sm text-gray-900">{entry.correctedText}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {entry.timestamp.toLocaleDateString('zh-CN')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
