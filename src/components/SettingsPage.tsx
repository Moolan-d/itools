import { Save, Layout } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface AppSettings {
  enableCache: boolean
  defaultTab: 'qrcode' | 'json' | 'url'
}

export const DEFAULT_SETTINGS: AppSettings = {
  enableCache: true,
  defaultTab: 'qrcode',
}

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('itools_settings', DEFAULT_SETTINGS)

  const toggleCache = () => {
    setSettings(prev => ({ ...prev, enableCache: !prev.enableCache }))
  }

  const setDefaultTab = (tab: AppSettings['defaultTab']) => {
    setSettings(prev => ({ ...prev, defaultTab: tab }))
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-50 h-full">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-1 mb-2">Preferences</h2>
      
      {/* Cache Settings */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                 <Save size={18} />
             </div>
             <div className="flex flex-col">
                 <span className="text-sm font-semibold text-gray-800">Cache Last Input</span>
                 <span className="text-xs text-gray-500">Restore your last content on startup</span>
             </div>
         </div>
         <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={settings.enableCache} onChange={toggleCache} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
         </label>
      </div>

      {/* Default Tab Settings */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
         <div className="flex items-center gap-3">
             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                 <Layout size={18} />
             </div>
             <div className="flex flex-col">
                 <span className="text-sm font-semibold text-gray-800">Default Tab</span>
                 <span className="text-xs text-gray-500">Choose which tool opens first</span>
             </div>
         </div>
         
         <div className="grid grid-cols-3 gap-2 mt-2">
             {(['qrcode', 'json', 'url'] as const).map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setDefaultTab(tab)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all
                        ${settings.defaultTab === tab 
                            ? 'bg-blue-50 border-blue-200 text-blue-600 ring-2 ring-blue-100' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }
                    `}
                 >
                     {tab.toUpperCase()}
                 </button>
             ))}
         </div>
      </div>
      
      <div className="mt-auto flex flex-col items-end justify-end p-4">
          <p className="text-xxs text-gray-400">iTools v{__APP_VERSION__} by moolan</p>      </div>
    </div>
  )
}
