import { useState } from 'react'
import TabBar from './components/TabBar'
import CommunicateScreen from './screens/CommunicateScreen'
import ExerciseScreen from './screens/ExerciseScreen'

function App() {
  const [activeTab, setActiveTab] = useState('communicate')

  return (
    <div className="min-h-screen bg-cream pb-24">
      {activeTab === 'communicate' && <CommunicateScreen />}
      {activeTab === 'exercise' && <ExerciseScreen />}
      {activeTab === 'settings' && (
        <div className="flex items-center justify-center h-[80vh]">
          <h1 className="text-3xl font-bold text-bark">⚙️ Settings</h1>
        </div>
      )}

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
