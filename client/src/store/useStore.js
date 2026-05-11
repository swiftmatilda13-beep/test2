import { create } from 'zustand'

const API_BASE = '/api'

export const useStore = create((set, get) => ({
  tasks: [],
  messages: [],
  persona: null,
  isLoading: false,
  isTyping: false,
  showPersonaSetup: false,

  setShowPersonaSetup: (show) => set({ showPersonaSetup: show }),

  fetchTasks: async () => {
    set({ isLoading: true })
    try {
      const res = await fetch(`${API_BASE}/tasks`)
      const data = await res.json()
      if (data.success) {
        set({ tasks: data.data })
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  addTask: async (task) => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      })
      const data = await res.json()
      if (data.success) {
        set((state) => ({ tasks: [...state.tasks, data.data] }))
        return data.data
      }
    } catch (error) {
      console.error('Failed to add task:', error)
    }
    return null
  },

  updateTask: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const data = await res.json()
      if (data.success) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? data.data : t))
        }))
        return data.data
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    }
    return null
  },

  deleteTask: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id)
        }))
        return true
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
    return false
  },

  sendMessage: async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    
    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true
    }))

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      })
      const data = await res.json()
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.data.reply,
        timestamp: new Date(),
        task: data.data.task
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isTyping: false
      }))

      if (data.data.task) {
        const { tasks } = get()
        if (!tasks.find(t => t.id === data.data.task.id)) {
          set((state) => ({
            tasks: [...state.tasks, data.data.task]
          }))
        }
      }

      return assistantMessage
    } catch (error) {
      console.error('Failed to send message:', error)
      set({ isTyping: false })
      return null
    }
  },

  fetchPersona: async () => {
    try {
      const res = await fetch(`${API_BASE}/persona`)
      const data = await res.json()
      if (data.success) {
        set({ 
          persona: data.data,
          showPersonaSetup: !data.data
        })
      } else {
        set({ showPersonaSetup: true })
      }
    } catch (error) {
      console.error('Failed to fetch persona:', error)
      set({ showPersonaSetup: true })
    }
  },

  savePersona: async (personaData) => {
    try {
      const res = await fetch(`${API_BASE}/persona`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personaData)
      })
      const data = await res.json()
      if (data.success) {
        set({ 
          persona: data.data,
          showPersonaSetup: false,
          messages: [{
            id: 'welcome',
            role: 'assistant',
            content: data.data.greeting,
            timestamp: new Date()
          }]
        })
        return true
      }
    } catch (error) {
      console.error('Failed to save persona:', error)
    }
    return false
  }
}))
