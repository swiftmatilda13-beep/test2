import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDb } from '../models/database.js'

const router = express.Router()

router.get('/', (req, res) => {
  try {
    const db = getDb()
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY priority ASC, deadline ASC').all()
    res.json({ success: true, data: tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch tasks' })
  }
})

router.post('/', (req, res) => {
  try {
    const { title, description, priority = 'P2', deadline, status = 'todo' } = req.body
    
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' })
    }

    const db = getDb()
    const id = uuidv4()
    
    db.prepare(`
      INSERT INTO tasks (id, title, description, priority, deadline, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, title, description, priority, deadline || null, status)

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
    res.json({ success: true, data: task })
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ success: false, error: 'Failed to create task' })
  }
})

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params
    const { title, description, priority, deadline, status } = req.body
    
    const db = getDb()
    
    const updates = []
    const values = []
    
    if (title !== undefined) { updates.push('title = ?'); values.push(title) }
    if (description !== undefined) { updates.push('description = ?'); values.push(description) }
    if (priority !== undefined) { updates.push('priority = ?'); values.push(priority) }
    if (deadline !== undefined) { updates.push('deadline = ?'); values.push(deadline) }
    if (status !== undefined) { updates.push('status = ?'); values.push(status) }
    
    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)
    
    db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values)
    
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
    
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' })
    }
    
    res.json({ success: true, data: task })
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ success: false, error: 'Failed to update task' })
  }
})

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params
    const db = getDb()
    
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
    
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' })
    }
    
    res.json({ success: true, message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ success: false, error: 'Failed to delete task' })
  }
})

export default router
