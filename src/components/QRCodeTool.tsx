import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Download, Copy, Check, Link, AlertCircle } from 'lucide-react'
import { useCachedInput } from '../hooks/useCachedInput'

export default function QRCodeTool() {
  const [text, setText] = useCachedInput('itools_cache_qr', 'https://google.com')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(text || ' ', {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then((url) => {
        if (!cancelled) {
          setQrDataUrl(url)
          setQrError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setQrError('Failed to generate QR code')
          console.error(err)
        }
      })
    return () => { cancelled = true }
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
      setCopyFailed(true)
      setTimeout(() => setCopyFailed(false), 2000)
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
            aria-label="QR code content"
            rows={3}
          />
      </div>

      {/* QR Display */}
      <div className="flex-1 flex justify-center items-center min-h-0">
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 qr-pop">
            {qrError ? (
              <div className="w-64 h-64 flex flex-col items-center justify-center gap-2 text-red-500">
                <AlertCircle size={32} />
                <span className="text-xs text-center">{qrError}</span>
              </div>
            ) : qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 rounded-lg object-contain" />
            ) : null}
          </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
            onClick={handleCopy}
            aria-label="Copy QR code to clipboard"
            className="flex-1 btn-modern justify-center bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          {copied ? <Check size={16} className="text-green-500" /> : copyFailed ? <AlertCircle size={16} className="text-red-500" /> : <Copy size={16} />}
          <span>{copied ? 'Copied' : copyFailed ? 'Failed' : 'Copy'}</span>
        </button>
        <button
            onClick={handleDownload}
            aria-label="Download QR code"
            className="flex-1 btn-modern justify-center bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 shadow-sm"
        >
          <Download size={16} />
          <span>Download</span>
        </button>
      </div>
    </div>
  )
}
