import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { Send, Loader2 } from 'lucide-react'

export default function ChatInterface({ persona }) {
  const { messages, sendMessage, isTyping } = useStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const messageText = input.trim()
    setInput('')
    await sendMessage(messageText)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">{persona?.name?.[0] || 'A'}</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-800">{persona?.name || 'AI助手'}</h2>
            <p className="text-sm text-gray-500">
              {isTyping ? '正在输入...' : '在线'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              嗨，有什么可以帮你的？
            </h3>
            <p className="text-gray-500 mb-6">
              发送任务给我，我会帮你整理并设置提醒
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                🎯 "完成产品调研报告，P1优先级"
              </span>
              <span className="px-3 py-1 bg-secondary-50 text-secondary-600 rounded-full text-sm">
                📅 "周五前提交季度总结"
              </span>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="chat-bubble chat-bubble-assistant">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-gray-500 text-sm">正在思考...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t p-4 bg-gray-50">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="输入消息或任务描述..."
            className="input-field flex-1"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-6"
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                发送
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          试试发送：「周五前完成用户调研报告，P0优先级」
        </p>
      </form>
    </div>
  )
}
