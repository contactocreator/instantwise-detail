import { useState, useEffect } from 'react'
import { useOverlayStore } from '../../store/overlayStore'
import './SelectionPopup.css'

type QuickAction = 'correct' | 'rewrite' | 'formal' | 'summarize'

export default function SelectionPopup() {
  const { selectedText, setMode } = useOverlayStore()
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<QuickAction | null>(null)

  useEffect(() => {
    // 5초 후 팝업 자동 닫기 (결과 없을 때)
    if (!result && !isLoading) {
      const timer = setTimeout(() => setMode('mini'), 5000)
      return () => clearTimeout(timer)
    }
  }, [result, isLoading, setMode])

  const handleAction = async (action: QuickAction) => {
    if (!selectedText || isLoading) return
    setIsLoading(true)
    setActiveAction(action)
    setResult('')

    const res = await window.electronAPI?.quickEdit({
      text: selectedText,
      action,
    })

    setIsLoading(false)
    if (res?.success && res.result) {
      setResult(res.result)
    }
  }

  const handleApply = async () => {
    if (!result) return
    await window.electronAPI?.copyToClipboard(result)
    setMode('mini')
  }

  const actions: { key: QuickAction; label: string }[] = [
    { key: 'correct', label: '교정' },
    { key: 'rewrite', label: '다시쓰기' },
    { key: 'formal', label: '격식체' },
    { key: 'summarize', label: '요약' },
  ]

  return (
    <div className="selection-popup">
      {!result && !isLoading && (
        <div className="popup-actions">
          <span className="popup-label">
            "{selectedText.slice(0, 20)}{selectedText.length > 20 ? '…' : ''}"
          </span>
          <div className="popup-buttons">
            {actions.map((a) => (
              <button
                key={a.key}
                className="popup-btn"
                onClick={() => handleAction(a.key)}
              >
                {a.label}
              </button>
            ))}
            <button className="popup-btn close" onClick={() => setMode('mini')}>
              ✕
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="popup-loading">
          <span className="loading-dots">
            {activeAction && actions.find((a) => a.key === activeAction)?.label} 중
          </span>
        </div>
      )}

      {result && !isLoading && (
        <div className="popup-result">
          <p className="result-text">{result}</p>
          <div className="result-actions">
            <button className="popup-btn apply" onClick={handleApply}>
              복사 후 적용
            </button>
            <button className="popup-btn" onClick={() => setResult('')}>
              다시
            </button>
            <button className="popup-btn close" onClick={() => setMode('mini')}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
