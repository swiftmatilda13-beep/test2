import React from 'react'
import { Sparkles, Settings } from 'lucide-react'

export default function Header({ persona }) {
  return (
    <header className="glass-effect border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">
              产品运营助手
            </h1>
            <p className="text-sm text-gray-500">
              你的靠谱搭档，随时待命
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {persona && (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {persona.name[0]}
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {persona.name}
                </div>
                <div className="text-xs text-gray-500">
                  {persona.greeting}
                </div>
              </div>
            </div>
          )}
          
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  )
}
