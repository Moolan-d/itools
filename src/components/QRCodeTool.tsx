import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import { Download, Copy, Check, Link } from 'lucide-react'
import { useCachedInput } from '../hooks/useCachedInput'

export default function QRCodeTool() {
  const [text, setText] = useCachedInput('itools_cache_qr', 'https://google.com')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const generateQR = async (input: string) => {
    try {
      const url = await QRCode.toDataURL(input || ' ', {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
      setQrDataUrl(url)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    generateQR(text)
  }, [text])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = qrDataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopy = async () => {
    try {
      const blob = await (await fetch(qrDataUrl)).blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const fillCurrentUrl = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0]?.url
        if (url) setText(url)
      })
    }
  }

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-slate-50">
      {/* Input Section */}
      <div className="flex flex-col gap-2">
         <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Link size={12} /> Content
            </div>
            <button 
                onClick={fillCurrentUrl}
                className="text-xs border-transparent btn-modern"
                title="Fill with current tab URL"
            >
                Current Tab
            </button>
         </div>
         <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 font-mono text-sm bg-white border border-gray-200 rounded-lg outline-none resize-none transition-all focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] text-gray-700"
            placeholder="Enter URL or text..."
            rows={3}
          />
      </div>

      {/* QR Display */}
      <div className="flex-1 flex justify-center items-center min-h-0">
          <motion.div
            className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
          >
            {qrDataUrl && (
              <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 rounded-lg object-contain" />
            )}
          </motion.div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button 
            onClick={handleCopy} 
            className="flex-1 btn-modern justify-center bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
        <button 
            onClick={handleDownload} 
            className="flex-1 btn-modern justify-center bg-blue-500 border-transparent text-white hover:bg-blue-600 shadow-md shadow-blue-200"
        >
          <Download size={16} />
          <span>Download</span>
        </button>
      </div>
    </div>
  )
}
