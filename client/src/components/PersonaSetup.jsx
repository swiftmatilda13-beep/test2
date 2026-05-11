import React, { useState } from 'react'
import { Sparkles, Heart, Zap, Coffee } from 'lucide-react'

const PERSONA_QUESTIONS = [
  {
    id: 'name',
    question: '想给你的专属助手起什么名字呢？',
    placeholder: '例如：小智、阿明、灵犀...',
    icon: Sparkles
  },
  {
    id: 'tone',
    question: '你喜欢什么风格的助手？',
    options: [
      { value: 'gentle', label: '温柔鼓励型', desc: '总是给你温暖的鼓励', icon: Heart },
      { value: 'motivational', label: '激励奋进型', desc: '充满正能量，推动你前进', icon: Zap },
      { value: 'humorous', label: '幽默风趣型', desc: '轻松愉快，让工作不再枯燥', icon: Coffee }
    ]
  },
  {
    id: 'greeting',
    question: '希望助手怎么称呼你？',
    placeholder: '例如：老板、老大、亲爱的...',
    icon: Heart
  }
]

export default function PersonaSetup({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    tone: 'gentle',
    greeting: ''
  })
  const [inputValue, setInputValue] = useState('')

  const question = PERSONA_QUESTIONS[currentStep]

  const handleOptionSelect = (value) => {
    setFormData({ ...formData, [question.id]: value })
  }

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      setFormData({ ...formData, [question.id]: inputValue.trim() })
      setInputValue('')
    }
  }

  const handleNext = () => {
    const currentValue = question.id === 'tone' ? formData.tone : formData[question.id]
    if (!currentValue) return

    if (currentStep < PERSONA_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      const greetingMessages = {
        gentle: `好的，${formData.greeting || '主人'}！从现在起，我会一直陪伴在你身边，让我们一起把每件事都做好 🌟`,
        motivational: `${formData.greeting || '伙伴'}！准备好了吗？让我们一起创造奇迹！💪`,
        humorous: `哈哈，${formData.greeting || '朋友'}！有我在，工作再也不无聊啦！😄`
      }
      
      onComplete({
        ...formData,
        greeting: greetingMessages[formData.tone]
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full mb-6 animate-pulse-soft">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">
            欢迎来到你的专属助手
          </h1>
          <p className="text-gray-500 text-lg">
            让我们花几分钟，打造最懂你的AI搭档
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {PERSONA_QUESTIONS.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx <= currentStep
                  ? 'w-12 bg-gradient-to-r from-primary-400 to-secondary-500'
                  : 'w-6 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Question Card */}
        <div className="card p-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
              {React.createElement(question.icon, {
                className: 'w-6 h-6 text-primary-500'
              })}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {question.question}
            </h2>
          </div>

          {/* Input Type */}
          {question.options ? (
            <div className="grid grid-cols-1 gap-4">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    formData[question.id] === option.value
                      ? 'border-secondary-500 bg-secondary-50 shadow-md scale-[1.02]'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      formData[question.id] === option.value
                        ? 'bg-secondary-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {React.createElement(option.icon, { className: 'w-5 h-5' })}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                placeholder={question.placeholder}
                className="input-field text-lg"
                autoFocus
              />
              {inputValue && (
                <p className="mt-3 text-primary-500 animate-fade-in">
                  好的，{inputValue}！
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleNext}
              disabled={question.options ? !formData[question.id] : !inputValue.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {currentStep < PERSONA_QUESTIONS.length - 1 ? '下一步 →' : '完成设置 🎉'}
            </button>
          </div>
        </div>

        {/* Preview */}
        {formData.name && (
          <div className="mt-6 text-center animate-fade-in">
            <p className="text-gray-500 mb-2">助手预览</p>
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{formData.name[0]}</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">{formData.name}</div>
                <div className="text-xs text-gray-500">
                  {formData.tone === 'gentle' && '🌟 温柔鼓励型'}
                  {formData.tone === 'motivational' && '💪 激励奋进型'}
                  {formData.tone === 'humorous' && '😄 幽默风趣型'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
