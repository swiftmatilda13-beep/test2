import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { CheckCircle2, Circle, Clock, AlertCircle, Trash2 } from 'lucide-react'

const PRIORITY_CONFIG = {
  P0: { color: 'bg-red-500', label: '紧急', textColor: 'text-red-600' },
  P1: { color: 'bg-amber-500', label: '重要', textColor: 'text-amber-600' },
  P2: { color: 'bg-green-500', label: '普通', textColor: 'text-green-600' },
  P3: { color: 'bg-blue-500', label: '低优', textColor: 'text-blue-600' }
}

export default function TaskSidebar() {
  const { tasks, updateTask, deleteTask } = useStore()
  const [filter, setFilter] = useState('all')

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'todo') return task.status === 'todo'
    if (filter === 'in_progress') return task.status === 'in_progress'
    if (filter === 'done') return task.status === 'done'
    if (filter === 'P0') return task.priority === 'P0'
    if (filter === 'P1') return task.priority === 'P1'
    return true
  })

  const handleStatusChange = async (task, newStatus) => {
    await updateTask(task.id, { status: newStatus })
  }

  const handleDelete = async (taskId) => {
    if (window.confirm('确定要删除这个任务吗？')) {
      await deleteTask(taskId)
    }
  }

  const getTimeRemaining = (deadline) => {
    if (!deadline) return null
    const now = new Date()
    const end = new Date(deadline)
    const diff = end - now
    
    if (diff < 0) return '已过期'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}天${hours}小时`
    if (hours > 0) return `${hours}小时`
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${minutes}分钟`
  }

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Filter Tabs */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-2">
          {['all', 'todo', 'in_progress', 'done', 'P0', 'P1'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-primary-400 to-secondary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {f === 'all' && '全部'}
              {f === 'todo' && '待办'}
              {f === 'in_progress' && '进行中'}
              {f === 'done' && '已完成'}
              {f === 'P0' && '🔥 P0'}
              {f === 'P1' && '⭐ P1'}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-gray-500 text-sm">
              {filter === 'all' ? '还没有任务哦~' : '没有符合筛选条件的任务'}
            </p>
          </div>
        )}

        {filteredTasks.map(task => {
          const priority = PRIORITY_CONFIG[task.priority]
          const timeRemaining = getTimeRemaining(task.deadline)
          
          return (
            <div
              key={task.id}
              className={`card border-l-4 ${priority.color} hover:shadow-lg transition-all group`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleStatusChange(task, task.status === 'done' ? 'todo' : 'done')}
                  className="mt-1 hover:scale-110 transition-transform"
                >
                  {task.status === 'done' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : task.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 hover:text-primary-500" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-gray-800 ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${priority.color} text-white`}>
                      {task.priority}
                    </span>
                    
                    {timeRemaining && (
                      <span className={`text-xs flex items-center gap-1 ${
                        timeRemaining === '已过期' ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {timeRemaining}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="p-4 border-t bg-gray-50">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-500">
              {tasks.filter(t => t.status === 'todo').length}
            </div>
            <div className="text-xs text-gray-500">待办</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-500">
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
            <div className="text-xs text-gray-500">进行中</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">
              {tasks.filter(t => t.status === 'done').length}
            </div>
            <div className="text-xs text-gray-500">已完成</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
