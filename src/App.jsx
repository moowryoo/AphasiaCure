import { useState } from 'react'
import TabBar from './components/TabBar'
import CommunicateScreen from './screens/CommunicateScreen'
import ExerciseScreen from './screens/ExerciseScreen'
import SettingsScreen from './screens/SettingsScreen'

function App() {
  const [activeTab, setActiveTab] = useState('communicate')

  return (
    <div className="min-h-screen bg-cream pb-24">
      {activeTab === 'communicate' && <CommunicateScreen />}
      {activeTab === 'exercise' && <ExerciseScreen />}
      {activeTab === 'settings' && <SettingsScreen />}

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
