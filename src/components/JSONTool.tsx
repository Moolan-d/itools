import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Trash2, AlertCircle, FileJson, CheckCircle, XCircle } from 'lucide-react'
import { useCachedInput } from '../hooks/useCachedInput'

export default function JSONTool() {
  const [input, setInput] = useCachedInput('itools_cache_json', '')
  const [mode, setMode] = useState<'pretty' | 'minify' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isValid, setIsValid] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const metaInfo = useMemo(() => {
    if (!input) return null
    try {
      const parsed = JSON.parse(input)
      const sizeBytes = new Blob([input]).size
      const type = Array.isArray(parsed) ? 'Array' : typeof parsed === 'object' ? 'Object' : typeof parsed
      const keys = type === 'Object' ? Object.keys(parsed).length : type === 'Array' ? parsed.length : 0
      return { sizeBytes, type, keys }
    } catch {
      return null
    }
  }, [input])

  const adjustHeight = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [input])

  const handleFormat = () => {
    try {
      if (!input.trim()) return
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed, null, 2))
      setMode('pretty')
      setError(null)
      setIsValid(true)
    } catch (err) {
      setError((err as Error).message)
      setIsValid(false)
    }
  }

  const handleMinify = () => {
    try {
      if (!input.trim()) return
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed))
      setMode('minify')
      setError(null)
      setIsValid(true)
    } catch (err) {
      setError((err as Error).message)
      setIsValid(false)
    }
  }

  useEffect(() => {
    if (input && input.trim()) {
      try {
        const parsed = JSON.parse(input)
        setInput(JSON.stringify(parsed, null, 2))
        setMode('pretty')
        setError(null)
        setIsValid(true)
      } catch (err) {
        setError((err as Error).message)
        setIsValid(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInput = (val: string) => {
      setInput(val)
      setMode(null) // Reset mode on manual edit
      setError(null)
      try {
          if (val.trim()) {
            JSON.parse(val)
            setIsValid(true)
          } else {
            setIsValid(false)
          }
      } catch {
          setIsValid(false)
      }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const handleClear = () => {
    setInput('')
    setMode(null)
    setError(null)
    setIsValid(false)
  }

  return (
    <div className="flex flex-col h-full gap-3 p-4 bg-slate-50">
      <div className="flex justify-between items-center group">
         <div className="flex gap-2">
            <button 
                onClick={handleFormat} 
                className={`btn-modern ${mode === 'pretty' ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm' : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'}`}
            >
                Prettify
            </button>
            <button 
                onClick={handleMinify} 
                className={`btn-modern ${mode === 'minify' ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm' : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'}`}
            >
                Compress
            </button>
         </div>
         <div className="flex gap-2">
            <button 
                onClick={handleCopy} 
                className={`icon-btn ${copied ? 'text-green-500 bg-green-50' : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'}`}
                title="Copy"
            >
                {copied ? <Check size={18}/> : <Copy size={18}/>}
            </button>
            <button 
                onClick={handleClear} 
                className="icon-btn hover:bg-red-50 hover:text-red-500 text-gray-500" 
                title="Clear"
            >
                <Trash2 size={18}/>
            </button>
         </div>
      </div>

      <div className="relative group">
         <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            className={`w-full p-4 font-mono text-xs rounded-lg border-2 outline-none resize-none transition-all duration-200 
                ${isValid ? 'border-green-400 shadow-[0_0_0_4px_rgba(74,222,128,0.1)]' : 'border-gray-200 focus:border-blue-400'}
                ${error ? '!border-red-400 !bg-red-50' : ''}
            `}
            spellCheck={false}
            placeholder='Paste JSON here...'
            rows={8} 
            style={{ 
                color: '#334155', 
                whiteSpace: 'pre-wrap', 
                minHeight: '120px',
                maxHeight: '400px', // Approx 20 lines
                overflowY: 'auto'   // Show scrollbar when exceeded
            }}
         />
         
         <AnimatePresence>
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-2 right-2 bg-red-100 text-red-600 px-3 py-1 rounded text-xs flex items-center gap-1 shadow-sm border border-red-200 pointer-events-none"
                >
                    <AlertCircle size={14} /> {error}
                </motion.div>
            )}
         </AnimatePresence>
      </div>

      <div className="h-8 bg-gray-50 rounded border border-gray-100 flex items-center px-3 justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className={`flex items-center gap-2 ${isValid ? 'text-green-600 font-medium' : input ? 'text-red-500 font-medium' : ''}`}>
                {isValid ? <CheckCircle size={14} className="text-green-500"/> : input ? <XCircle size={14} className="text-red-500"/> : <FileJson size={14} className="text-gray-400"/>}
                {isValid ? 'Valid JSON' : input ? 'Invalid JSON' : 'Empty'}
            </span>
          </div>
          {metaInfo && (
              <div className="flex gap-3">
                  <span className="flex items-center gap-1"><FileJson size={12}/> {metaInfo.type}</span>
                  <span>{metaInfo.keys} items</span>
                  <span className="opacity-50">|</span>
                  <span>{(metaInfo.sizeBytes / 1024).toFixed(2)} KB</span>
              </div>
          )}
      </div>
    </div>
  )
}
