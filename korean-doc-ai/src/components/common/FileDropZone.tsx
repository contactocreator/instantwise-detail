import { useState, useCallback } from 'react'
import { useDocumentStore } from '../../store/documentStore'
import './FileDropZone.css'

const SUPPORTED = ['.hwpx', '.docx', '.pdf', '.txt', '.md']

export default function FileDropZone() {
  const [isDragging, setIsDragging] = useState(false)
  const { setDocument, setLoading, setError } = useDocumentStore()

  const handleFile = useCallback(
    async (filePath: string) => {
      setLoading(true)
      setError(null)
      const res = await window.electronAPI?.parseFile(filePath)
      setLoading(false)

      if (res?.success) {
        setDocument(res.data)
      } else {
        setError(res?.error ?? '파일을 열 수 없습니다.')
      }
    },
    [setDocument, setLoading, setError]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (!file) return

    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!SUPPORTED.includes(ext)) {
      setError(`지원하지 않는 형식입니다. (지원: ${SUPPORTED.join(', ')})`)
      return
    }

    // Electron에서 파일 경로 접근
    const path = (file as File & { path?: string }).path || file.name
    await handleFile(path)
  }

  return (
    <div
      className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="drop-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <polyline points="9 15 12 12 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="drop-text">파일을 여기에 드래그하세요</p>
      <p className="drop-hint">{SUPPORTED.join(' · ')}</p>
    </div>
  )
}
