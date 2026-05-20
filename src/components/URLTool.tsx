import { useState } from 'react'
import { ArrowDownUp, Copy, Check, Trash2, AlertCircle, Link } from 'lucide-react'
import { useCachedInput } from '../hooks/useCachedInput'

export default function URLTool() {
  const [input, setInput] = useCachedInput('itools_cache_url', '')
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [mode, setMode] = useState<'encode' | 'decode'>('decode')

  const output = useURLProcess(input, mode)

  const handleCopy = async () => {
    try {
      if (!output.text) return
      await navigator.clipboard.writeText(output.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setCopyFailed(true)
      setTimeout(() => setCopyFailed(false), 2000)
      console.error(err)
    }
  }

  const handleClear = () => {
    setInput('')
    setCopied(false)
  }

  const handleFillCurrentUrl = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0]?.url
            if (url) setInput(url)
        })
    }
  }

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-slate-50 overflow-hidden">
      
      {/* Input Section */}
      <div className="flex flex-col gap-2 flex-1 min-h-0">
         <div className="flex justify-between items-center px-1">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Link size={12} /> Input
             </div>
             <button 
                onClick={handleFillCurrentUrl}
                className="text-xs border-transparent btn-modern"
                title="Fill with current tab URL"
            >
                Current Tab
            </button>
         </div>
         <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full flex-1 p-3 font-mono text-sm bg-white border border-gray-200 rounded-lg outline-none resize-none transition-all focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] text-gray-700"
            placeholder={mode === 'encode' ? "Enter text to encode..." : "Enter URL to decode..."}
            aria-label="URL input"
            style={{ whiteSpace: 'pre-wrap' }}
         />
      </div>

      {/* Actions Toolbar */}
      <div className="flex justify-between items-center group">
          <div className="flex gap-2">
              <button
                onClick={() => setMode('encode')}
                className={`btn-modern ${mode === 'encode' ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm' : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'}`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`btn-modern ${mode === 'decode' ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm' : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'}`}
              >
                Decode
              </button>
          </div>
          
          <div className="flex gap-2">
            <button 
                onClick={handleCopy}
                disabled={!output.text || !!output.error}
                className={`icon-btn ${(!output.text || output.error) ? 'opacity-50 cursor-not-allowed text-gray-300' : 'hover:bg-blue-50 hover:text-blue-600 text-gray-500'}`}
                title="Copy Result"
                aria-label="Copy result"
            >
                {copied ? <Check size={18} className="text-green-500"/> : copyFailed ? <AlertCircle size={18} className="text-red-500"/> : <Copy size={18}/>}
            </button>
            <button 
                onClick={handleClear}
                className="icon-btn hover:bg-red-50 hover:text-red-500 text-gray-500"
                title="Clear All"
                aria-label="Clear all"
            >
                <Trash2 size={18} />
            </button>
          </div>
      </div>

      {/* Output Section */}
      <div className="flex flex-col gap-2 flex-1 min-h-0">
         <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
            <ArrowDownUp size={12} /> Output
         </div>
         <div className={`relative w-full flex-1 min-h-0 p-3 font-mono word-break overflow-x-auto text-sm bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto break-all transition-colors ${output.error ? 'border-red-200 bg-red-50 text-red-600' : 'text-gray-600'}`}>
             {output.error ? (
                 <span className="flex items-center gap-2"><AlertCircle size={14}/> {output.error}</span>
             ) : (
                 output.text || <span className="text-gray-400 italic opacity-50">Result will appear here...</span>
             )}
         </div>
      </div>

    </div>
  )
}

function useURLProcess(input: string, mode: 'encode' | 'decode') {
    if (!input) return { text: '', error: null }
    try {
        const text = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input)
        return { text, error: null }
    } catch {
        return { text: '', error: 'Malformatted URI sequence' }
    }
}
