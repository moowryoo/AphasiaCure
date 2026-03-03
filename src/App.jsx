import { useState } from 'react'
import TabBar from './components/TabBar'

function App() {
  const [activeTab, setActiveTab] = useState('communicate')

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="flex items-center justify-center h-[80vh]">
        <h1 className="text-3xl font-bold text-bark">
          {activeTab === 'communicate' && '💬 Communicate'}
          {activeTab === 'exercise' && '🧠 Exercise'}
          {activeTab === 'settings' && '⚙️ Settings'}
        </h1>
      </div>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
