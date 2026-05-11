import React from 'react'
import { useStore } from '../store/useStore'
import { Calendar, Clock } from 'lucide-react'

export default function Timeline() {
  const { tasks } = useStore()

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayTasks = tasks.filter(task => {
    if (!task.deadline || task.status === 'done') return false
    const deadline = new Date(task.deadline)
    return deadline.toDateString() === today.toDateString()
  })

  const upcomingTasks = tasks.filter(task => {
    if (!task.deadline || task.status === 'done') return false
    const deadline = new Date(task.deadline)
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    return diffDays > 0 && diffDays <= 7
  }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

  const overdueTasks = tasks.filter(task => {
    if (!task.deadline || task.status === 'done') return false
    return new Date(task.deadline) < today
  })

  const formatDate = (date) => {
    const d = new Date(date)
    const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
    return `${d.getMonth() + 1}月${d.getDate()}日 ${weekday}`
  }

  const getTimeSlot = (date) => {
    const hour = new Date(date).getHours()
    if (hour < 12) return '上午'
    if (hour < 18) return '下午'
    return '晚上'
  }

  return (
    <aside className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary-500" />
        时间线
      </h2>

      {/* Overdue Warning */}
      {overdueTasks.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500 text-lg">⚠️</span>
            <span className="font-semibold text-red-600">已过期任务</span>
          </div>
          <div className="space-y-2">
            {overdueTasks.map(task => (
              <div key={task.id} className="text-sm text-red-700 bg-white p-2 rounded">
                {task.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          今天 · {formatDate(today)}
        </h3>
        {todayTasks.length === 0 ? (
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 text-center">
            <span className="text-3xl mb-2 block">🎉</span>
            <p className="text-sm text-gray-600">今天没有待办啦！</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map(task => (
              <div key={task.id} className="bg-gradient-to-r from-primary-50 to-primary-100 p-3 rounded-xl border-l-4 border-primary-500">
                <div className="font-medium text-gray-800">{task.title}</div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-white text-xs ${
                    task.priority === 'P0' ? 'bg-red-500' :
                    task.priority === 'P1' ? 'bg-amber-500' :
                    task.priority === 'P2' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {task.priority}
                  </span>
                  <span>{getTimeSlot(task.deadline)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          📅 接下来7天
        </h3>
        {upcomingTasks.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">接下来一周没有任务安排</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map(task => {
              const daysUntil = Math.ceil((new Date(task.deadline) - today) / (1000 * 60 * 60 * 24))
              
              return (
                <div key={task.id} className="bg-white border border-gray-200 p-3 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{task.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatDate(task.deadline)}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium text-white ${
                      daysUntil <= 1 ? 'bg-red-500 animate-pulse' :
                      daysUntil <= 3 ? 'bg-amber-500' : 'bg-secondary-500'
                    }`}>
                      {daysUntil === 1 ? '明天' : `${daysUntil}天`}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Weekly Overview */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">📊 本周概览</h3>
        <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-secondary-600">
                {upcomingTasks.filter(t => new Date(t.deadline).getDay() === today.getDay() + 1 || (today.getDay() === 6 && new Date(t.deadline).getDay() === 0)).length}
              </div>
              <div className="text-xs text-gray-500">明天</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {tasks.filter(t => !t.deadline || t.status !== 'done').length}
              </div>
              <div className="text-xs text-gray-500">总任务</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
