import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, FileJson, Link, Settings } from 'lucide-react'

import QRCodeTool from './components/QRCodeTool'
import JSONTool from './components/JSONTool'
import URLTool from './components/URLTool'
import SettingsPage from './components/SettingsPage'
import { useLocalStorage } from './hooks/useLocalStorage'

type Tab = 'qrcode' | 'json' | 'url' | 'settings'

function App() {
  const [settings] = useLocalStorage<{ defaultTab: Tab }>('itools_settings', { defaultTab: 'qrcode' })
  const [activeTab, setActiveTab] = useState<Tab>(() => settings.defaultTab || 'qrcode')

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'qrcode', label: 'QR Code', icon: <QrCode size={18} /> },
    { id: 'json', label: 'JSON', icon: <FileJson size={18} /> },
    { id: 'url', label: 'URL', icon: <Link size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ]

  return (
    <div className="app-container">
      <nav className="nav-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-pill"
                className="active-pill"
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="content-area">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex-1 flex flex-col overflow-hidden"
          >
            {activeTab === 'qrcode' && <QRCodeTool />}
            {activeTab === 'json' && <JSONTool />}
            {activeTab === 'url' && <URLTool />}
            {activeTab === 'settings' && <SettingsPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
