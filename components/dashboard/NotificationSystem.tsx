'use client'

import { useEffect, useState } from 'react'
import { X, Bell, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react'

interface Notification {
  id: string
  type: 'reminder' | 'encouragement' | 'warning' | 'achievement'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface NotificationSystemProps {
  userName?: string
}

export default function NotificationSystem({ userName = '学习者' }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    // 模拟通知数据
    const defaultNotifications: Notification[] = [
      {
        id: '1',
        type: 'reminder',
        title: '学习提醒',
        message: `${userName}，今天还没学习哦，小猪饿了`,
        timestamp: new Date(),
        read: false
      },
      {
        id: '2',
        type: 'encouragement',
        title: '加油！',
        message: '昨天表现很棒，今天继续加油！',
        timestamp: new Date(Date.now() - 86400000),
        read: true
      },
      {
        id: '3',
        type: 'achievement',
        title: '连续学习 7 天',
        message: '恭喜！连续学习 7 天，小猪升级了！',
        timestamp: new Date(Date.now() - 172800000),
        read: true
      }
    ]

    setNotifications(defaultNotifications)
    setHasUnread(defaultNotifications.some(n => !n.read))

    // 定时检查是否需要发送提醒
    const checkInterval = setInterval(() => {
      const hour = new Date().getHours()
      // 晚上 8 点发送提醒
      if (hour === 20) {
        addNotification({
          id: Date.now().toString(),
          type: 'reminder',
          title: '晚间提醒',
          message: `${userName}，今天还没学习哦，小猪很担心你...`,
          timestamp: new Date(),
          read: false
        })
      }
    }, 3600000) // 每小时检查一次

    return () => clearInterval(checkInterval)
  }, [userName])

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
    setHasUnread(true)
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
    setHasUnread(notifications.some(n => !n.read && n.id !== id))
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Bell className="w-5 h-5 text-blue-500" />
      case 'encouragement':
        return <MessageCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      case 'achievement':
        return <CheckCircle className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bg-blue-50 border-blue-200'
      case 'encouragement':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-orange-50 border-orange-200'
      case 'achievement':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* 通知按钮 */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>

      {/* 通知面板 */}
      {showPanel && (
        <div className="absolute top-12 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold">通知</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">暂无通知</div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 ${getBgColor(notification.type)} ${
                    !notification.read ? 'font-medium' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-600">{notification.message}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {notification.timestamp.toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        dismissNotification(notification.id)
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 弹窗通知 */}
      {notifications
        .filter(n => !n.read)
        .slice(0, 1)
        .map(notification => (
          <div
            key={notification.id}
            className={`absolute top-16 right-0 w-80 p-4 rounded-lg shadow-lg border ${getBgColor(
              notification.type
            )} animate-in slide-in-from-top-2`}
          >
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              <div className="flex-1">
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-gray-600">{notification.message}</div>
              </div>
              <button
                onClick={() => markAsRead(notification.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}
