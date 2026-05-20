import { useState, useRef, useCallback } from 'react'
import { QrCode, FileJson, Link, Settings } from 'lucide-react'

import QRCodeTool from './components/QRCodeTool'
import JSONTool from './components/JSONTool'
import URLTool from './components/URLTool'
import SettingsPage from './components/SettingsPage'
import { useLocalStorage } from './hooks/useLocalStorage'

type Tab = 'qrcode' | 'json' | 'url' | 'settings'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'qrcode', label: 'QR Code', icon: <QrCode size={18} /> },
  { id: 'json', label: 'JSON', icon: <FileJson size={18} /> },
  { id: 'url', label: 'URL', icon: <Link size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
]

const TAB_CONTENT: Record<Tab, React.ReactNode> = {
  qrcode: <QRCodeTool />,
  json: <JSONTool />,
  url: <URLTool />,
  settings: <SettingsPage />,
}

const EXIT_DURATION = 150

function App() {
  const [settings] = useLocalStorage<{ defaultTab: Tab }>('itools_settings', { defaultTab: 'qrcode' })
  const [activeTab, setActiveTab] = useState<Tab>(() => settings.defaultTab || 'qrcode')
  const [exitingTab, setExitingTab] = useState<Tab | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const handleTabChange = useCallback((next: Tab) => {
    if (next === activeTab) return
    clearTimeout(timerRef.current)
    setExitingTab(activeTab)
    setActiveTab(next)
    timerRef.current = setTimeout(() => setExitingTab(null), EXIT_DURATION)
  }, [activeTab])

  return (
    <div className="app-container">
      <nav className="nav-bar" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => handleTabChange(tab.id)}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          >
            {activeTab === tab.id && <div className="active-pill" />}
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="content-area">
        {exitingTab && exitingTab !== activeTab && (
          <div
            key={`exit-${exitingTab}`}
            role="tabpanel"
            className="tab-panel tab-exit"
          >
            {TAB_CONTENT[exitingTab]}
          </div>
        )}
        <div
          key={`enter-${activeTab}`}
          id={`panel-${activeTab}`}
          role="tabpanel"
          className="tab-panel tab-enter"
        >
          {TAB_CONTENT[activeTab]}
        </div>
      </main>
    </div>
  )
}

export default App
