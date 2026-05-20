import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

interface AppSettings {
  enableCache: boolean
  defaultTab: 'qrcode' | 'json' | 'url'
}

const DEFAULT_SETTINGS: AppSettings = {
  enableCache: true,
  defaultTab: 'qrcode',
}

export function useCachedInput(key: string, initialValue: string) {
  const [settings] = useLocalStorage<AppSettings>('itools_settings', DEFAULT_SETTINGS)

  // Initialize state
  const [value, setValue] = useState(() => {
    if (settings.enableCache) {
      try {
        const item = window.localStorage.getItem(key)
        // If stored item exists, use it. JSON.parse needed if stored via useLocalStorage? 
        // We will store as raw string or JSON. Let's consistency store raw string for inputs if possible or JSON string.
        // Let's assume JSON string to be safe with newlines etc.
        return item ? JSON.parse(item) : initialValue
      } catch {
        return initialValue
      }
    }
    return initialValue
  })

  // Update storage when value changes, if caching enabled
  useEffect(() => {
    if (settings.enableCache) {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value, settings.enableCache])

  // Clear cached data when caching is disabled
  useEffect(() => {
    if (!settings.enableCache) {
      window.localStorage.removeItem(key)
    }
  }, [key, settings.enableCache])

  return [value, setValue] as const
}
