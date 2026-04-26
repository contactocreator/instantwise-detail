import { useEffect } from 'react'
import { useOverlayStore, OverlayMode } from './store/overlayStore'
import OverlayShell from './components/overlay/OverlayShell'
import SelectionPopup from './components/overlay/SelectionPopup'
import MainPanel from './components/panel/MainPanel'

export default function App() {
  const { mode, setMode, setSelection } = useOverlayStore()

  useEffect(() => {
    // 선택 텍스트 감지
    window.electronAPI?.onSelectionChanged((data) => {
      setSelection(data.text, data.x, data.y)
      if (mode === 'mini' || mode === 'hidden') {
        setMode('selection-popup')
      }
    })

    return () => {
      window.electronAPI?.removeAllListeners('selection:changed')
    }
  }, [mode, setMode, setSelection])

  return (
    <div className="app-root">
      {mode === 'selection-popup' && <SelectionPopup />}
      {(mode === 'mini' || mode === 'expanded') && (
        <OverlayShell>
          {mode === 'expanded' && <MainPanel />}
        </OverlayShell>
      )}
      {mode === 'hidden' && <OverlayShell />}
    </div>
  )
}
