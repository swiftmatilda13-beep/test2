import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

import taskRoutes from './routes/tasks.js'
import personaRoutes from './routes/persona.js'
import chatRoutes from './routes/chat.js'
import feishuRoutes from './routes/feishu.js'
import { initDatabase } from './models/database.js'
import { setupSocket } from './socket/index.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

initDatabase()

app.use('/api/tasks', taskRoutes)
app.use('/api/persona', personaRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/feishu', feishuRoutes)

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date() })
})

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

setupSocket(io)

export { app, io }
