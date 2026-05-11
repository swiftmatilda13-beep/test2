import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDb } from '../models/database.js'

const router = express.Router()

router.get('/', (req, res) => {
  try {
    const db = getDb()
    const persona = db.prepare('SELECT * FROM personas ORDER BY created_at DESC LIMIT 1').get()
    res.json({ success: true, data: persona })
  } catch (error) {
    console.error('Error fetching persona:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch persona' })
  }
})

router.post('/', (req, res) => {
  try {
    const { name, tone = 'gentle', greeting, specialties = [] } = req.body
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' })
    }

    const db = getDb()
    const id = uuidv4()
    
    db.prepare(`
      INSERT INTO personas (id, name, tone, greeting, specialties)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, name, tone, greeting || null, JSON.stringify(specialties))

    const persona = db.prepare('SELECT * FROM personas WHERE id = ?').get(id)
    
    if (persona && persona.specialties) {
      persona.specialties = JSON.parse(persona.specialties)
    }
    
    res.json({ success: true, data: persona })
  } catch (error) {
    console.error('Error creating persona:', error)
    res.status(500).json({ success: false, error: 'Failed to create persona' })
  }
})

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params
    const { name, tone, greeting, specialties } = req.body
    
    const db = getDb()
    
    const updates = []
    const values = []
    
    if (name !== undefined) { updates.push('name = ?'); values.push(name) }
    if (tone !== undefined) { updates.push('tone = ?'); values.push(tone) }
    if (greeting !== undefined) { updates.push('greeting = ?'); values.push(greeting) }
    if (specialties !== undefined) { updates.push('specialties = ?'); values.push(JSON.stringify(specialties)) }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' })
    }
    
    values.push(id)
    
    db.prepare(`UPDATE personas SET ${updates.join(', ')} WHERE id = ?`).run(...values)
    
    const persona = db.prepare('SELECT * FROM personas WHERE id = ?').get(id)
    
    if (!persona) {
      return res.status(404).json({ success: false, error: 'Persona not found' })
    }
    
    if (persona.specialties) {
      persona.specialties = JSON.parse(persona.specialties)
    }
    
    res.json({ success: true, data: persona })
  } catch (error) {
    console.error('Error updating persona:', error)
    res.status(500).json({ success: false, error: 'Failed to update persona' })
  }
})

export default router
