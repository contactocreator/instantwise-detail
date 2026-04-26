import { useRef } from 'react'
import { useOverlayStore } from '../../store/overlayStore'
import './OverlayShell.css'

interface Props {
  children?: React.ReactNode
}

export default function OverlayShell({ children }: Props) {
  const { mode, setMode } = useOverlayStore()
  const dragRef = useRef<{ startX: number; startY: number } | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return
    dragRef.current = { startX: e.screenX, startY: e.screenY }

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const dx = ev.screenX - dragRef.current.startX
      const dy = ev.screenY - dragRef.current.startY
      // Electron IPC로 창 이동 (실제 위치는 메인 프로세스가 관리)
      window.electronAPI?.moveOverlay({ x: window.screenX + dx, y: window.screenY + dy })
      dragRef.current = { startX: ev.screenX, startY: ev.screenY }
    }

    const onMouseUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div className={`overlay-shell ${mode}`} onMouseDown={handleMouseDown}>
      {/* 미니 툴바 (항상 표시) */}
      <div className="mini-bar">
        <div className="mini-bar-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 17l10 5 10-5" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <span className="mini-bar-title">Doc AI</span>
        </div>

        <div className="mini-bar-actions no-drag">
          {mode === 'mini' ? (
            <button
              className="mini-btn"
              onClick={() => setMode('expanded')}
              title="패널 열기"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              채팅 열기
            </button>
          ) : (
            <button
              className="mini-btn"
              onClick={() => setMode('mini')}
              title="최소화"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 확장 패널 */}
      {mode === 'expanded' && (
        <div className="expanded-content no-drag">
          {children}
        </div>
      )}
    </div>
  )
}
