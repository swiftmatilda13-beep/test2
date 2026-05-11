import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDb } from '../models/database.js'

const router = express.Router()

const PRIORITY_KEYWORDS = {
  P0: ['紧急', '立刻', '马上', '立即', '最高', '最紧急', 'critical', 'urgent', 'ASAP'],
  P1: ['重要', '优先', '关键', '主要', '必须', '重要', 'important', 'high'],
  P2: ['普通', '一般', '正常', '常规', '平时', 'normal', 'regular', 'medium'],
  P3: ['低', '次要', '不急', '有空', '可选', 'optional', 'low']
}

const TIME_PATTERNS = {
  today: /今天|今日|今天内/,
  tomorrow: /明天|明日/,
  thisWeek: /本周|这周|本周内/,
  nextWeek: /下周|下周/,
  month: /本月|这个月/,
  friday: /周五|星期五/,
  saturday: /周六|星期六/,
  sunday: /周日|星期日|周末/
}

function extractPriority(text) {
  const upperText = text.toUpperCase()
  
  for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    if (keywords.some(keyword => upperText.includes(keyword.toUpperCase()))) {
      return priority
    }
  }
  
  return 'P2'
}

function extractDeadline(text) {
  const now = new Date()
  let deadline = null

  if (TIME_PATTERNS.today.test(text)) {
    deadline = new Date(now)
    deadline.setHours(23, 59, 59, 999)
  } else if (TIME_PATTERNS.tomorrow.test(text)) {
    deadline = new Date(now)
    deadline.setDate(deadline.getDate() + 1)
    deadline.setHours(23, 59, 59, 999)
  } else if (TIME_PATTERNS.friday.test(text)) {
    deadline = new Date(now)
    const currentDay = now.getDay()
    const daysUntilFriday = (5 - currentDay + 7) % 7 || 7
    deadline.setDate(deadline.getDate() + daysUntilFriday)
    deadline.setHours(18, 0, 0, 0)
  } else if (TIME_PATTERNS.saturday.test(text) || TIME_PATTERNS.sunday.test(text)) {
    deadline = new Date(now)
    const currentDay = now.getDay()
    let daysUntil = 6 - currentDay
    if (daysUntil <= 0) daysUntil += 7
    deadline.setDate(deadline.getDate() + daysUntil)
    deadline.setHours(18, 0, 0, 0)
  } else if (TIME_PATTERNS.thisWeek.test(text)) {
    deadline = new Date(now)
    const daysUntilSunday = 7 - now.getDay()
    deadline.setDate(deadline.getDate() + daysUntil)
    deadline.setHours(18, 0, 0, 0)
  }

  const numberMatch = text.match(/(\d+)\s*(天|小时|小时|日|周)/)
  if (numberMatch) {
    const num = parseInt(numberMatch[1])
    const unit = numberMatch[2]
    deadline = new Date(now)
    
    if (unit === '天' || unit === '日') {
      deadline.setDate(deadline.getDate() + num)
    } else if (unit.includes('小时')) {
      deadline.setHours(deadline.getHours() + num)
    } else if (unit === '周') {
      deadline.setDate(deadline.getDate() + num * 7)
    }
  }

  return deadline
}

function extractTaskTitle(text) {
  let title = text
    .replace(/P0|P1|P2|P3|紧急|重要|普通|低优|今天|明天|周五|周六|周日|本周|下周/g, '')
    .replace(/\d+\s*(天|小时|日|周)/g, '')
    .replace(/完成|提交|准备|写|做|开始|结束/g, '')
    .trim()
  
  if (!title || title.length < 2) {
    const match = text.match(/[完成提交准备写做开始结束]+(.+)/)
    if (match) {
      title = match[1].trim()
    } else {
      title = text.substring(0, 30)
    }
  }
  
  return title
}

function generateResponse(message, persona, task) {
  const { tone = 'gentle' } = persona || {}
  
  if (!task) {
    const casualResponses = {
      gentle: ['好的呀！有什么需要帮忙的随时说~ 🌟', '收到！我在这里陪着你 💪', '没问题，我们一起加油！✨'],
      motivational: ['let's go! 让我们搞起来！💪', '太棒了！干就完了！🚀', '好极了！一起创造奇迹！🌟'],
      humorous: ['哈哈，收到收到！😄', '没问题啦~ 我们一起搞定！😂', '好的好的，包在我身上！🎉']
    }
    return casualResponses[tone][Math.floor(Math.random() * 3)]
  }

  const priorityEmoji = {
    P0: '🔥',
    P1: '⭐',
    P2: '📌',
    P3: '📝'
  }

  const timeStr = task.deadline 
    ? `，截止时间是${new Date(task.deadline).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}`
    : ''

  const responses = {
    gentle: `收到啦！已为你创建任务：${priorityEmoji[task.priority]} **${task.title}**，优先级${task.priority}，${timeStr}。相信你一定能高质量完成的！💪✨`,
    motivational: `${task.priority === 'P0' ? '冲冲冲！这是紧急任务！' : '好样的！'} 已创建任务：${priorityEmoji[task.priority]} **${task.title}**，${timeStr}。让我们一起搞定它！💪🔥`,
    humorous: `哈哈，记下来啦！${priorityEmoji[task.priority]} **${task.title}**，${timeStr}。有了我，再也不会忘啦~ 😂✨`
  }

  return responses[tone]
}

function isTaskRelatedMessage(text) {
  const taskKeywords = [
    '完成', '提交', '准备', '写', '做', '开始', '结束',
    '任务', 'todo', 'to-do', '要做', '要做的事',
    'deadline', 'ddl', '截止', '交付', '上线'
  ]
  
  return taskKeywords.some(keyword => text.includes(keyword)) || /\d+\s*(天|小时|日|周)/.test(text)
}

router.post('/', async (req, res) => {
  try {
    const { message } = req.body
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required' })
    }

    const db = getDb()
    const persona = db.prepare('SELECT * FROM personas ORDER BY created_at DESC LIMIT 1').get()
    
    let task = null
    const messageId = uuidv4()

    if (isTaskRelatedMessage(message)) {
      const title = extractTaskTitle(message)
      const priority = extractPriority(message)
      const deadline = extractDeadline(message)
      
      if (title && title.length >= 2) {
        const taskId = uuidv4()
        
        db.prepare(`
          INSERT INTO tasks (id, title, priority, deadline, status)
          VALUES (?, ?, ?, ?, 'todo')
        `).run(taskId, title, priority, deadline ? deadline.toISOString() : null)

        task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId)
      }
    }

    const reply = generateResponse(message, persona, task)

    db.prepare(`
      INSERT INTO messages (id, role, content, task_id)
      VALUES (?, 'user', ?, ?)
    `).run(messageId, message, task ? task.id : null)

    const assistantMessageId = uuidv4()
    db.prepare(`
      INSERT INTO messages (id, role, content, task_id)
      VALUES (?, 'assistant', ?, ?)
    `).run(assistantMessageId, reply, task ? task.id : null)

    res.json({
      success: true,
      data: {
        reply,
        task,
        messageId: assistantMessageId
      }
    })
  } catch (error) {
    console.error('Error processing chat:', error)
    res.status(500).json({ success: false, error: 'Failed to process message' })
  }
})

export default router
