import { getDb } from '../models/database.js'

export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id)

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id)
    })

    socket.on('task_subscribe', (taskId) => {
      socket.join(`task:${taskId}`)
      console.log(`📋 Socket ${socket.id} subscribed to task ${taskId}`)
    })

    socket.on('task_unsubscribe', (taskId) => {
      socket.leave(`task:${taskId}`)
      console.log(`📋 Socket ${socket.id} unsubscribed from task ${taskId}`)
    })

    socket.on('chat_message', (data) => {
      console.log('💬 Chat message received:', data)
      
      socket.emit('typing', { isTyping: true })
      
      setTimeout(() => {
        socket.emit('typing', { isTyping: false })
        socket.emit('new_message', {
          id: Date.now().toString(),
          role: 'assistant',
          content: '收到消息！',
          timestamp: new Date()
        })
      }, 1000)
    })
  })

  setInterval(() => {
    checkUpcomingDeadlines(io)
  }, 60000)

  console.log('✅ WebSocket server initialized')
}

function checkUpcomingDeadlines(io) {
  try {
    const db = getDb()
    
    const oneHourLater = new Date()
    oneHourLater.setHours(oneHourLater.getHours() + 1)
    
    const upcomingTasks = db.prepare(`
      SELECT * FROM tasks 
      WHERE status != 'done' 
        AND deadline IS NOT NULL 
        AND deadline <= ?
        AND deadline > ?
    `).all(oneHourLater.toISOString(), new Date().toISOString())

    upcomingTasks.forEach(task => {
      io.emit('reminder', {
        type: 'deadline_approaching',
        task: task,
        message: `⏰ 任务 "${task.title}" 还有1小时就要到期啦！`
      })
    })
  } catch (error) {
    console.error('Error checking deadlines:', error)
  }
}

export function notifyTaskUpdate(io, task, type) {
  io.emit('task_update', {
    type,
    task,
    timestamp: new Date()
  })
}
