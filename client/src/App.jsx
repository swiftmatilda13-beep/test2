import React, { useEffect } from 'react'
import { useStore } from './store/useStore'
import PersonaSetup from './components/PersonaSetup'
import ChatInterface from './components/ChatInterface'
import TaskSidebar from './components/TaskSidebar'
import Timeline from './components/Timeline'
import Header from './components/Header'

export default function App() {
  const { showPersonaSetup, persona, fetchPersona, fetchTasks, savePersona } = useStore()

  useEffect(() => {
    fetchPersona()
    fetchTasks()
  }, [fetchPersona, fetchTasks])

  const handlePersonaComplete = async (personaData) => {
    await savePersona(personaData)
  }

  if (showPersonaSetup) {
    return <PersonaSetup onComplete={handlePersonaComplete} />
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Header persona={persona} />
      
      <div className="flex-1 flex overflow-hidden">
        <TaskSidebar />
        
        <main className="flex-1 flex flex-col max-w-4xl mx-auto px-4 py-4">
          <ChatInterface persona={persona} />
        </main>
        
        <Timeline />
      </div>
    </div>
  )
}
