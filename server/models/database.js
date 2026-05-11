import Database from 'sql.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let db = null
let dbPath = null

export async function initDatabase() {
  const SQL = await Database
  
  const dataDir = join(__dirname, '../data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  dbPath = process.env.DATABASE_PATH || join(dataDir, 'app.db')
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }
  
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT DEFAULT 'P2' CHECK(priority IN ('P0', 'P1', 'P2', 'P3')),
      deadline DATETIME,
      status TEXT DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'done')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS personas (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tone TEXT DEFAULT 'gentle' CHECK(tone IN ('strict', 'gentle', 'humorous', 'motivational')),
      greeting TEXT,
      specialties TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      task_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      feishu_open_id TEXT,
      persona_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  saveToFile()
  console.log('✅ Database initialized successfully')
}

export function getDb() {
  return {
    prepare: (sql) => ({
      run: (...params) => {
        db.run(sql, params)
        saveToFile()
        return { changes: db.getRowsModified() }
      },
      get: (...params) => {
        const stmt = db.prepare(sql)
        stmt.bind(params)
        if (stmt.step()) {
          const row = stmt.getAsObject()
          stmt.free()
          return row
        }
        stmt.free()
        return null
      },
      all: (...params) => {
        const results = []
        const stmt = db.prepare(sql)
        if (params.length > 0) {
          stmt.bind(params)
        }
        while (stmt.step()) {
          results.push(stmt.getAsObject())
        }
        stmt.free()
        return results
      }
    })
  }
}

function saveToFile() {
  if (db && dbPath) {
    const data = db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(dbPath, buffer)
  }
}

export default { getDb, initDatabase }
